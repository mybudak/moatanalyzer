'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { analyzeTicker } from '@/app/actions/analyzer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  ticker: z.string()
    .min(1, 'Ticker is required.')
    .max(5, 'Ticker must be 5 characters or less.')
    .regex(/^[A-Z]+$/, 'Ticker must be uppercase letters only.'),
});

export default function TickerForm() {
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'You must be signed in to analyze a ticker.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const result = await analyzeTicker({ ticker: values.ticker, uid: user.uid });
      if (result.success) {
        toast({
          title: 'Analysis Queued',
          description: `Started analysis for ${values.ticker}.`,
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to start analysis.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Start a New Analysis</CardTitle>
        <CardDescription>Enter a US stock ticker to begin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AAPL" {...field} className="text-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="h-12 text-lg">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Analyze
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
