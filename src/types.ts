export interface GoalHistory {
  id: string;
  date: string; // ISO string
  amount: number;
}

export interface GoalShortcut {
  id: string;
  name: string;
  amount: number;
}

export const DEFAULT_GOAL_SHORTCUTS: GoalShortcut[] = [
  { id: '1', name: 'Meu Salário', amount: 500 },
  { id: '2', name: 'Salário da Esposa', amount: 500 },
  { id: '3', name: 'Dinheiro do IPTV', amount: 150 },
  { id: '4', name: 'Outros Dinheiros', amount: 100 },
];

export interface Goal {
  id: string;
  name: string;
  imageUrl: string;
  productUrl?: string;
  targetAmount: number;
  savedAmount: number;
  installments?: number;
  installmentValue?: number;
  bank?: string;
  createdAt: string; // ISO string
  history: GoalHistory[];
  shortcuts?: GoalShortcut[];
}

export interface CustomBankEntry {
  id: string;
  name: string;
  logoUrl: string;
  color: string;
}

export interface Profile {
  name: string;
  photoUrl: string;
  currency: string;
  customBanks?: Record<string, string>;
  extraBanks?: CustomBankEntry[];
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
}

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'closest';
