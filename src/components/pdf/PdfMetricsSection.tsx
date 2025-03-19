import React from 'react';

interface PdfMetricsSectionProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfMetricsSection({ statement, formatCurrency }: PdfMetricsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-teal-500 pb-2">Geçiş Metrikleri</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Kart Formu Geçişleri */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-teal-50 px-3 py-2 border-b border-teal-100">
            <h3 className="text-xs font-medium text-teal-700">Kart Formu Geçişleri</h3>
          </div>
          <div className="p-3">
            <div className="mb-4">
              <h4 className="text-xs font-medium text-teal-600 mb-2 border-b border-gray-100 pb-1">GMV</h4>
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-xs">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-medium text-teal-700">Toplam:</th>
                    <th className="px-3 py-1.5 text-right font-medium text-teal-700">Değer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b">Toplam:</td>
                    <td className="px-3 py-1.5 font-medium border-b text-right">{formatCurrency(statement.hpProductTransactions?.totalVolume || 0)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5">Kayıtlı Kart:</td>
                    <td className="px-3 py-1.5 font-medium text-right">{formatCurrency(statement.storedCardTransactions.volume)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-teal-600 mb-2 border-b border-gray-100 pb-1">İşlem Adedi</h4>
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-xs">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-medium text-teal-700">Tip</th>
                    <th className="px-3 py-1.5 text-right font-medium text-teal-700">Adet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b">Toplam:</td>
                    <td className="px-3 py-1.5 font-medium border-b text-right">{(statement.hpProductTransactions?.totalCount || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5">Kayıtlı Kart:</td>
                    <td className="px-3 py-1.5 font-medium text-right">{statement.storedCardTransactions.count.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* HP Ürünleri Geçişleri */}
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-amber-50 px-3 py-2 border-b border-amber-100">
            <h3 className="text-xs font-medium text-amber-700">HP Ürünleri Geçişleri</h3>
          </div>
          <div className="p-3">
            <div className="mb-4">
              <h4 className="text-xs font-medium text-amber-600 mb-2 border-b border-gray-100 pb-1">GMV</h4>
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-xs">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-medium text-amber-700">Tip</th>
                    <th className="px-3 py-1.5 text-right font-medium text-amber-700">Değer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b">Toplam:</td>
                    <td className="px-3 py-1.5 font-medium border-b text-right">{formatCurrency(statement.hpProductTransactions?.totalVolume || 0)}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5">Kayıtlı Kart:</td>
                    <td className="px-3 py-1.5 font-medium text-right">{formatCurrency(statement.hpProductTransactions?.storedCardVolume || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-amber-600 mb-2 border-b border-gray-100 pb-1">İşlem Adedi</h4>
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden text-xs">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-medium text-amber-700">Tip</th>
                    <th className="px-3 py-1.5 text-right font-medium text-amber-700">Adet</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5 border-b">Toplam:</td>
                    <td className="px-3 py-1.5 font-medium border-b text-right">{(statement.hpProductTransactions?.totalCount || 0).toLocaleString()}</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-1.5">Kayıtlı Kart:</td>
                    <td className="px-3 py-1.5 font-medium text-right">{(statement.hpProductTransactions?.storedCardCount || 0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 