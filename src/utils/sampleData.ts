import { format, subDays, subMonths } from 'date-fns';
import type { Merchant, WalletSettlement, StoredCardSettlement } from '../types';

const merchants: Merchant[] = [
  {
    id: '1',
    merchantNumber: 'M123456',
    merchantName: 'ABC Market',
    title: 'ABC Market A.Ş.',
    merchantType: 'SME',
    iban: 'TR330006100519786457841326'
  },
  {
    id: '2',
    merchantNumber: 'M789012',
    merchantName: 'XYZ Electronics',
    title: 'XYZ Elektronik Ticaret Ltd. Şti.',
    merchantType: 'KA',
    iban: 'TR770006100519786457841327'
  },
  {
    id: '3',
    merchantNumber: 'M345678',
    merchantName: 'Fashion Store',
    title: 'Fashion Mağazacılık A.Ş.',
    merchantType: 'SME',
    iban: 'TR550006100519786457841328'
  }
];

export const generateWalletSettlements = (): WalletSettlement[] => {
  const settlements: WalletSettlement[] = [];
  
  merchants.forEach(merchant => {
    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      settlements.push({
        id: `WS${merchant.id}${i}`,
        merchant,
        settlementDate: format(date, 'yyyy-MM-dd'),
        totalPaymentAmount: Math.random() * 100000,
        totalPaymentCount: Math.floor(Math.random() * 100),
        totalRefundAmount: Math.random() * 10000,
        totalRefundCount: Math.floor(Math.random() * 10),
        totalNetAmount: Math.random() * 90000,
        moneySent: i > 15,
        sendDate: i > 15 ? format(subDays(date, 1), 'yyyy-MM-dd') : undefined,
        accrualConfirmation: i > 20,
        valorDay: format(subDays(date, -1), 'yyyy-MM-dd'),
        commissionRate: 1.5,
        bsmv: 0.075,
        totalCommissionAmount: Math.random() * 1000
      });
    }
  });

  return settlements;
};

export const generateStoredCardSettlements = (): StoredCardSettlement[] => {
  const settlements: StoredCardSettlement[] = [];
  
  merchants.forEach(merchant => {
    for (let i = 0; i < 6; i++) {
      const date = subMonths(new Date(), i);
      settlements.push({
        id: `SC${merchant.id}${i}`,
        merchant,
        settlementDate: format(date, 'yyyy-MM'),
        totalPaymentAmount: Math.random() * 500000,
        totalPaymentCount: Math.floor(Math.random() * 1000),
        totalRefundAmount: Math.random() * 50000,
        totalRefundCount: Math.floor(Math.random() * 100),
        totalNetAmount: Math.random() * 450000,
        incomeTaxCollection: i > 2,
        collectionDate: i > 2 ? format(subDays(date, 5), 'yyyy-MM-dd') : undefined,
        valorDay: format(subDays(date, -1), 'yyyy-MM-dd'),
        commissionRate: 2.0,
        bsmv: 0.075,
        totalCommissionAmount: Math.random() * 5000
      });
    }
  });

  return settlements;
};

export const merchants_list = merchants;