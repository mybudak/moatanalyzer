'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, DocumentData } from 'firebase/firestore';
import { MoatJob } from '@/lib/types';

export const useLatestJob = (uid: string | undefined) => {
  const [job, setJob] = useState<MoatJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'moat_jobs'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as DocumentData;
        setJob({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as MoatJob);
      } else {
        setJob(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching latest job:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { job, loading };
};
