/**
 * Smart Contract Analysis and Interaction Library
 * Comprehensive tools for contract security, analysis, and interaction
 */

import { ethers } from 'ethers';
import backend from '@devvai/devv-code-backend';

// Contract security patterns and vulnerabilities
const SECURITY_PATTERNS = {
  // Common vulnerability patterns
  REENTRANCY: [
    /\.call\.value\(/gi,
    /\.call\(/gi,
    /external.*payable/gi,
    /msg\.sender\.call/gi
  ],
  INTEGER_OVERFLOW: [
    /\+\+/g,
    /\+\s*=/g,
    /\*\s*=/g,
    /unchecked/gi
  ],
  AUTHORIZATION: [
    /onlyOwner/gi,
    /require\(.*msg\.sender/gi,
    /modifier.*only/gi,
    /access.*control/gi
  ],
  TIMESTAMP_DEPENDENCE: [
    /block\.timestamp/gi,
    /block\.number/gi,
    /now\s/gi
  ],
  DELEGATECALL: [
    /delegatecall/gi,
    /assembly.*delegatecall/gi
  ],
  EXTERNAL_CALLS: [
    /\.call\(/gi,
    /\.delegatecall\(/gi,
    /\.staticcall\(/gi,
    /address.*\.call/gi
  ]
};

// Gas optimization patterns
const GAS_PATTERNS = {
  INEFFICIENT_LOOPS: [
    /for\s*\(.*\.length/gi,
    /while.*\.length/gi
  ],
  STORAGE_ACCESS: [
    /storage\s+/gi,
    /\.push\(/gi,
    /delete\s+/gi
  ],
  REDUNDANT_CHECKS: [
    /require\(.*require\(/gi,
    /assert\(.*assert\(/gi
  ]
};

// ABI patterns for common functions
const COMMON_ABIS = {
  ERC20: [
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)"
  ],
  ERC721: [
    "function balanceOf(address owner) external view returns (uint256 balance)",
    "function ownerOf(uint256 tokenId) external view returns (address owner)",
    "function transferFrom(address from, address to, uint256 tokenId) external",
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) external view returns (address operator)"
  ],
  OWNABLE: [
    "function owner() external view returns (address)",
    "function transferOwnership(address newOwner) external"
  ]
};

export interface ContractInfo {
  address: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: string;
  verified: boolean;
  sourceCode?: string;
  abi?: any[];
  compiler?: string;
  optimization?: boolean;
  runs?: number;
}

export interface SecurityIssue {
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
  pattern?: string;
}

export interface GasAnalysis {
  estimatedGas: number;
  gasPrice: string;
  totalCost: string;
  optimizations: string[];
  inefficiencies: string[];
}

export interface ContractFunction {
  name: string;
  type: 'function' | 'constructor' | 'receive' | 'fallback';
  stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs: Array<{name: string, type: string}>;
  outputs: Array<{name: string, type: string}>;
  gasEstimate?: number;
}

export class ContractAnalyzer {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
  }

  /**
   * Get comprehensive contract information
   */
  async getContractInfo(address: string): Promise<ContractInfo> {
    try {
      // Get basic contract info
      const code = await this.provider.getCode(address);
      const isContract = code !== '0x';

      if (!isContract) {
        throw new Error('Address is not a contract');
      }

      // Try to get contract details from Snowtrace
      const contractInfo = await this.getSnowtraceContractInfo(address);
      
      // Analyze common contract patterns
      const contractType = await this.detectContractType(address);
      
      return {
        address,
        verified: contractInfo.verified || false,
        sourceCode: contractInfo.sourceCode,
        abi: contractInfo.abi,
        compiler: contractInfo.compiler,
        optimization: contractInfo.optimization,
        runs: contractInfo.runs,
        ...contractType
      };
    } catch (error) {
      console.error('Contract analysis error:', error);
      throw error;
    }
  }

  /**
   * Perform security analysis on contract source code
   */
  async analyzeContractSecurity(sourceCode: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    const lines = sourceCode.split('\n');

    // Check for reentrancy vulnerabilities
    lines.forEach((line, index) => {
      SECURITY_PATTERNS.REENTRANCY.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            type: 'critical',
            title: 'Potential Reentrancy Vulnerability',
            description: 'External call detected without proper reentrancy protection',
            line: index + 1,
            suggestion: 'Use ReentrancyGuard or Checks-Effects-Interactions pattern',
            pattern: pattern.source
          });
        }
      });

      SECURITY_PATTERNS.INTEGER_OVERFLOW.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            type: 'medium',
            title: 'Potential Integer Overflow',
            description: 'Arithmetic operation without overflow protection',
            line: index + 1,
            suggestion: 'Use SafeMath library or Solidity 0.8+ built-in checks',
            pattern: pattern.source
          });
        }
      });

      SECURITY_PATTERNS.TIMESTAMP_DEPENDENCE.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            type: 'low',
            title: 'Timestamp Dependence',
            description: 'Contract logic depends on block timestamp',
            line: index + 1,
            suggestion: 'Avoid using block.timestamp for critical logic',
            pattern: pattern.source
          });
        }
      });

      SECURITY_PATTERNS.DELEGATECALL.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            type: 'high',
            title: 'Dangerous Delegatecall',
            description: 'Delegatecall can be dangerous if not properly controlled',
            line: index + 1,
            suggestion: 'Ensure delegatecall target is trusted and validated',
            pattern: pattern.source
          });
        }
      });
    });

    // Check for missing access control
    const hasAccessControl = SECURITY_PATTERNS.AUTHORIZATION.some(pattern => 
      pattern.test(sourceCode)
    );

    if (!hasAccessControl) {
      issues.push({
        type: 'medium',
        title: 'Missing Access Control',
        description: 'Contract may lack proper access control mechanisms',
        suggestion: 'Implement proper role-based access control'
      });
    }

    return issues;
  }

  /**
   * Analyze gas usage and optimization opportunities
   */
  async analyzeGasOptimization(sourceCode: string, abi?: any[]): Promise<GasAnalysis> {
    const optimizations: string[] = [];
    const inefficiencies: string[] = [];
    const lines = sourceCode.split('\n');

    // Check for inefficient patterns
    lines.forEach((line, index) => {
      GAS_PATTERNS.INEFFICIENT_LOOPS.forEach(pattern => {
        if (pattern.test(line)) {
          inefficiencies.push(`Line ${index + 1}: Inefficient loop with .length access`);
          optimizations.push('Cache array length before loop');
        }
      });

      GAS_PATTERNS.STORAGE_ACCESS.forEach(pattern => {
        if (pattern.test(line)) {
          inefficiencies.push(`Line ${index + 1}: Frequent storage access detected`);
          optimizations.push('Use memory variables to reduce storage reads');
        }
      });
    });

    // Estimate average gas cost
    let estimatedGas = 21000; // Base transaction cost
    
    if (sourceCode.includes('function')) {
      estimatedGas += 50000; // Function call overhead
    }
    
    if (sourceCode.includes('storage')) {
      estimatedGas += 20000; // Storage operations
    }

    const gasPrice = await this.provider.getFeeData();
    const totalCost = ethers.formatEther(
      BigInt(estimatedGas) * (gasPrice.gasPrice || BigInt('25000000000'))
    );

    return {
      estimatedGas,
      gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
      totalCost,
      optimizations,
      inefficiencies
    };
  }

  /**
   * Get contract functions and their details
   */
  async getContractFunctions(abi: any[]): Promise<ContractFunction[]> {
    return abi
      .filter(item => item.type === 'function')
      .map(func => ({
        name: func.name,
        type: func.type,
        stateMutability: func.stateMutability || 'nonpayable',
        inputs: func.inputs || [],
        outputs: func.outputs || [],
        gasEstimate: this.estimateFunctionGas(func)
      }));
  }

  /**
   * Simulate contract interaction
   */
  async simulateTransaction(
    contractAddress: string,
    abi: any[],
    functionName: string,
    params: any[],
    value: string = '0'
  ): Promise<{
    success: boolean;
    gasEstimate?: number;
    result?: any;
    error?: string;
    revertReason?: string;
  }> {
    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider);
      
      // Estimate gas
      const gasEstimate = await contract[functionName].estimateGas(...params, {
        value: ethers.parseEther(value)
      });

      // Static call to simulate
      const result = await contract[functionName].staticCall(...params, {
        value: ethers.parseEther(value)
      });

      return {
        success: true,
        gasEstimate: Number(gasEstimate),
        result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        revertReason: error.reason || 'Transaction would revert'
      };
    }
  }

  /**
   * Detect contract type (ERC20, ERC721, etc.)
   */
  private async detectContractType(address: string): Promise<Partial<ContractInfo>> {
    const info: Partial<ContractInfo> = {};

    try {
      // Try ERC20 interface
      const erc20 = new ethers.Contract(address, COMMON_ABIS.ERC20, this.provider);
      
      try {
        info.name = await erc20.name();
        info.symbol = await erc20.symbol();
        info.decimals = Number(await erc20.decimals());
        info.totalSupply = (await erc20.totalSupply()).toString();
      } catch {
        // Not an ERC20 or missing functions
      }

      // Try ERC721 interface
      const erc721 = new ethers.Contract(address, COMMON_ABIS.ERC721, this.provider);
      
      try {
        await erc721.ownerOf(1); // Test if ERC721
        info.name = info.name || 'NFT Contract';
      } catch {
        // Not an ERC721
      }

    } catch (error) {
      console.warn('Contract type detection failed:', error);
    }

    return info;
  }

  /**
   * Get contract info from Snowtrace API
   */
  private async getSnowtraceContractInfo(address: string): Promise<Partial<ContractInfo>> {
    try {
      // This would typically call Snowtrace API
      // For now, return basic info
      return {
        verified: false,
        sourceCode: undefined,
        abi: undefined
      };
    } catch (error) {
      console.warn('Snowtrace API error:', error);
      return {};
    }
  }

  /**
   * Estimate gas for a function based on its signature
   */
  private estimateFunctionGas(func: any): number {
    let baseGas = 21000; // Transaction base cost

    // Add gas based on function complexity
    if (func.stateMutability === 'view' || func.stateMutability === 'pure') {
      baseGas = 0; // View functions don't cost gas when called externally
    } else {
      baseGas += 5000; // Function call overhead
      
      // Add gas for parameters
      baseGas += (func.inputs?.length || 0) * 1000;
      
      // Add gas for state changes
      if (func.stateMutability === 'payable' || func.stateMutability === 'nonpayable') {
        baseGas += 20000; // State modification
      }
    }

    return baseGas;
  }
}

// Export singleton instance
export const contractAnalyzer = new ContractAnalyzer();

// Utility functions for common contract interactions
export const contractUtils = {
  /**
   * Check if address is a valid contract
   */
  async isContract(address: string): Promise<boolean> {
    try {
      const provider = new ethers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
      const code = await provider.getCode(address);
      return code !== '0x';
    } catch {
      return false;
    }
  },

  /**
   * Validate Ethereum address format
   */
  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  },

  /**
   * Get contract creation transaction
   */
  async getContractCreation(address: string): Promise<{
    creator: string;
    txHash: string;
    blockNumber: number;
  } | null> {
    try {
      // This would typically require indexed data or archive node
      // Return null for now as it requires special API access
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Format contract function signature
   */
  formatFunctionSignature(func: ContractFunction): string {
    const params = func.inputs.map(input => `${input.type} ${input.name}`).join(', ');
    const returns = func.outputs.length > 0 
      ? ` returns (${func.outputs.map(output => output.type).join(', ')})`
      : '';
    
    return `function ${func.name}(${params})${returns}`;
  }
};