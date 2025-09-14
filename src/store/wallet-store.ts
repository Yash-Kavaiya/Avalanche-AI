import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AvalancheService, { PriceService, AVALANCHE_TOKENS } from '@/lib/avalanche';
import { table } from '@devvai/devv-code-backend';
import { useAuthStore } from '@/store/auth-store';

// Types
export interface WalletInfo {
  address: string;
  label?: string;
  balance: string;
  balanceUsd: string;
  tokens: TokenBalance[];
  isLoading: boolean;
  lastUpdated: number;
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: string;
  decimals: number;
  price?: number;
}

export interface PortfolioStats {
  totalValueUsd: number;
  avaxValue: number;
  tokenValue: number;
  change24h: number;
  change24hPercent: number;
}

export interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  avaxPrice: number;
  avaxChange24h: number;
  marketCap: number;
  volume24h: number;
}

interface WalletState {
  // Connected wallets
  wallets: WalletInfo[];
  selectedWallet: string | null;
  
  // Portfolio data
  portfolioStats: PortfolioStats;
  networkStats: NetworkStats;
  
  // Loading states
  isLoadingWallets: boolean;
  isLoadingNetwork: boolean;
  
  // Auto-refresh
  refreshInterval: number;
  isAutoRefreshEnabled: boolean;
  
  // Actions
  addWallet: (address: string, label?: string) => Promise<void>;
  removeWallet: (address: string) => Promise<void>;
  updateWalletLabel: (address: string, label: string) => Promise<void>;
  setSelectedWallet: (address: string | null) => void;
  refreshWalletData: (address?: string) => Promise<void>;
  refreshNetworkData: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  setAutoRefresh: (enabled: boolean, interval?: number) => void;
  
  // Internal
  _startAutoRefresh: () => void;
  _stopAutoRefresh: () => void;
  _calculatePortfolioStats: (wallets: WalletInfo[]) => PortfolioStats;
}

