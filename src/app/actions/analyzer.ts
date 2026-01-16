'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const analyzeSchema = z.object({
  ticker: z.string().min(1).max(5).regex(/^[A-Z]+$/),
  uid: z.string().min(1),
});

export async function analyzeTicker(data: { ticker: string; uid: string }) {
  const validation = analyzeSchema.safeParse(data);
  
  if (!validation.success) {
    return { success: false, error: 'Invalid input.' };
  }

  const { ticker, uid } = validation.data;

  try {
    const docRef = await addDoc(collection(db, 'moat_jobs'), {
      uid: uid,
      ticker: ticker,
      status: 'queued',
      createdAt: serverTimestamp(),
    });
    
    revalidatePath('/analyzer');
    return { success: true, jobId: docRef.id };

  } catch (error) {
    console.error("Error creating moat job:", error);
    return { success: false, error: 'Could not create analysis job in database.' };
  }
}
