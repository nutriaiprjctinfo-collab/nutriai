// Local Storage Architecture for NutriAI

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Very Active';
  medicalCondition: string;
  mealPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';
  createdAt: string;
  weightHistory: { date: string; weight: number }[];
  bmiHistory: { date: string; bmi: number }[];
}

export interface Session {
  userId: string;
  activeProfileId: string;
  loginTimestamp: string;
}

const USERS_KEY = 'nutriai_users';
const SESSION_KEY = 'nutriai_session';

export const getUsers = (): UserProfile[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: UserProfile[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (user: Omit<UserProfile, 'id' | 'createdAt' | 'weightHistory' | 'bmiHistory'>): boolean => {
  const users = getUsers();
  if (users.find(u => u.email === user.email)) return false;
  const newUser: UserProfile = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    weightHistory: [{ date: new Date().toISOString(), weight: user.weight }],
    bmiHistory: [],
  };
  users.push(newUser);
  saveUsers(users);
  return true;
};

export const loginUser = (email: string, password: string): UserProfile | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return null;
  const session: Session = { userId: user.id, activeProfileId: user.id, loginTimestamp: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return user;
};

export const getSession = (): Session | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const getActiveProfile = (): UserProfile | null => {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find(u => u.id === session.activeProfileId) || null;
};

export const getCurrentUser = (): UserProfile | null => {
  const session = getSession();
  if (!session) return null;
  return getUsers().find(u => u.id === session.userId) || null;
};

export const getUserProfiles = (): UserProfile[] => {
  const session = getSession();
  if (!session) return [];
  return getUsers().filter(u => u.id === session.userId || u.email.startsWith(`patient_${session.userId}`));
};

export const switchProfile = (profileId: string) => {
  const session = getSession();
  if (!session) return;
  session.activeProfileId = profileId;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const addPatientProfile = (profile: Omit<UserProfile, 'id' | 'createdAt' | 'weightHistory' | 'bmiHistory' | 'email' | 'password'>): UserProfile => {
  const session = getSession();
  const users = getUsers();
  const newProfile: UserProfile = {
    ...profile,
    id: crypto.randomUUID(),
    email: `patient_${session?.userId}_${Date.now()}@nutriai.local`,
    password: '',
    createdAt: new Date().toISOString(),
    weightHistory: [{ date: new Date().toISOString(), weight: profile.weight }],
    bmiHistory: [],
  };
  users.push(newProfile);
  saveUsers(users);
  return newProfile;
};

export const updateProfile = (profileId: string, updates: Partial<UserProfile>) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === profileId);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};
