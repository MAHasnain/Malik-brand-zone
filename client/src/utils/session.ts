import { v4 as uuidv4 } from 'uuid';

export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('mbz_session_id');
  if (!sessionId) {
    sessionId = `mbz_sess_${uuidv4()}`;
    localStorage.setItem('mbz_session_id', sessionId);
  }
  return sessionId;
};