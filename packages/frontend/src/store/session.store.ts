import { create } from 'zustand';

const SESSION_STORAGE_KEY = 'ecommerce_session_id';

interface SessionStore {
  sessionId: string | null;
  initialize: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,

  initialize: () => {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }

    set({ sessionId });
  },
}));
