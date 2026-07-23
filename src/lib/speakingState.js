import { useState, useEffect } from 'react';

let speaking = false;
const listeners = new Set();

export function setSpeaking(val) {
  if (speaking === val) return;
  speaking = val;
  listeners.forEach((fn) => fn(val));
}

export function useIsSpeaking() {
  const [isSpeaking, setIsSpeaking] = useState(speaking);
  useEffect(() => {
    listeners.add(setIsSpeaking);
    return () => listeners.delete(setIsSpeaking);
  }, []);
  return isSpeaking;
}