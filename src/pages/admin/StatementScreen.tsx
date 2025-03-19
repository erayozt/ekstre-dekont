import { useState } from 'react';
import { Download } from 'lucide-react';
import { generateWalletSettlements, generateStoredCardSettlements } from '../../utils/sampleData';
import { exportToExcel } from '../../utils/exportToExcel';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function StatementScreen() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedMerchantId, setSelectedMerchantId] = useState('1');
  
  const walletSettlements = generateWalletSettlements();
  const storedCardSettlements = generateStoredCardSettlements();

  const handleExportExcel = () => {
    const walletData = walletSettlements
      .filter(s => 
        s.settlementDate.startsWith(selectedMonth) && 
        s.merchant.id === selectedMerchantId
      );

    const storedCardData = storedCardSettlements
      .filter(s => 
        s.settlementDate === selectedMonth && 
        s.merchant.id === selectedMerchantId
      );

    const exportData = {
      walletSummary: {
        totalPayments: walletData.reduce((sum, s) => sum + s.totalPaymentAmount, 0),
        totalRefunds: walletData.reduce((sum, s) => sum + s.totalRefundAmount, 0),
        netAmount: walletData.reduce((sum, s) => sum + s.totalNetAmount, 0),
        totalCommission: walletData.reduce((sum, s) => sum + s.totalCommissionAmount, 0)
      },
      storedCardSummary: storedCardData.length > 0 ? {
        totalPayments: storedCardData[0].totalPaymentAmount,
        totalRefunds: storedCardData[0].totalRefundAmount,
        netAmount: storedCardData[0].totalNetAmount,
        totalCommission: storedCardData[0].totalCommissionAmount
      } : null
    };

    exportToExcel([exportData], 'extre');
    toast.success('Excel dosyası başarıyla indirildi');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Extre Ekranı</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedMerchantId}
            onChange={(e) => setSelectedMerchantId(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="1">ABC Market</option>
            <option value="2">XYZ Electronics</option>
            <option value="3">Fashion Store</option>
          </select>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel'e Aktar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Cüzdan Özeti</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Toplam İşlem:</span>
              <span className="font-medium">
                {walletSettlements
                  .filter(s => 
                    s.settlementDate.startsWith(selectedMonth) && 
                    s.merchant.id === selectedMerchantId
                  )
                  .reduce((sum, s) => sum + s.totalPaymentAmount, 0)
                  .toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Toplam İade:</span>
              <span className="font-medium">
                {walletSettlements
                  .filter(s => 
                    s.settlementDate.startsWith(selectedMonth) && 
                    s.merchant.id === selectedMerchantId
                  )
                  .reduce((sum, s) => sum + s.totalRefundAmount, 0)
                  .toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </p>
            <p className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Net Tutar:</span>
              <span className="font-medium">
                {walletSettlements
                  .filter(s => 
                    s.settlementDate.startsWith(selectedMonth) && 
                    s.merchant.id === selectedMerchantId
                  )
                  .reduce((sum, s) => sum + s.totalNetAmount, 0)
                  .toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Saklı Kart Özeti</h2>
          <div className="space-y-2">
            {storedCardSettlements
              .filter(s => 
                s.settlementDate === selectedMonth && 
                s.merchant.id === selectedMerchantId
              )
              .map(settlement => (
                <div key={settlement.id}>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Toplam İşlem:</span>
                    <span className="font-medium">
                      {settlement.totalPaymentAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Toplam İade:</span>
                    <span className="font-medium">
                      {settlement.totalRefundAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </p>
                  <p className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Net Tutar:</span>
                    <span className="font-medium">
                      {settlement.totalNetAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}