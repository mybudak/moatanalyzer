'use client';

import { useAuth } from '@/hooks/use-auth';
import { useLatestJob } from '@/hooks/use-latest-job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, ShieldCheck, ShieldX, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MoatJob } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const StatusIndicator = ({ status }: { status: MoatJob['status'] }) => {
  const statusConfig = {
    queued: { icon: <Clock className="h-4 w-4" />, text: 'Queued', color: 'bg-yellow-500' },
    analyzing: { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: 'Analyzing', color: 'bg-blue-500' },
    classifying: { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: 'Classifying', color: 'bg-blue-500' },
    complete: { icon: <ShieldCheck className="h-4 w-4" />, text: 'Complete', color: 'bg-green-500' },
    error: { icon: <AlertTriangle className="h-4 w-4" />, text: 'Error', color: 'bg-red-500' },
  };

  const current = statusConfig[status] || statusConfig.queued;

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2.5 w-2.5 rounded-full", current.color)}></div>
      <span className="text-sm font-medium">{current.text}</span>
    </div>
  );
};


const MoatRatingDisplay = ({ rating }: { rating: 'Wide' | 'Narrow' | 'None' }) => {
    const iconMap = {
        'Wide': <ShieldCheck className="h-6 w-6 text-green-600" />,
        'Narrow': <Shield className="h-6 w-6 text-yellow-600" />,
        'None': <ShieldX className="h-6 w-6 text-red-600" />,
    };

    return (
        <div className="flex items-center gap-3">
            {iconMap[rating]}
            <span className="text-lg font-semibold">{rating} Moat</span>
        </div>
    );
};

const MoatTrendDisplay = ({ trend }: { trend: 'Positive' | 'Neutral' | 'Negative' }) => {
    const iconMap = {
        'Positive': <TrendingUp className="h-6 w-6 text-green-600" />,
        'Neutral': <Minus className="h-6 w-6 text-gray-500" />,
        'Negative': <TrendingDown className="h-6 w-6 text-red-600" />,
    };
    const textMap = {
        'Positive': 'Improving',
        'Neutral': 'Stable',
        'Negative': 'Worsening',
    }

    return (
        <div className="flex items-center gap-3">
            {iconMap[trend]}
            <span className="text-lg font-semibold">{textMap[trend]} Trend</span>
        </div>
    );
};

const OverallRatingDisplay = ({ rating }: { rating: number }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-2xl font-bold text-primary">{rating} / 10</span>
            </div>
            <Progress value={rating * 10} className="h-3" />
        </div>
    );
};

const AnalysisItem = ({ title, score, analysis }: { title: string; score: number; analysis: string }) => {
    return (
        <AccordionItem value={title}>
            <AccordionTrigger>
                <div className="flex justify-between w-full pr-4 items-center">
                    <span className="font-medium">{title}</span>
                    <div className="flex items-center gap-2">
                        <Progress value={score * 10} className="w-24 h-2" />
                        <span className="font-semibold text-sm">{score}/10</span>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/80 whitespace-pre-wrap pt-2">
                {analysis}
            </AccordionContent>
        </AccordionItem>
    );
};


export default function ResultsPanel() {
  const { user } = useAuth();
  const { job, loading } = useLatestJob(user?.uid);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!job) {
      return <p className="p-8 text-center text-muted-foreground">No analysis jobs found. Enter a ticker to get started.</p>;
    }
    
    const analysisComplete = job.status === 'complete' && job.overallRating !== undefined;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Badge variant="secondary" className="text-xl font-bold py-1 px-4">{job.ticker}</Badge>
                <StatusIndicator status={job.status} />
            </div>

            {analysisComplete && job.moatRating && job.moatTrend && job.overallRating && job.summary ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <h3 className="text-sm font-medium text-muted-foreground">Moat Rating</h3>
                        </CardHeader>
                        <CardContent>
                            <MoatRatingDisplay rating={job.moatRating} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <h3 className="text-sm font-medium text-muted-foreground">Moat Trend</h3>
                        </CardHeader>
                        <CardContent>
                            <MoatTrendDisplay trend={job.moatTrend} />
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Overall Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OverallRatingDisplay rating={job.overallRating} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {job.brandAndPricingPower && <AnalysisItem title="Brand & Pricing Power" score={job.brandAndPricingPower.score} analysis={job.brandAndPricingPower.analysis} />}
                            {job.marketEntryBarriers && <AnalysisItem title="Market Entry Barriers" score={job.marketEntryBarriers.score} analysis={job.marketEntryBarriers.analysis} />}
                            {job.customerRetention && <AnalysisItem title="Customer Retention" score={job.customerRetention.score} analysis={job.customerRetention.analysis} />}
                            {job.competitiveThreats && <AnalysisItem title="Competitive Threats" score={job.competitiveThreats.score} analysis={job.competitiveThreats.analysis} />}
                            {job.scaleCostEfficiency && <AnalysisItem title="Scale-Driven Cost Efficiency" score={job.scaleCostEfficiency.score} analysis={job.scaleCostEfficiency.analysis} />}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Analysis Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                            {job.summary}
                        </p>
                    </CardContent>
                </Card>
              </>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        {job.status === 'error' ? (
                             <div className="space-y-2">
                                <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
                                <p className="font-semibold">Analysis Failed</p>
                                <p>{job.error || 'An unknown error occurred during analysis.'}</p>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center gap-4">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <div className="space-y-1 text-center">
                                  <p className="font-semibold">Analysis for {job.ticker} is in progress.</p>
                                  <p className="text-sm">The results will appear here once complete.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Latest Analysis</CardTitle>
        <CardDescription>Results from the most recent ticker analysis.</CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
