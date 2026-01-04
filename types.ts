
export interface Transaction {
  id: string;
  type: string;
  status: string;
  piAmount: number;
  usdtAmount: number;
  fee: string;
  sourceAccount: string;
  exchangeRate: string;
  timestamp: string;
  createdAt: number;
}

export type ViewType = 'dashboard' | 'upload' | 'history';
