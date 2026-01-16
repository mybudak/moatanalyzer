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
}
