'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import TickerForm from '@/components/analyzer/ticker-form';
import ResultsPanel from '@/components/analyzer/results-panel';
import { Loader2 } from 'lucide-react';
import { useJobs } from '@/hooks/use-jobs';
import HistoryList from '@/components/analyzer/history-list';
import { Card } from '@/components/ui/card';

export default function AnalyzerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { jobs, loading: jobsLoading } = useJobs(user?.uid);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // When jobs load, select the latest one by default
  useEffect(() => {
    if (!jobsLoading && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, jobsLoading, selectedJobId]);

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.id === selectedJobId);
  }, [jobs, selectedJobId]);

  const isLoading = authLoading || !user;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
      <TickerForm />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {jobsLoading ? (
            <Card className="flex items-center justify-center p-8 h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </Card>
          ) : (
            <HistoryList jobs={jobs} selectedJobId={selectedJobId} onSelectJob={setSelectedJobId} />
          )}
        </div>
        <div className="lg:col-span-2">
          <ResultsPanel job={selectedJob} loading={jobsLoading && !selectedJob} />
        </div>
      </div>
    </div>
  );
}
