'use server';

import { generateMoatSummary } from '@/ai/flows/generate-moat-summary';
import { db } from '@/lib/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

export async function analyzeTicker({ ticker, uid }: { ticker: string; uid: string }) {
  if (!uid) {
    return { success: false, error: 'User is not authenticated.' };
  }

  let docRef;

  try {
    // 1. Create the job document in Firestore with a 'queued' status.
    docRef = await addDoc(collection(db, 'moat_jobs'), {
      uid,
      ticker,
      status: 'queued',
      createdAt: serverTimestamp(),
    });

    // 2. Run the analysis. This is wrapped in its own try/catch
    //    so we can update the Firestore document if it fails.
    try {
      await updateDoc(docRef, { status: 'analyzing' });

      const analysisResult = await generateMoatSummary({ ticker });

      await updateDoc(docRef, {
        ...analysisResult,
        status: 'complete',
      });

      return { success: true, jobId: docRef.id };
    } catch (analysisError: any) {
      // If analysis fails, update the document with an error status.
      if (docRef) {
        await updateDoc(docRef, {
          status: 'error',
          error: analysisError.message || 'An unknown error occurred during analysis.',
        });
      }
      // Return the error to the client.
      return { success: false, error: analysisError.message || 'Analysis failed.' };
    }
  } catch (error: any) {
    // This outer catch handles errors from the initial Firestore document creation.
    console.error('Error creating analysis job:', error);
    return {
      success: false,
      error: error.message || 'Failed to create analysis job.',
    };
  }
}
