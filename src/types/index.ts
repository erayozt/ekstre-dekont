export interface Merchant {
  id: string;
  merchantNumber: string;
  merchantName: string;
  title: string;
  merchantType: 'SME' | 'KA';
  iban: string;
}

export interface WalletSettlement {
  id: string;
  merchant: Merchant;
  settlementDate: string;
  totalPaymentAmount: number;
  totalPaymentCount: number;
  totalRefundAmount: number;
  totalRefundCount: number;
  totalNetAmount: number;
  moneySent: boolean;
  sendDate?: string;
  accrualConfirmation: boolean;
  valorDay: string;
  commissionRate: number;
  bsmv: number;
  totalCommissionAmount: number;
}

export interface StoredCardSettlement {
  id: string;
  merchant: Merchant;
  settlementDate: string;
  totalPaymentAmount: number;
  totalPaymentCount: number;
  totalRefundAmount: number;
  totalRefundCount: number;
  totalNetAmount: number;
  incomeTaxCollection: boolean;
  collectionDate?: string;
  valorDay: string;
  commissionRate: number;
  bsmv: number;
  totalCommissionAmount: number;
}