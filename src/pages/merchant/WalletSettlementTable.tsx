import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';

// Örnek veri üreteci - Merchant için tek bir merchant verisi
const generateMerchantWalletSettlements = () => {
  const settlements = [];
  const today = new Date();
  const merchantId = 'M1001'; // Sabit merchant ID
  
  for (let i = 0; i < 90; i++) { // Son 3 ay için veri
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const paymentAmount = Math.random() * 10000 + 1000;
    const paymentCount = Math.floor(Math.random() * 50) + 10;
    const refundAmount = Math.random() * paymentAmount * 0.2;
    const refundCount = Math.floor(Math.random() * 5);
    const netAmount = paymentAmount - refundAmount;
    const commissionRate = 0.015 + (Math.random() * 0.01);
    const commissionAmount = netAmount * commissionRate;
    const bsmv = 0.05;
    const bsmvAmount = commissionAmount * bsmv;
    
    settlements.push({
      id: `HAK-${dateStr}-${merchantId}`,
      settlementDate: dateStr,
      merchant: {
        merchantNumber: merchantId,
        merchantName: `Üye İşyeri ${merchantId}`,
        title: `${merchantId} Ticaret A.Ş.`,
        merchantType: 'SME',
        iban: `TR${Math.floor(Math.random() * 10000000000000000)}`
      },
      totalPaymentAmount: paymentAmount,
      totalPaymentCount: paymentCount,
      totalRefundAmount: refundAmount,
      totalRefundCount: refundCount,
      totalNetAmount: netAmount,
      valorDay: Math.floor(Math.random() * 3) + 1,
      commissionRate: commissionRate,
      totalCommissionAmount: commissionAmount,
      bsmv: bsmv,
      bsmvAmount: bsmvAmount,
      paymentSent: Math.random() > 0.3,
      paymentDate: Math.random() > 0.3 ? format(subDays(date, Math.floor(Math.random() * 3) + 1), 'yyyy-MM-dd') : null,
      confirmationReceived: Math.random() > 0.5,
      confirmationDate: Math.random() > 0.5 ? format(subDays(date, Math.floor(Math.random() * 2)), 'yyyy-MM-dd') : null
    });
  }
  
  return settlements;
};

export default function MerchantWalletSettlementTable() {
  const [settlements, setSettlements] = useState(generateMerchantWalletSettlements());
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
    const exportData = settlements
      .filter(s => s.settlementDate === selectedDate)
      .map(s => ({
        'Hakediş ID': s.id,
        'Hakediş Tarihi': s.settlementDate,
        'Toplam Ödeme Tutarı': s.totalPaymentAmount.toFixed(2),
        'Toplam Ödeme Sayısı': s.totalPaymentCount,
        'Toplam İade Tutarı': s.totalRefundAmount.toFixed(2),
        'Toplam İade Sayısı': s.totalRefundCount,
        'Net Tutar': s.totalNetAmount.toFixed(2),
        'Para Gönderildi': s.paymentSent ? 'Evet' : 'Hayır',
        'Gönderim Tarihi': s.paymentDate || '-',
        'Tahakkuk Teyit': s.confirmationReceived ? 'VAR' : 'YOK',
        'Valör Günü': s.valorDay
      }));
    
    exportToExcel(exportData, `cuzdan_hakedis_${selectedDate}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  const handleConfirmation = (settlementId: string) => {
    setSettlements(prevSettlements => 
      prevSettlements.map(settlement => 
        settlement.id === settlementId 
          ? { 
              ...settlement, 
              confirmationReceived: true,
              confirmationDate: format(new Date(), 'yyyy-MM-dd')
            } 
          : settlement
      )
    );
    toast.success('Tahakkuk teyidi başarıyla gönderildi');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cüzdan Hakediş Tablosu</h1>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hakediş ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hakediş Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam İşlem Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam İade Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme Durumu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahakkuk Teyidi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settlements
                .filter(s => s.settlementDate === selectedDate)
                .map((settlement) => (
                  <tr key={settlement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.settlementDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.totalPaymentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.totalRefundCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.totalNetAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full ${settlement.paymentSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {settlement.paymentSent ? 'Ödendi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full ${settlement.confirmationReceived ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settlement.confirmationReceived ? 'Teyit Edildi' : 'Teyit Bekliyor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!settlement.confirmationReceived && (
                        <button
                          onClick={() => handleConfirmation(settlement.id)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Teyit Et
                        </button>
                      )}
                      {settlement.confirmationReceived && (
                        <span className="text-gray-500">
                          {settlement.confirmationDate}
                        </span>
                      )}
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
