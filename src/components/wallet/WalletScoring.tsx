import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Target, 
  Activity, 
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface WalletScore {
  overall: number;
  security: number;
  diversification: number;
  activity: number;
  profitability: number;
  consistency: number;
  grade: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface WalletScoringProps {
  walletAddress: string;
  balance: number;
  transactionCount: number;
  riskScore: number;
  diversificationScore: number;
  activityScore: number;
  profitLoss: number;
  age: number;
}

export function WalletScoring({
  walletAddress,
  balance,
  transactionCount,
  riskScore,
  diversificationScore,
  activityScore,
  profitLoss,
  age
}: WalletScoringProps) {
  
  // Calculate comprehensive wallet score
  const calculateWalletScore = (): WalletScore => {
    const security = Math.max(0, 100 - riskScore);
    const diversification = diversificationScore;
    const activity = activityScore;
    const profitability = Math.min(100, Math.max(0, (profitLoss / balance + 1) * 50));
    const consistency = Math.min(100, (transactionCount / Math.max(age, 1)) * 10);
    
    const overall = (security * 0.25 + diversification * 0.2 + activity * 0.2 + profitability * 0.2 + consistency * 0.15);
    
    let grade: string;
    if (overall >= 90) grade = 'A+';
    else if (overall >= 80) grade = 'A';
    else if (overall >= 70) grade = 'B+';
    else if (overall >= 60) grade = 'B';
    else if (overall >= 50) grade = 'C+';
    else if (overall >= 40) grade = 'C';
    else if (overall >= 30) grade = 'D+';
    else if (overall >= 20) grade = 'D';
    else grade = 'F';

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (security >= 80) strengths.push('Excellent security practices');
    if (diversification >= 70) strengths.push('Well-diversified portfolio');
    if (activity >= 80) strengths.push('High engagement with DeFi');
    if (profitability >= 60) strengths.push('Strong profit performance');
    if (consistency >= 70) strengths.push('Consistent trading activity');

    // Analyze weaknesses
    if (security < 40) weaknesses.push('High-risk security profile');
    if (diversification < 30) weaknesses.push('Over-concentrated holdings');
    if (activity < 30) weaknesses.push('Low blockchain engagement');
    if (profitability < 20) weaknesses.push('Poor profit performance');
    if (consistency < 20) weaknesses.push('Irregular activity patterns');

    // Generate recommendations
    if (diversification < 50) recommendations.push('Consider diversifying into different asset classes');
    if (security < 60) recommendations.push('Review and improve security practices');
    if (activity < 40) recommendations.push('Explore more DeFi opportunities');
    if (profitability < 40) recommendations.push('Review investment strategy and risk management');
    if (consistency < 30) recommendations.push('Develop a more consistent trading schedule');

    return {
      overall,
      security,
      diversification,
      activity,
      profitability,
      consistency,
      grade,
      strengths,
      weaknesses,
      recommendations
    };
  };

  const score = calculateWalletScore();

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ScoreMetric = ({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className={`font-bold ${getScoreColor(score)}`}>
          {score.toFixed(0)}/100
        </span>
      </div>
      <div className="relative">
        <Progress value={score} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Wallet Score Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`px-4 py-2 rounded-lg border-2 font-bold text-2xl ${getGradeColor(score.grade)}`}>
                  {score.grade}
                </div>
                <div>
                  <p className="text-sm text-slate-600">Overall Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(score.overall)}`}>
                    {score.overall.toFixed(0)}/100
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Based on security, diversification, activity, profitability, and consistency
              </p>
            </div>
            <div className="text-right">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <Badge variant="outline" className="text-xs">
                {score.overall >= 80 ? 'Excellent' : 
                 score.overall >= 60 ? 'Good' : 
                 score.overall >= 40 ? 'Average' : 'Poor'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <ScoreMetric label="Security" score={score.security} icon={Shield} />
            <ScoreMetric label="Diversification" score={score.diversification} icon={Target} />
            <ScoreMetric label="Activity" score={score.activity} icon={Activity} />
            <ScoreMetric label="Profitability" score={score.profitability} icon={TrendingUp} />
            <ScoreMetric label="Consistency" score={score.consistency} icon={CheckCircle} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            {score.strengths.length > 0 ? (
              <div className="space-y-3">
                {score.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{strength}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                No significant strengths identified. Consider improving your wallet management practices.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {score.weaknesses.length > 0 ? (
              <div className="space-y-3">
                {score.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{weakness}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Great job! No significant weaknesses identified in your wallet management.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Star className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {score.recommendations.length > 0 ? (
              <div className="space-y-3">
                {score.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Excellent wallet management! Keep up the good practices.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Score Methodology</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p><strong>Security (25%):</strong> Based on risk assessment and security practices</p>
          <p><strong>Diversification (20%):</strong> Portfolio spread across different assets</p>
          <p><strong>Activity (20%):</strong> Engagement with blockchain and DeFi protocols</p>
          <p><strong>Profitability (20%):</strong> Historical profit/loss performance</p>
          <p><strong>Consistency (15%):</strong> Regular transaction patterns and engagement</p>
        </CardContent>
      </Card>
    </div>
  );
}