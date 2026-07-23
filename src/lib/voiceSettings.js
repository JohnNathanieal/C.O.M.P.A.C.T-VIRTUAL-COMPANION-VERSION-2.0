const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const NAMAKSHAR_AVATAR = 'https://media.db.com/images/public/6a17d6cb694a8811145ddd38/9a4361e1e_logo.png';

const STORAGE_KEY = 'namakshar_voice_settings';

export const VOICE_TYPES = [
  { id: 'man', label: 'Man', rate: 1.0, pitch: 0.85, volume: 1.0, gender: 'male', voicePrefs: ['Google UK English Male', 'Microsoft David', 'Microsoft Mark', 'Microsoft Guy', 'Daniel', 'Alex', 'Arthur', 'Rishi'] },
  { id: 'woman', label: 'Woman', rate: 1.0, pitch: 1.0, volume: 1.0, gender: 'female', voicePrefs: ['Google US English', 'Google UK English Female', 'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira', 'Victoria', 'Susan'] },
  { id: 'girl', label: 'Girl', rate: 1.05, pitch: 1.3, volume: 1.0, gender: 'female', voicePrefs: ['Google UK English Female', 'Samantha', 'Tessa', 'Fiona', 'Microsoft Zira'] },
  { id: 'boy', label: 'Boy', rate: 1.05, pitch: 0.95, volume: 1.0, gender: 'male', voicePrefs: ['Microsoft Mark', 'Microsoft Guy', 'Rishi', 'Alex'] },
  { id: 'old_man', label: 'Old Man', rate: 0.85, pitch: 0.7, volume: 1.0, gender: 'male', voicePrefs: ['Microsoft David', 'Daniel', 'Arthur', 'Alex'] },
  { id: 'old_woman', label: 'Old Woman', rate: 0.88, pitch: 0.8, volume: 1.0, gender: 'female', voicePrefs: ['Moira', 'Karen', 'Susan', 'Victoria'] },
  { id: 'deep', label: 'Deep', rate: 0.9, pitch: 0.5, volume: 1.0, gender: 'male', voicePrefs: ['Google UK English Male', 'Microsoft David', 'Daniel'] },
  { id: 'soft', label: 'Soft', rate: 0.95, pitch: 1.1, volume: 0.85, gender: 'female', voicePrefs: ['Samantha', 'Karen', 'Microsoft Aria'] },
  { id: 'energetic', label: 'Energetic', rate: 1.2, pitch: 1.2, volume: 1.0, gender: 'female', voicePrefs: ['Google US English', 'Microsoft Jenny', 'Tessa'] },
  { id: 'narrator', label: 'Narrator', rate: 0.85, pitch: 0.75, volume: 1.0, gender: 'male', voicePrefs: ['Microsoft Guy', 'Google UK English Male', 'Alex'] },
  { id: 'cheerful', label: 'Cheerful', rate: 1.1, pitch: 1.15, volume: 1.0, gender: 'female', voicePrefs: ['Samantha', 'Google US English', 'Microsoft Aria'] },
  { id: 'calm', label: 'Calm', rate: 0.85, pitch: 0.95, volume: 0.9, gender: 'female', voicePrefs: ['Karen', 'Moira', 'Microsoft Aria'] },
  { id: 'robotic', label: 'Robotic', rate: 0.95, pitch: 0.6, volume: 1.0, gender: 'male', voicePrefs: ['Microsoft David', 'Alex', 'Arthur'] },
  { id: 'professional', label: 'Pro', rate: 1.0, pitch: 0.9, volume: 1.0, gender: 'male', voicePrefs: ['Microsoft Guy', 'Google UK English Male', 'Microsoft Mark'] },
  { id: 'whisper', label: 'Whisper', rate: 0.9, pitch: 0.8, volume: 0.4, gender: 'female', voicePrefs: ['Samantha', 'Karen', 'Fiona'] },
  { id: 'bold', label: 'Bold', rate: 1.0, pitch: 0.65, volume: 1.0, gender: 'male', voicePrefs: ['Google UK English Male', 'Microsoft David', 'Daniel'] },
];

