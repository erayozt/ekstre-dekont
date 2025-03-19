interface PdfTransactionDetailsSectionProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfTransactionDetailsSection({ statement, formatCurrency }: PdfTransactionDetailsSectionProps) {
  // API verilerinin yapısını kontrol edelim
  const storedCardData = statement?.storedCardTransactions || { count: 0, volume: 0, commission: 0, netAmount: 0 };
  const refundData = statement?.refundTransactions || { volume: 0, commission: 0, netAmount: 0 };

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-blue-500 pb-2">İşlem Detayları</h2>
      
      {/* Saklı Kart İşlemleri - Sadece saklı kart işlemlerini göster */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-green-700 mb-2 pl-1 border-l-3 border-green-400">Saklı Kart İşlemleri</h3>
        <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-green-700">İşlem Adedi</th>
              <th className="px-3 py-2 text-left font-medium text-green-700">Toplam Tutar</th>
              <th className="px-3 py-2 text-left font-medium text-green-700">Komisyon</th>
              <th className="px-3 py-2 text-left font-medium text-green-700">Net Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-3 py-2 border-b">{storedCardData.count}</td>
              <td className="px-3 py-2 border-b">{formatCurrency(storedCardData.volume)}</td>
              <td className="px-3 py-2 border-b">{formatCurrency(storedCardData.commission)}</td>
              <td className="px-3 py-2 border-b font-medium">{formatCurrency(storedCardData.netAmount)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* İade İşlemleri */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-red-700 mb-2 pl-1 border-l-3 border-red-400">İade İşlemleri</h3>
        <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-red-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-red-700">İşlem Adedi</th>
              <th className="px-3 py-2 text-left font-medium text-red-700">Toplam Tutar</th>
              <th className="px-3 py-2 text-left font-medium text-red-700">Komisyon İadesi</th>
              <th className="px-3 py-2 text-left font-medium text-red-700">Net İade</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-3 py-2 border-b">{storedCardData.refundCount || 0}</td>
              <td className="px-3 py-2 border-b text-red-600">{formatCurrency(-(refundData.volume || 0))}</td>
              <td className="px-3 py-2 border-b">{formatCurrency(refundData.commission || 0)}</td>
              <td className="px-3 py-2 border-b text-red-600 font-medium">{formatCurrency(-(refundData.netAmount || 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 