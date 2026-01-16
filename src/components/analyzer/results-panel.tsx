'use client';

import { useAuth } from '@/hooks/use-auth';
import { useLatestJob } from '@/hooks/use-latest-job';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, ShieldCheck, ShieldX, FileText, AlertTriangle, Clock } from 'lucide-react';
import { MoatJob } from '@/lib/types';
import { cn } from '@/lib/utils';

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

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Badge variant="secondary" className="text-xl font-bold py-1 px-4">{job.ticker}</Badge>
                <StatusIndicator status={job.status} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                         <h3 className="text-sm font-medium text-muted-foreground">Moat Rating</h3>
                    </CardHeader>
                    <CardContent>
                        <MoatRatingDisplay rating={job.moatRating || 'Narrow'} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">Summary</h3>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-foreground">
                            {job.summary || "The company's competitive advantages are being evaluated."}
                        </p>
                    </CardContent>
                </Card>
            </div>
            
            {job.status === 'error' && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive-foreground">
                    <p><strong>Error:</strong> {job.error || 'An unknown error occurred during analysis.'}</p>
                </div>
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
