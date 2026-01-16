'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { generateMoatSummary } from '@/ai/flows/generate-moat-summary';

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

  // 1. Create the initial job document
  let docRef;
  try {
    docRef = await addDoc(collection(db, 'moat_jobs'), {
      uid: uid,
      ticker: ticker,
      status: 'queued',
      createdAt: serverTimestamp(),
    });
    revalidatePath('/analyzer');
  } catch (error) {
    console.error("Error creating initial moat job:", error);
    return { success: false, error: 'Could not create analysis job in database.' };
  }

  // 2. Run the analysis
  try {
    // Update status to 'analyzing'
    await updateDoc(doc(db, 'moat_jobs', docRef.id), {
        status: 'analyzing'
    });

    // Call the AI flow
    const analysisResult = await generateMoatSummary({ ticker });

    // Update the document with the results
    await updateDoc(doc(db, 'moat_jobs', docRef.id), {
      ...analysisResult,
      status: 'complete',
    });

    revalidatePath('/analyzer');
    return { success: true, jobId: docRef.id };

  } catch (error: any) {
    console.error("Error during moat analysis:", error);

    // Update the document with the error
    if (docRef) {
      await updateDoc(doc(db, 'moat_jobs', docRef.id), {
        status: 'error',
        error: error.message || 'An unknown error occurred during analysis.'
      });
    }

    revalidatePath('/analyzer');
    return { success: false, error: 'Failed to complete analysis.' };
  }
}