// Avalanche service instance
const avalancheService = new AvalancheService('mainnet');
let refreshIntervalId: NodeJS.Timeout | null = null;

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      wallets: [],
      selectedWallet: null,
      portfolioStats: {
        totalValueUsd: 0,
        avaxValue: 0,
        tokenValue: 0,
        change24h: 0,
        change24hPercent: 0
      },
      networkStats: {
        blockNumber: 0,
        gasPrice: '25',
        avaxPrice: 0,
        avaxChange24h: 0,
        marketCap: 0,
        volume24h: 0
      },
      isLoadingWallets: false,
      isLoadingNetwork: false,
      refreshInterval: 30000, // 30 seconds
      isAutoRefreshEnabled: true,

      // Add wallet
      addWallet: async (address: string, label?: string) => {
        if (!AvalancheService.isValidAddress(address)) {
          throw new Error('Invalid Avalanche address');
        }

        const state = get();
        const existingWallet = state.wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
        
        if (existingWallet) {
          throw new Error('Wallet already added');
        }

        set({ isLoadingWallets: true });

        try {
          // Create wallet info
          const walletInfo: WalletInfo = {
            address,
            label: label || `Wallet ${state.wallets.length + 1}`,
            balance: '0',
            balanceUsd: '0',
            tokens: [],
            isLoading: true,
            lastUpdated: Date.now()
          };

          // Add to state
          set({
            wallets: [...state.wallets, walletInfo],
            selectedWallet: state.selectedWallet || address
          });

          // Save to database
          const user = useAuthStore.getState().user;
          if (user) {
            await table.addItem('exxghj9mvzls', {
              _uid: user.uid,
              address,
              label: walletInfo.label,
              is_active: true,
              added_at: new Date().toISOString()
            });
          }

          // Refresh wallet data
          await get().refreshWalletData(address);

        } catch (error) {
          console.error('Error adding wallet:', error);
          // Remove from state on error
          set({
            wallets: state.wallets.filter(w => w.address !== address)
          });
          throw error;
        } finally {
          set({ isLoadingWallets: false });
        }
      },

      // Remove wallet
      removeWallet: async (address: string) => {
        const state = get();
        
        set({
          wallets: state.wallets.filter(w => w.address !== address),
          selectedWallet: state.selectedWallet === address ? 
            (state.wallets.find(w => w.address !== address)?.address || null) : 
            state.selectedWallet
        });

        try {
          // Remove from database
          const user = useAuthStore.getState().user;
          if (user) {
            const wallets = await table.getItems('exxghj9mvzls', {
              query: { _uid: user.uid, address }
            });
            
            for (const wallet of wallets.items) {
              await table.deleteItem('exxghj9mvzls', {
                _uid: user.uid,
                _id: wallet._id
              });
            }
          }
        } catch (error) {
          console.error('Error removing wallet from database:', error);
        }
      },

      // Update wallet label
      updateWalletLabel: async (address: string, label: string) => {
        const state = get();
        
        set({
          wallets: state.wallets.map(w => 
            w.address === address ? { ...w, label } : w
          )
        });

        try {
          const user = useAuthStore.getState().user;
          if (user) {
            const wallets = await table.getItems('exxghj9mvzls', {
              query: { _uid: user.uid, address }
            });
            
            for (const wallet of wallets.items) {
              await table.updateItem('exxghj9mvzls', {
                _uid: user.uid,
                _id: wallet._id,
                label
              });
            }
          }
        } catch (error) {
          console.error('Error updating wallet label:', error);
        }
      },

      // Set selected wallet
      setSelectedWallet: (address: string | null) => {
        set({ selectedWallet: address });
      },

      // Refresh wallet data
      refreshWalletData: async (address?: string) => {
        const state = get();
        const walletsToRefresh = address ? 
          state.wallets.filter(w => w.address === address) : 
          state.wallets;

        if (walletsToRefresh.length === 0) return;

        set({ isLoadingWallets: true });

        try {
          const updatedWallets = await Promise.all(
            state.wallets.map(async (wallet) => {
              if (address && wallet.address !== address) {
                return wallet;
              }

              try {
                // Get AVAX balance
                const avaxBalance = await avalancheService.getAvaxBalance(wallet.address);
                
                // Get token balances
                const tokenBalances: TokenBalance[] = [];
                for (const [symbol, tokenInfo] of Object.entries(AVALANCHE_TOKENS)) {
                  try {
                    const balance = await avalancheService.getTokenBalance(
                      tokenInfo.address,
                      wallet.address
                    );
                    
                    if (parseFloat(balance) > 0) {
                      tokenBalances.push({
                        address: tokenInfo.address,
                        symbol: tokenInfo.symbol,
                        name: tokenInfo.name,
                        balance,
                        balanceUsd: '0', // Will be calculated with price data
                        decimals: tokenInfo.decimals
                      });
                    }
                  } catch (error) {
                    console.error(`Error fetching ${symbol} balance:`, error);
                  }
                }

                // Get current AVAX price for USD calculation
                let priceData;
                try {
                  priceData = await PriceService.getAvaxPrice();
                } catch (error) {
                  console.error('Failed to fetch live price, using fallback:', error);
                  priceData = PriceService.getFallbackAvaxPrice();
                }
                const balanceUsd = (parseFloat(avaxBalance) * priceData.usd).toFixed(2);

                return {
                  ...wallet,
                  balance: avaxBalance,
                  balanceUsd,
                  tokens: tokenBalances,
                  isLoading: false,
                  lastUpdated: Date.now()
                };
              } catch (error) {
                console.error(`Error refreshing wallet ${wallet.address}:`, error);
                return {
                  ...wallet,
                  isLoading: false
                };
              }
            })
          );

          // Calculate portfolio stats
          const portfolioStats = get()._calculatePortfolioStats(updatedWallets);

          set({
            wallets: updatedWallets,
            portfolioStats,
            isLoadingWallets: false
          });

        } catch (error) {
          console.error('Error refreshing wallet data:', error);
          set({ isLoadingWallets: false });
        }
      },

      // Refresh network data
      refreshNetworkData: async () => {
        set({ isLoadingNetwork: true });

        try {
          const networkStatsPromise = avalancheService.getNetworkStats();
          let priceDataPromise;
          
          try {
            priceDataPromise = await PriceService.getAvaxPrice();
          } catch (error) {
            console.error('Failed to fetch live price, using fallback:', error);
            priceDataPromise = PriceService.getFallbackAvaxPrice();
          }

          const [networkStats, priceData] = await Promise.all([
            networkStatsPromise,
            Promise.resolve(priceDataPromise)
          ]);

          set({
            networkStats: {
              blockNumber: networkStats.blockNumber,
              gasPrice: networkStats.gasPrice,
              avaxPrice: priceData.usd,
              avaxChange24h: priceData.usd_24h_change,
              marketCap: priceData.usd_market_cap,
              volume24h: priceData.usd_24h_vol
            },
            isLoadingNetwork: false
          });
        } catch (error) {
          console.error('Error refreshing network data:', error);
          set({ isLoadingNetwork: false });
        }
      },

      // Refresh all data
      refreshAllData: async () => {
        const promises = [
          get().refreshWalletData(),
          get().refreshNetworkData()
        ];
        
        await Promise.allSettled(promises);
      },

      // Set auto refresh
      setAutoRefresh: (enabled: boolean, interval = 30000) => {
        set({ 
          isAutoRefreshEnabled: enabled,
          refreshInterval: interval
        });

        if (enabled) {
          get()._startAutoRefresh();
        } else {
          get()._stopAutoRefresh();
        }
      },

      // Start auto refresh
      _startAutoRefresh: () => {
        const state = get();
        get()._stopAutoRefresh(); // Clear existing interval
        
        if (state.isAutoRefreshEnabled) {
          refreshIntervalId = setInterval(() => {
            get().refreshAllData();
          }, state.refreshInterval);
        }
      },

      // Stop auto refresh
      _stopAutoRefresh: () => {
        if (refreshIntervalId) {
          clearInterval(refreshIntervalId);
          refreshIntervalId = null;
        }
      },

      // Calculate portfolio stats (internal helper)
      _calculatePortfolioStats: (wallets: WalletInfo[]): PortfolioStats => {
        const totalAvax = wallets.reduce((sum, wallet) => 
          sum + parseFloat(wallet.balance), 0
        );
        
        const totalUsd = wallets.reduce((sum, wallet) => 
          sum + parseFloat(wallet.balanceUsd), 0
        );

        return {
          totalValueUsd: totalUsd,
          avaxValue: totalAvax,
          tokenValue: 0, // TODO: Calculate token values
          change24h: 0, // TODO: Calculate 24h change
          change24hPercent: 0 // TODO: Calculate 24h change percentage
        };
      }
    }),
    {
      name: 'avalanche-wallet-store',
      partialize: (state) => ({
        wallets: state.wallets.map(w => ({ ...w, isLoading: false })),
        selectedWallet: state.selectedWallet,
        refreshInterval: state.refreshInterval,
        isAutoRefreshEnabled: state.isAutoRefreshEnabled
      })
    }
  )
);

// Initialize auto refresh when store is created
useWalletStore.getState()._startAutoRefresh();