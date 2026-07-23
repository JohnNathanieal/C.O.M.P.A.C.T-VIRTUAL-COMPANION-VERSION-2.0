const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Check, Loader2, UserPlus, ScanFace, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaceRecognition({ onComplete, onSkip }) {
  const [status, setStatus] = useState('starting');
  const [photoUrl, setPhotoUrl] = useState(null);
  const [userName, setUserName] = useState('');
  const [identifiedName, setIdentifiedName] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('no_camera');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('camera_ready');
    } catch (err) {
      setStatus('no_camera');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const captureSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'face.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    });
  };

  const handleScan = async () => {
    setStatus('scanning');
    try {
      const file = await captureSnapshot();
      if (!file) { setStatus('camera_ready'); return; }

      setStatus('analyzing');
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setPhotoUrl(file_url);

      const analysis = await db.integrations.Core.InvokeLLM({
        prompt: 'Analyze this photo. Is there a clear human face visible? Respond with has_face true or false, and a brief physical description if a face is visible.',
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            has_face: { type: 'boolean' },
            description: { type: 'string' }
          }
        }
      });

      if (!analysis.has_face) {
        toast.error('No face detected. Please position your face in the camera.');
        setStatus('camera_ready');
        return;
      }

      const profiles = await db.entities.FaceProfile.list('-created_date', 50);

      if (profiles.length === 0) {
        stopCamera();
        setStatus('new_user');
        return;
      }

      for (const profile of profiles) {
        const comparison = await db.integrations.Core.InvokeLLM({
          prompt: 'Look at these two photos carefully. Are they the same person? Consider facial bone structure, features, and distinguishing characteristics.',
          file_urls: [file_url, profile.photo_url],
          response_json_schema: {
            type: 'object',
            properties: {
              is_same_person: { type: 'boolean' }
            }
          }
        });
        if (comparison.is_same_person) {
          setIdentifiedName(profile.name);
          stopCamera();
          setStatus('recognized');
          return;
        }
      }

      stopCamera();
      setStatus('new_user');
    } catch (err) {
      toast.error('Face scan failed. Please try again.');
      setStatus('camera_ready');
    }
  };

  const handleRegister = async () => {
    if (!userName.trim() || !photoUrl) return;
    setStatus('registering');
    try {
      const analysis = await db.integrations.Core.InvokeLLM({
        prompt: "Provide a concise physical description of this person's face for identification purposes.",
        file_urls: [photoUrl],
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' }
          }
        }
      });
      await db.entities.FaceProfile.create({
        name: userName.trim(),
        photo_url: photoUrl,
        face_description: analysis.description || ''
      });
      setIdentifiedName(userName.trim());
      setStatus('recognized');
    } catch (err) {
      toast.error('Failed to save profile');
      setStatus('new_user');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-full">
      <div className="flex flex-col items-center max-w-md w-full">
        <canvas ref={canvasRef} className="hidden" />

        <AnimatePresence mode="wait">
          {(status === 'starting' || status === 'camera_ready' || status === 'scanning' || status === 'analyzing') && (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-primary/30 mb-6">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                {status !== 'camera_ready' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {status === 'starting' ? 'Starting camera...' :
                 status === 'scanning' ? 'Scanning...' :
                 status === 'analyzing' ? 'Analyzing face...' :
                 'Position your face'}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {status === 'camera_ready' ? 'Click scan to verify your identity' : 'Please wait...'}
              </p>
              {status === 'camera_ready' && (
                <div className="flex gap-2">
                  <Button onClick={handleScan} className="gap-2">
                    <ScanFace className="h-4 w-4" /> Scan Face
                  </Button>
                  <Button variant="ghost" onClick={onSkip}>Skip</Button>
                </div>
              )}
            </motion.div>
          )}

          {status === 'recognized' && (
            <motion.div key="recognized" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome back, {identifiedName}!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">Identity verified. C.O.M.P.A.C.T is ready.</p>
              <Button onClick={() => onComplete(identifiedName)} className="gap-2">
                Continue <Check className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {(status === 'new_user' || status === 'registering') && (
            <motion.div key="new" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center w-full">
              <div className="h-20 w-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center mb-4">
                <UserPlus className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">New face detected</h2>
              <p className="text-sm text-muted-foreground mb-6">How may I address you?</p>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="text-center mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                disabled={status === 'registering'}
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={handleRegister} disabled={!userName.trim() || status === 'registering'} className="gap-2">
                  {status === 'registering' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save & Continue
                </Button>
                <Button variant="ghost" onClick={onSkip}>Skip</Button>
              </div>
            </motion.div>
          )}

          {status === 'no_camera' && (
            <motion.div key="nocam" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center mb-4">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Camera unavailable</h2>
              <p className="text-sm text-muted-foreground mb-6">Face recognition needs camera access. You can skip this step.</p>
              <Button variant="outline" onClick={onSkip}>Continue without face recognition</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}