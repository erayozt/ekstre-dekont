import { useState } from 'react';
import { Download } from 'lucide-react';
import { generateStoredCardSettlements } from '../../utils/sampleData';
import { exportToExcel } from '../../utils/exportToExcel';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

export default function StoredCardMonthlyTable() {
  const [settlements, setSettlements] = useState(generateStoredCardSettlements());
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
        'Hakediş ID': s.id,
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
        'BSMV': `%${s.bsmv * 100}`,
        'Toplam Komisyon Tutarı': s.totalCommissionAmount ? s.totalCommissionAmount.toFixed(2) : '0.00'
      }));

    exportToExcel(exportData, `sakli_kart_aysonu_${selectedMonth}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };

  return (
    <div className="space-y-4">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hakediş ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Üye İşyeri No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Üye İşyeri Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unvan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlem Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İade Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Komisyon Oranı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BSMV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Komisyon
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
                      {settlement.merchant.merchantNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.merchant.merchantName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {settlement.merchant.title || '-'}
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
                      %{(settlement.commissionRate || 0) * 100}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      %{(settlement.bsmv || 0) * 100}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(settlement.totalCommissionAmount || 0).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
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