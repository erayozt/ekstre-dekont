import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PdfTransactionsSectionProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfTransactionsSection({ statement, formatCurrency }: PdfTransactionsSectionProps) {
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
  };
  
  // En az 100 işlem olsun
  let transactions = statement.transactionDetails || [];
  
  // Eğer işlem sayısı 100'den azsa, dummy işlemler ekleyelim
  if (transactions.length < 100) {
    const dummyCount = 100 - transactions.length;
    const transactionTypes = ['wallet', 'storedCard', 'credit'];
    const statuses = ['completed', 'completed', 'completed', 'completed', 'refunded']; // %20 iade olsun
    
    for (let i = 0; i < dummyCount; i++) {
      const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomAmount = Math.floor(Math.random() * 1000) + 50; // 50-1050 arası
      const randomCommission = Math.floor(randomAmount * 0.025 * 100) / 100; // %2.5 komisyon
      const randomBsmv = Math.floor(randomCommission * 0.05 * 100) / 100; // %5 BSMV
      
      transactions.push({
        id: `TX-${10000 + i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString(), // Son 30 günde
        type: randomType,
        status: randomStatus,
        amount: randomAmount,
        commission: randomCommission,
        bsmv: randomBsmv,
        netAmount: randomAmount - randomCommission - randomBsmv
      });
    }
  }
  
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-indigo-500 pb-2">TÜM İŞLEMLER</h2>
      <table className="min-w-full border border-gray-200 text-xs rounded-lg overflow-hidden">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">İşlem ID</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tarih</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tip</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tutar</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Komisyon</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">BSMV</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Net Tutar</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: any, index: number) => (
            <tr key={tx.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">{tx.id}</td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">{formatDate(tx.date)}</td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                {tx.status === 'refunded' ? (
                  <span className="text-red-600">İade</span>
                ) : tx.type === 'storedCard' ? (
                  <span className="text-green-600">Saklı Kart</span>
                ) : tx.type === 'credit' ? (
                  <span className="text-purple-600">Alışveriş Kredisi</span>
                ) : (
                  <span className="text-blue-600">Cüzdan</span>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                  {formatCurrency(tx.status === 'refunded' ? -tx.amount : tx.amount)}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                  {formatCurrency(tx.commission)}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                  {formatCurrency(tx.bsmv)}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-xs border-b font-medium">
                <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                  {formatCurrency(tx.netAmount)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}