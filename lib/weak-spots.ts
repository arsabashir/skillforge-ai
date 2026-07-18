export type WeakSpot = {
  concept: string;
  moduleId: string;
  missedQuestionIds: string[];
  lastMissedAt: string;
};

export type WeakSpotStore = {
  recordMiss: (input: Omit<WeakSpot, "missedQuestionIds" | "lastMissedAt"> & { questionId: string }) => Promise<void>;
  listForUser: (userId: string) => Promise<WeakSpot[]>;
};

// TODO: Implement a Supabase-backed WeakSpotStore after authentication and RLS policies are in place.