export const PERSONALITIES = [
  {
    id: 'butler',
    label: 'Butler',
    desc: 'Refined, formal, and anticipatory.',
    speechStyle: 'Speak with polished, formal English. Use words like "indeed", "very good", "at once", "as you wish", "right away". Be concise but courteous. Avoid contractions — use "cannot" not "can\'t", "I shall" not "I\'ll". End with a polite offer of further assistance. Address the user as "Boss" or "sir".',
    defaultPitch: 0.85,
    defaultSlang: 0.0,
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'Clear, patient, and educational.',
    speechStyle: 'Speak clearly and patiently, like an experienced teacher. Break complex topics into simple steps. Use phrases like "let me explain", "think of it this way", "does that make sense?". Provide examples and analogies. Be encouraging, never condescending. Ask if the user needs clarification.',
    defaultPitch: 1.0,
    defaultSlang: 0.1,
  },
  {
    id: 'mentor',
    label: 'Mentor',
    desc: 'Encouraging, wise, and guiding.',
    speechStyle: 'Speak with wisdom and warmth, like a trusted mentor. Use phrases like "here\'s what I\'d suggest", "from my experience", "you\'ve got this". Be supportive and motivational. Share insights and perspective. Keep responses thoughtful but not overly long.',
    defaultPitch: 0.95,
    defaultSlang: 0.2,
  },
  {
    id: 'parent',
    label: 'Parent',
    desc: 'Caring, supportive, and protective.',
    speechStyle: 'Speak with warmth and unconditional care, like a loving parent. Use endearments like "dear", "sweetheart". Be nurturing and protective. Offer reassurance and gentle guidance. Check in on the user\'s wellbeing. Say things like "don\'t worry", "I\'m here for you", "you rest now".',
    defaultPitch: 1.05,
    defaultSlang: 0.1,
  },
  {
    id: 'assistant',
    label: 'Personal Assistant',
    desc: 'Efficient, professional, and concise.',
    speechStyle: 'Be direct, efficient, and professional. Get straight to the point with no filler. Confirm actions taken clearly. Use phrases like "done", "I\'ve scheduled that", "noted", "on it". Keep responses short and actionable.',
    defaultPitch: 1.0,
    defaultSlang: 0.0,
  },
  {
    id: 'girlfriend',
    label: 'Girlfriend',
    desc: 'Warm, affectionate, and playful.',
    speechStyle: 'Speak with warmth, affection, and playful energy, like a loving girlfriend. Use pet names like "babe", "honey", "love". Be emotionally engaged, supportive, and a little flirty. Ask about the user\'s day. Be attentive and caring. React with emotion and enthusiasm.',
    defaultPitch: 1.25,
    defaultSlang: 0.5,
  },
  {
    id: 'friend',
    label: 'Friend',
    desc: 'Casual, fun, and relatable.',
    speechStyle: 'Speak casually like a close friend. Use informal language, humor, and a laid-back vibe. Say things like "hey", "no worries", "gotcha", "sounds good", "for sure". Be relaxed, supportive, and fun. Keep it light and conversational. Crack jokes occasionally.',
    defaultPitch: 1.1,
    defaultSlang: 0.7,
  },
];

const DEFAULT_SETTINGS = {
  name: 'C.O.M.P.A.C.T',
  voiceType: 'man',
  speed: 1.0,
  volume: 1.0,
  personality: 'butler',
  personalityOverrides: {},
};

export function getVoiceSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveVoiceSettings(partial) {
  const updated = { ...getVoiceSettings(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getVoiceProfile() {
  const settings = getVoiceSettings();
  const profile = VOICE_TYPES.find((v) => v.id === settings.voiceType) || VOICE_TYPES[0];
  const personality = PERSONALITIES.find((p) => p.id === settings.personality);
  const override = settings.personalityOverrides?.[settings.personality];
  const basePitch = profile.pitch ?? 1.0;
  const pitch = override?.pitch ?? basePitch;
  const voiceVolume = profile.volume ?? 1.0;
  const globalVolume = settings.volume ?? 1.0;
  return { ...profile, speed: settings.speed, pitch, volume: voiceVolume * globalVolume };
}

export function getName() {
  return getVoiceSettings().name || 'C.O.M.P.A.C.T';
}

export function getPersonality() {
  const settings = getVoiceSettings();
  return PERSONALITIES.find((p) => p.id === settings.personality) || PERSONALITIES[0];
}

export function getPersonalityPitch(personalityId) {
  const settings = getVoiceSettings();
  const personality = PERSONALITIES.find((p) => p.id === personalityId);
  if (!personality) return 1.0;
  const override = settings.personalityOverrides?.[personalityId];
  return override?.pitch ?? personality.defaultPitch;
}

export function getPersonalitySlang(personalityId) {
  const settings = getVoiceSettings();
  const personality = PERSONALITIES.find((p) => p.id === personalityId);
  if (!personality) return 0;
  const override = settings.personalityOverrides?.[personalityId];
  return override?.slang ?? personality.defaultSlang;
}

export function slangToInstruction(slang) {
  if (slang <= 0.1) return 'Use formal, proper English with no slang or colloquialisms.';
  if (slang <= 0.3) return 'Use mostly formal language with occasional mild informal expressions.';
  if (slang <= 0.5) return 'Use a balanced mix of casual and formal language.';
  if (slang <= 0.7) return 'Use casual, informal language with moderate slang and colloquialisms.';
  if (slang <= 0.9) return 'Use heavy slang, street language, and very informal expressions throughout.';
  return 'Use maximum slang, internet speak, abbreviations, and very casual street language in every response.';
}