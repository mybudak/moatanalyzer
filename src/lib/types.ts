import { Timestamp } from 'firebase/firestore';

export interface MoatJob {
  id: string;
  uid: string;
  ticker: string;
  status: 'queued' | 'analyzing' | 'classifying' | 'complete' | 'error';
  createdAt: Date;
  moatRating?: 'Wide' | 'Narrow' | 'None';
  summary?: string;
  error?: string;
  
  brandAndPricingPower?: { analysis: string; score: number };
  marketEntryBarriers?: { analysis: string; score: number };
  customerRetention?: { analysis: string; score: number };
  competitiveThreats?: { analysis: string; score: number };
  scaleCostEfficiency?: { analysis: string; score: number };
  moatTrend?: 'Positive' | 'Neutral' | 'Negative';
  overallRating?: number;
}
