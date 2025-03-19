import { useState } from 'react';
import { Download } from 'lucide-react';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';

// Örnek veri üreteci - Merchant için tek bir merchant verisi
const generateMerchantWalletDailyTransactions = () => {
  const transactions = [];
  const today = new Date();
  const merchantId = 'M1001'; // Sabit merchant ID
  
  for (let i = 0; i < 90; i++) { // Son 3 ay için veri
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Her gün için 5-15 arası işlem oluştur
    const transactionCount = Math.floor(Math.random() * 11) + 5;
    
    for (let j = 0; j < transactionCount; j++) {
      const isRefund = Math.random() > 0.8; // %20 ihtimalle iade işlemi
      const amount = Math.random() * 1000 + 50;
      const commissionRate = 0.015 + (Math.random() * 0.01);
      const commissionAmount = amount * commissionRate;
      const bsmv = 0.05;
      const bsmvAmount = commissionAmount * bsmv;
      
      transactions.push({
        id: `TRX-${dateStr}-${j}`,
        settlementId: `HAK-${dateStr}-${merchantId}`,
        transactionDate: dateStr,
        transactionTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        merchant: {
          merchantNumber: merchantId,
          merchantName: `Üye İşyeri ${merchantId}`,
          title: `${merchantId} Ticaret A.Ş.`,
          merchantType: 'SME'
        },
        amount: isRefund ? -amount : amount,
        type: isRefund ? 'İade' : 'Satış',
        status: 'Başarılı',
        commissionRate: commissionRate,
        commissionAmount: isRefund ? -commissionAmount : commissionAmount,
        bsmv: bsmv,
        bsmvAmount: isRefund ? -bsmvAmount : bsmvAmount,
        netAmount: isRefund ? -(amount - commissionAmount - bsmvAmount) : (amount - commissionAmount - bsmvAmount)
      });
    }
  }
  
  return transactions;
};

export default function MerchantWalletDailyTable() {
  const [transactions, setTransactions] = useState(generateMerchantWalletDailyTransactions());
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Son 90 gün için tarih seçenekleri oluştur
  const getLastNinetyDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 90; i++) {
      const date = subDays(today, i);
      days.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd MMMM yyyy')
      });
    }
    
    return days;
  };
  
  const lastNinetyDays = getLastNinetyDays();
  
  const handleExportExcel = () => {
    const exportData = transactions
      .filter(t => t.transactionDate === selectedDate)
      .map(t => ({
        'İşlem ID': t.id,
        'Hakediş ID': t.settlementId,
        'İşlem Tarihi': t.transactionDate,
        'İşlem Saati': t.transactionTime,
        'İşlem Tipi': t.type,
        'Tutar': Math.abs(t.amount).toFixed(2),
        'Komisyon': Math.abs(t.commissionAmount).toFixed(2),
        'BSMV': Math.abs(t.bsmvAmount).toFixed(2),
        'Net Tutar': Math.abs(t.netAmount).toFixed(2),
        'Durum': t.status
      }));
    
    exportToExcel(exportData, `cuzdan_gunsonu_${selectedDate}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  // Seçilen gün için toplam değerleri hesapla
  const calculateDailySummary = () => {
    const filteredTransactions = transactions.filter(t => t.transactionDate === selectedDate);
    
    const totalSales = filteredTransactions
      .filter(t => t.type === 'Satış')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalRefunds = filteredTransactions
      .filter(t => t.type === 'İade')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const totalCommission = filteredTransactions
      .reduce((sum, t) => sum + Math.abs(t.commissionAmount), 0);
      
    const totalBsmv = filteredTransactions
      .reduce((sum, t) => sum + Math.abs(t.bsmvAmount), 0);
      
    const totalNet = filteredTransactions
      .reduce((sum, t) => sum + t.netAmount, 0);
      
    return {
      totalSales,
      totalRefunds,
      totalCommission,
      totalBsmv,
      totalNet,
      transactionCount: filteredTransactions.length
    };
  };
  
  const summary = calculateDailySummary();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cüzdan Günsonu Tablosu</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {lastNinetyDays.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel'e Aktar
          </button>
        </div>
      </div>
      
      {/* Günlük Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Toplam İşlem</h3>
          <p className="text-2xl font-semibold">{summary.transactionCount} Adet</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>Satış: {transactions.filter(t => t.transactionDate === selectedDate && t.type === 'Satış').length}</span>
            <span>İade: {transactions.filter(t => t.transactionDate === selectedDate && t.type === 'İade').length}</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Toplam Tutar</h3>
          <p className="text-2xl font-semibold">{summary.totalSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>İade: {summary.totalRefunds.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            <span>Net: {summary.totalNet.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Toplam Komisyon</h3>
          <p className="text-2xl font-semibold">{summary.totalCommission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>BSMV: {summary.totalBsmv.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
            <span>Toplam: {(summary.totalCommission + summary.totalBsmv).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hakediş ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem Saati
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem Tipi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komisyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BSMV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Tutar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions
                .filter(t => t.transactionDate === selectedDate)
                .map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.settlementId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.transactionTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full ${transaction.type === 'İade' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.abs(transaction.amount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.abs(transaction.commissionAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.abs(transaction.bsmvAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.netAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 