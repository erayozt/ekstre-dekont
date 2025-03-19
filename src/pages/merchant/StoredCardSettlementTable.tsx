import { useState } from 'react';
import { Download, Check, CreditCard } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';

// Örnek veri üreteci - Merchant için tek bir merchant verisi
const generateMerchantStoredCardSettlements = () => {
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
      id: `HAK-SC-${monthStr}-${merchantId}`,
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
      bsmvAmount: bsmvAmount,
      revenueCollected: Math.random() > 0.4,
      collectionDate: Math.random() > 0.4 ? format(subMonths(date, -1), 'yyyy-MM-dd') : null
    });
  }
  
  return settlements;
};

export default function MerchantStoredCardSettlementTable() {
  const [settlements, setSettlements] = useState(generateMerchantStoredCardSettlements());
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  
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
        'Hakediş Ayı': s.settlementDate,
        'Toplam Ödeme Tutarı': s.totalPaymentAmount.toFixed(2),
        'Toplam Ödeme Sayısı': s.totalPaymentCount,
        'Toplam İade Tutarı': s.totalRefundAmount.toFixed(2),
        'Toplam İade Sayısı': s.totalRefundCount,
        'Net Tutar': s.totalNetAmount.toFixed(2),
        'Komisyon Oranı': `%${(s.commissionRate * 100).toFixed(2)}`,
        'Komisyon Tutarı': s.totalCommissionAmount.toFixed(2),
        'BSMV Oranı': `%${(s.bsmv * 100).toFixed(2)}`,
        'BSMV Tutarı': s.bsmvAmount.toFixed(2),
        'Toplam Komisyon': (s.totalCommissionAmount + s.bsmvAmount).toFixed(2),
        'Tahsilat Durumu': s.revenueCollected ? 'Tahsil Edildi' : 'Bekliyor',
        'Tahsilat Tarihi': s.collectionDate || ''
      }));
    
    exportToExcel(exportData, `sakli_kart_hakediş_${selectedMonth}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  const handlePaymentClick = (settlement) => {
    setSelectedSettlement(settlement);
    setShowPaymentModal(true);
  };
  
  const handlePaymentSubmit = () => {
    setSettlements(prevSettlements => 
      prevSettlements.map(settlement => 
        settlement.id === selectedSettlement.id 
          ? { 
              ...settlement, 
              revenueCollected: true, 
              collectionDate: format(new Date(), 'yyyy-MM-dd')
            } 
          : settlement
      )
    );
    
    setShowPaymentModal(false);
    toast.success('Komisyon ödemesi başarıyla gerçekleştirildi');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Saklı Kart Hakediş Tablosu</h1>
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
                  Hakediş Ayı
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
                  Tahsilat Durumu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
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
                      <span className={`px-2 py-1 rounded-full ${settlement.revenueCollected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {settlement.revenueCollected ? 'Tahsil Edildi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!settlement.revenueCollected && (
                        <button
                          onClick={() => handlePaymentClick(settlement)}
                          className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CreditCard className="w-4 h-4 mr-1" />
                          Ödeme Yap
                        </button>
                      )}
                      {settlement.revenueCollected && (
                        <span className="text-gray-500">
                          {settlement.collectionDate}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Ödeme Modal */}
      {showPaymentModal && selectedSettlement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Komisyon Ödemesi</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Hakediş ID</p>
                <p className="font-medium">{selectedSettlement.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Dönem</p>
                <p className="font-medium">{selectedSettlement.settlementDate}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Ödenecek Tutar</p>
                <p className="text-xl font-bold text-green-600">
                  {(selectedSettlement.totalCommissionAmount + selectedSettlement.bsmvAmount).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Ödeme Yöntemi</p>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-gray-100">
                    Banka Havalesi
                  </button>
                  <button className="flex-1 py-2 px-3 border border-green-500 rounded-md bg-green-50 text-green-700">
                    Kredi Kartı
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                İptal
              </button>
              <button 
                onClick={handlePaymentSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Ödemeyi Tamamla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 