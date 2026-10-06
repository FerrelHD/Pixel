export type ModalType = 'status' | 'missions' | 'skills' | 'signal' | null;

export type SpideySuit = 'classic' | 'symbiote' | '2099';

export interface ProjectQuest {
  id: string;
  title: string;
  subtitle: string;
  category: 'web' | 'game' | 'ai';
  rank: 'S-CLASS' | 'A-CLASS';
  status: 'COMPLETED' | 'IN_PROGRESS';
  description: string;
  lore: string;
  tech: string[];
  repoUrl: string;
  demoUrl?: string;
  badge: string;
  accentColor: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: { name: string; level: number }[];
}

export interface PlayerStats {
  name: string;
  title: string;
  level: number;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  exp: number;
  maxExp: number;
  classType: string;
  neighborhood: string;
  inventory: string[];
}
