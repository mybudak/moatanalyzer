'use client';

import { MoatJob } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldX, Shield } from 'lucide-react';

const MoatBadge = ({ rating }: { rating: MoatJob['moatRating'] }) => {
    if (!rating) return <Badge variant="outline">N/A</Badge>;

    const config = {
        'Wide': { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: 'Wide', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700/50' },
        'Narrow': { icon: <Shield className="h-3.5 w-3.5" />, text: 'Narrow', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700/50' },
        'None': { icon: <ShieldX className="h-3.5 w-3.5" />, text: 'None', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700/50' },
    };

    const current = config[rating];

    return (
        <Badge variant="outline" className={cn("gap-1.5 font-medium", current.className)}>
            {current.icon}
            {current.text}
        </Badge>
    );
};


export default function HistoryList({
    jobs,
    selectedJobId,
    onSelectJob,
}: {
    jobs: MoatJob[];
    selectedJobId: string | null;
    onSelectJob: (id: string) => void;
}) {
    if (jobs.length === 0) {
        return (
             <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">History</CardTitle>
                    <CardDescription>Your past analyses will appear here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="p-4 text-center text-sm text-muted-foreground">No history yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">History</CardTitle>
                <CardDescription>Select an analysis to view its details.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card">
                            <TableRow>
                                <TableHead>Ticker</TableHead>
                                <TableHead>Moat</TableHead>
                                <TableHead className="text-right">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs.map((job) => (
                                <TableRow 
                                    key={job.id}
                                    onClick={() => onSelectJob(job.id)}
                                    className={cn(
                                        "cursor-pointer",
                                        job.id === selectedJobId && "bg-secondary hover:bg-secondary/80"
                                    )}
                                >
                                    <TableCell className="font-bold">{job.ticker}</TableCell>
                                    <TableCell><MoatBadge rating={job.moatRating} /></TableCell>
                                    <TableCell className="text-right text-muted-foreground text-xs">
                                        {format(job.createdAt, 'MMM d, yyyy')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
