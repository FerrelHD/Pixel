export type ModalType = 'status' | 'missions' | 'skills' | 'signal' | null;

export interface ProjectQuest {
  id: string;
  title: string;
  category: 'Game' | 'Web' | 'Engine';
  status: 'COMPLETED' | 'IN_PROGRESS';
  description: string;
  tech: string[];
  link?: string;
  github?: string;
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
