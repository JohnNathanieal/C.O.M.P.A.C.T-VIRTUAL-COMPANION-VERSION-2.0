import { useIsSpeaking } from '@/lib/speakingState';

export default function MicGlow({ children, active: forceActive, className = '', rounded = 'rounded-full' }) {
  const isSpeaking = useIsSpeaking();
  const active = isSpeaking || forceActive;

  return (
    <div className={`relative ${className}`}>
      {active && (
        <>
          <div className={`absolute -inset-1.5 ${rounded} bg-primary/30 blur-md animate-pulse`} />
          <div className={`absolute -inset-0.5 ${rounded} border-2 border-primary/50 animate-ping`} />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}