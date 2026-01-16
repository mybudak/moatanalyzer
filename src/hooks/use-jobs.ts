'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { MoatJob } from '@/lib/types';

export const useJobs = (uid: string | undefined) => {
  const [jobs, setJobs] = useState<MoatJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setJobs([]);
      return;
    }

    const q = query(
      collection(db, 'moat_jobs'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobsData: MoatJob[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        jobsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
        } as MoatJob);
      });
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { jobs, loading };
};
