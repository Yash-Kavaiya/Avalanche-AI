/**
 * Smart Contract Analyzer Component
 * Comprehensive tool for contract security analysis and interaction
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Code, 
  Zap, 
  Search,
  Play,
  FileText,
  Fuel,
  Activity,
  Lock
} from 'lucide-react';
import { 
  contractAnalyzer, 
  ContractInfo, 
  SecurityIssue, 
  GasAnalysis, 
  ContractFunction,
  contractUtils
} from '@/lib/contracts';
import { useToast } from '@/hooks/use-toast';

export const ContractAnalyzer: React.FC = () => {
  const [contractAddress, setContractAddress] = useState('');
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [gasAnalysis, setGasAnalysis] = useState<GasAnalysis | null>(null);
  const [contractFunctions, setContractFunctions] = useState<ContractFunction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFunction, setActiveFunction] = useState<string>('');
  const [functionParams, setFunctionParams] = useState<{[key: string]: string}>({});
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  const { toast } = useToast();

  const analyzeContract = useCallback(async () => {
    if (!contractAddress || !contractUtils.isValidAddress(contractAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid contract address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Check if it's a contract
      const isContract = await contractUtils.isContract(contractAddress);
      if (!isContract) {
        toast({
          title: "Not a Contract",
          description: "The provided address is not a smart contract",
          variant: "destructive"
        });
        return;
      }

      // Get contract info
      const info = await contractAnalyzer.getContractInfo(contractAddress);
      setContractInfo(info);

      // Analyze security if source code available
      if (info.sourceCode) {
        const issues = await contractAnalyzer.analyzeContractSecurity(info.sourceCode);
        setSecurityIssues(issues);

        // Analyze gas optimization
        const gasData = await contractAnalyzer.analyzeGasOptimization(info.sourceCode, info.abi);
        setGasAnalysis(gasData);
      }

      // Get functions if ABI available
      if (info.abi) {
        const functions = await contractAnalyzer.getContractFunctions(info.abi);
        setContractFunctions(functions);
      }

      toast({
        title: "Analysis Complete",
        description: "Contract analysis completed successfully"
      });

    } catch (error: any) {
      console.error('Contract analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze contract",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [contractAddress, toast]);

  const simulateFunction = async (functionName: string) => {
    if (!contractInfo?.abi) return;

    const func = contractFunctions.find(f => f.name === functionName);
    if (!func) return;

    try {
      const params = func.inputs.map(input => functionParams[input.name] || '');
      
      const result = await contractAnalyzer.simulateTransaction(
        contractAddress,
        contractInfo.abi,
        functionName,
        params
      );

      setSimulationResult(result);
      
      toast({
        title: result.success ? "Simulation Successful" : "Simulation Failed",
        description: result.success 
          ? `Gas estimate: ${result.gasEstimate}` 
          : result.error,
        variant: result.success ? "default" : "destructive"
      });

    } catch (error: any) {
      toast({
        title: "Simulation Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIssueColor = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Smart Contract Analyzer
          </CardTitle>
          <CardDescription>
            Analyze smart contracts for security vulnerabilities, gas optimization, and function interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                id="contract-address"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button 
              onClick={analyzeContract}
              disabled={loading}
              className="mt-6"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {contractInfo && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="gas">Gas Analysis</TabsTrigger>
            <TabsTrigger value="functions">Functions</TabsTrigger>
            <TabsTrigger value="interact">Interact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contract Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="font-mono text-sm bg-muted p-2 rounded">
                        {contractInfo.address}
                      </p>
                    </div>
                    {contractInfo.name && (
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm">{contractInfo.name}</p>
                      </div>
                    )}
                    {contractInfo.symbol && (
                      <div>
                        <Label className="text-sm font-medium">Symbol</Label>
                        <p className="text-sm">{contractInfo.symbol}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Verification Status</Label>
                      <div className="flex items-center gap-2">
                        {contractInfo.verified ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {contractInfo.totalSupply && (
                      <div>
                        <Label className="text-sm font-medium">Total Supply</Label>
                        <p className="text-sm">{contractInfo.totalSupply}</p>
                      </div>
                    )}
                    
                    {contractInfo.compiler && (
                      <div>
                        <Label className="text-sm font-medium">Compiler</Label>
                        <p className="text-sm">{contractInfo.compiler}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Analysis
                </CardTitle>
                <CardDescription>
                  Potential security vulnerabilities and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {securityIssues.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {securityIssues.map((issue, index) => (
                        <Alert key={index} className="border-l-4 border-l-red-500">
                          <div className="flex items-start gap-3">
                            {getIssueIcon(issue.type)}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{issue.title}</h4>
                                <Badge variant={getIssueColor(issue.type) as any}>
                                  {issue.type.toUpperCase()}
                                </Badge>
                                {issue.line && (
                                  <Badge variant="outline" className="text-xs">
                                    Line {issue.line}
                                  </Badge>
                                )}
                              </div>
                              <AlertDescription className="text-sm">
                                {issue.description}
                              </AlertDescription>
                              {issue.suggestion && (
                                <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                  <strong>Suggestion:</strong> {issue.suggestion}
                                </div>
                              )}
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </ScrollArea>
                ) : contractInfo.verified ? (
                  <Alert>
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      No major security issues detected in the contract code.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Contract source code is not available for security analysis.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gas Analysis Tab */}
          <TabsContent value="gas">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="w-5 h-5" />
                  Gas Optimization Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gasAnalysis ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <h4 className="font-medium">Estimated Gas</h4>
                        <p className="text-2xl font-bold text-primary">
                          {gasAnalysis.estimatedGas.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <h4 className="font-medium">Gas Price</h4>
                        <p className="text-2xl font-bold text-primary">
                          {gasAnalysis.gasPrice} Gwei
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <h4 className="font-medium">Total Cost</h4>
                        <p className="text-2xl font-bold text-primary">
                          {parseFloat(gasAnalysis.totalCost).toFixed(6)} AVAX
                        </p>
                      </div>
                    </div>

                    {gasAnalysis.optimizations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-green-700">Optimization Opportunities</h4>
                        <div className="space-y-2">
                          {gasAnalysis.optimizations.map((opt, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{opt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {gasAnalysis.inefficiencies.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 text-orange-700">Inefficiencies Detected</h4>
                        <div className="space-y-2">
                          {gasAnalysis.inefficiencies.map((ineff, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                              <span className="text-sm">{ineff}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Gas analysis requires verified contract source code.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Functions Tab */}
          <TabsContent value="functions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Contract Functions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contractFunctions.length > 0 ? (
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {contractFunctions.map((func, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-mono font-medium">{func.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{func.stateMutability}</Badge>
                              {func.gasEstimate && (
                                <Badge variant="secondary">
                                  ~{func.gasEstimate.toLocaleString()} gas
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm font-mono text-muted-foreground mb-2">
                            {contractUtils.formatFunctionSignature(func)}
                          </p>

                          {func.inputs.length > 0 && (
                            <div className="mt-3">
                              <Label className="text-xs font-medium">Parameters:</Label>
                              <div className="mt-1 space-y-1">
                                {func.inputs.map((input, idx) => (
                                  <div key={idx} className="text-xs">
                                    <code className="bg-muted px-1 rounded">{input.type}</code>{' '}
                                    <span className="text-muted-foreground">{input.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3"
                            onClick={() => setActiveFunction(func.name)}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Test Function
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Contract ABI is not available for function analysis.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interact Tab */}
          <TabsContent value="interact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Function Simulator
                </CardTitle>
                <CardDescription>
                  Test contract functions without executing transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeFunction && contractFunctions.length > 0 ? (
                  <>
                    {(() => {
                      const func = contractFunctions.find(f => f.name === activeFunction);
                      if (!func) return null;

                      return (
                        <div className="space-y-4">
                          <div>
                            <Label className="font-medium">Function: {func.name}</Label>
                            <p className="text-sm text-muted-foreground font-mono">
                              {contractUtils.formatFunctionSignature(func)}
                            </p>
                          </div>

                          {func.inputs.map((input, index) => (
                            <div key={index}>
                              <Label htmlFor={input.name}>
                                {input.name} ({input.type})
                              </Label>
                              <Input
                                id={input.name}
                                placeholder={`Enter ${input.type} value`}
                                value={functionParams[input.name] || ''}
                                onChange={(e) => setFunctionParams(prev => ({
                                  ...prev,
                                  [input.name]: e.target.value
                                }))}
                              />
                            </div>
                          ))}

                          <Button 
                            onClick={() => simulateFunction(activeFunction)}
                            className="w-full"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Simulate Function Call
                          </Button>

                          {simulationResult && (
                            <Alert className={simulationResult.success ? 'border-green-200' : 'border-red-200'}>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {simulationResult.success ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className="font-medium">
                                    {simulationResult.success ? 'Simulation Successful' : 'Simulation Failed'}
                                  </span>
                                </div>
                                
                                <AlertDescription>
                                  {simulationResult.success ? (
                                    <div className="space-y-1">
                                      <p>Gas Estimate: {simulationResult.gasEstimate?.toLocaleString()}</p>
                                      {simulationResult.result !== undefined && (
                                        <p>Result: {JSON.stringify(simulationResult.result)}</p>
                                      )}
                                    </div>
                                  ) : (
                                    <div>
                                      <p>Error: {simulationResult.error}</p>
                                      {simulationResult.revertReason && (
                                        <p>Reason: {simulationResult.revertReason}</p>
                                      )}
                                    </div>
                                  )}
                                </AlertDescription>
                              </div>
                            </Alert>
                          )}
                        </div>
                      );
                    })()}
                  </>
                ) : (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      Select a function from the Functions tab to test interactions.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};