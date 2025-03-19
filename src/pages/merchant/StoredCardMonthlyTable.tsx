import { useState } from 'react';
import { Download } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';

// Örnek veri üreteci - Merchant için tek bir merchant verisi
const generateMerchantStoredCardMonthly = () => {
  const settlements = [];
  const today = new Date();
  const merchantId = 'M1001'; // Sabit merchant ID
  
  for (let i = 0; i < 6; i++) { // Son 6 ay için veri
    const date = subMonths(today, i);
    const monthStr = format(date, 'yyyy-MM');
    
    const paymentAmount = Math.random() * 50000 + 5000;
    const paymentCount = Math.floor(Math.random() * 200) + 50;
    const refundAmount = Math.random() * paymentAmount * 0.15;
    const refundCount = Math.floor(Math.random() * 20);
    const netAmount = paymentAmount - refundAmount;
    const commissionRate = 0.015 + (Math.random() * 0.01);
    const commissionAmount = netAmount * commissionRate;
    const bsmv = 0.05;
    const bsmvAmount = commissionAmount * bsmv;
    
    settlements.push({
      id: `AYLIK-SC-${monthStr}-${merchantId}`,
      settlementDate: monthStr,
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
      bsmvAmount: bsmvAmount
    });
  }
  
  return settlements;
};

export default function MerchantStoredCardMonthlyTable() {
  const [settlements, setSettlements] = useState(generateMerchantStoredCardMonthly());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  
  // Son 6 ay için tarih seçenekleri oluştur
  const getLastSixMonths = () => {
    const today = new Date();
    const months = [];
    
    for (let i = 0; i < 6; i++) {
      const date = subMonths(today, i);
      months.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy')
      });
    }
    
    return months;
  };
  
  const lastSixMonths = getLastSixMonths();
  
  const handleExportExcel = () => {
    const exportData = settlements
      .filter(s => s.settlementDate === selectedMonth)
      .map(s => ({
        'Rapor ID': s.id,
        'Ay': s.settlementDate,
        'Üye İşyeri No': s.merchant.merchantNumber,
        'Üye İşyeri Adı': s.merchant.merchantName,
        'Unvan': s.merchant.title || '',
        'Üye İşyeri Tipi': s.merchant.merchantType || '',
        'IBAN': s.merchant.iban || '',
        'Toplam İşlem Tutarı': s.totalPaymentAmount.toFixed(2),
        'Toplam İşlem Sayısı': s.totalPaymentCount,
        'Toplam İade Tutarı': s.totalRefundAmount.toFixed(2),
        'Toplam İade Sayısı': s.totalRefundCount,
        'Net Tutar': s.totalNetAmount.toFixed(2),
        'Valör Günü': s.valorDay || '',
        'Komisyon Oranı': `%${s.commissionRate * 100}` || '',
        'BSMV': `%${s.bsmv * 100}`
      }));
    
    exportToExcel(exportData, `sakli_kart_aysonu_${selectedMonth}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Saklı Kart Aysonu Tablosu</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {lastSixMonths.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
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

      {/* Aylık Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settlements
          .filter(s => s.settlementDate === selectedMonth)
          .map((settlement) => (
            <div key={settlement.id} className="col-span-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">İşlem Bilgileri</h3>
                    <p className="text-lg font-semibold mt-1">
                      {settlement.totalPaymentCount} Satış / {settlement.totalRefundCount} İade
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Toplam: {settlement.totalNetAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Komisyon Bilgileri</h3>
                    <p className="text-lg font-semibold mt-1">
                      %{(settlement.commissionRate * 100).toFixed(2)} Oran
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tutar: {settlement.totalCommissionAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">BSMV Bilgileri</h3>
                    <p className="text-lg font-semibold mt-1">
                      %{(settlement.bsmv * 100).toFixed(2)} Oran
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tutar: {settlement.bsmvAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Toplam Ödenecek Komisyon</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {(settlement.totalCommissionAmount + settlement.bsmvAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ay
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
                  Komisyon Oranı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komisyon Tutarı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BSMV Tutarı
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settlements
                .filter(s => s.settlementDate === selectedMonth)
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
                      %{(settlement.commissionRate * 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.totalCommissionAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.bsmvAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
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
