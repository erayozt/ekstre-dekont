import { useState, useEffect } from 'react';
import { Download, Check, Filter } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';
import { useLocation, useNavigate } from 'react-router-dom';

// Örnek veri üreteci
const generateStoredCardSettlements = () => {
  const settlements = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) { // Son 6 ay için veri
    const date = subMonths(today, i);
    const monthStr = format(date, 'yyyy-MM');
    
    // Her ay için 5-15 arası merchant oluştur
    const merchantCount = Math.floor(Math.random() * 11) + 5;
    
    for (let j = 0; j < merchantCount; j++) {
      const merchantId = `M${1000 + j}`;
      const paymentAmount = Math.random() * 50000 + 5000;
      const paymentCount = Math.floor(Math.random() * 200) + 50;
      const refundAmount = Math.random() * paymentAmount * 0.15;
      const refundCount = Math.floor(Math.random() * 20);
      const netAmount = paymentAmount - refundAmount;
      const commissionRate = 0.015 + (Math.random() * 0.01);
      const commissionAmount = netAmount * commissionRate;
      const bsmv = 0.05;
      const bsmvAmount = commissionAmount * bsmv;
      const merchantType = Math.random() > 0.5 ? 'SME' : 'KA';
      
      settlements.push({
        id: `HAK-SC-${monthStr}-${merchantId}`,
        settlementDate: monthStr,
        merchant: {
          merchantNumber: merchantId,
          merchantName: `Üye İşyeri ${merchantId}`,
          title: `${merchantId} Ticaret A.Ş.`,
          merchantType: merchantType,
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
  }
  
  return settlements;
};

export default function StoredCardSettlementTable() {
  const [settlements, setSettlements] = useState(generateStoredCardSettlements());
  const [filteredSettlements, setFilteredSettlements] = useState(settlements);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    
    if (status === 'pending') {
      setFilterStatus('pending');
    }
    
    applyFilters(status);
  }, [settlements, location.search]);
  
  const applyFilters = (status = filterStatus) => {
    let filtered = settlements;
    
    if (status === 'pending') {
      filtered = filtered.filter(settlement => !settlement.revenueCollected);
    } else if (status === 'collected') {
      filtered = filtered.filter(settlement => settlement.revenueCollected);
    }
    
    setFilteredSettlements(filtered);
  };
  
  const handleFilterChange = () => {
    applyFilters();
    
    // URL'yi güncelle
    const searchParams = new URLSearchParams();
    if (filterStatus !== 'all') searchParams.set('status', filterStatus);
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
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
    const exportData = filteredSettlements
      .filter(s => s.settlementDate === selectedMonth)
      .map(s => ({
        'Hakediş ID': s.id,
        'Üye İşyeri No': s.merchant.merchantNumber,
        'Üye İşyeri Adı': s.merchant.merchantName,
        'Unvan': s.merchant.title || '',
        'Üye İşyeri Tipi': s.merchant.merchantType || '',
        'IBAN': s.merchant.iban || '',
        'Hakediş Tarihi': s.settlementDate,
        'Toplam Ödeme Tutarı': s.totalPaymentAmount.toFixed(2),
        'Toplam Ödeme Sayısı': s.totalPaymentCount,
        'Toplam İade Tutarı': s.totalRefundAmount.toFixed(2),
        'Toplam İade Sayısı': s.totalRefundCount,
        'Toplam Net Tutar': s.totalNetAmount.toFixed(2),
        'Gelir Tahsilat': s.revenueCollected ? 'Evet' : 'Hayır',
        'Tahsilat Tarihi': s.collectionDate || '-',
        'Valör Günü': s.valorDay || '',
        'Komisyon Oranı': `%${(s.commissionRate * 100).toFixed(2)}`,
        'BSMV': `%${(s.bsmv * 100).toFixed(2)}`,
        'Toplam Komisyon Tutarı': s.totalCommissionAmount.toFixed(2)
      }));

    exportToExcel(exportData, `sakli_kart_hakedis_${selectedMonth}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  const handleRevenueApproval = (settlementId) => {
    setSettlements(prevSettlements => 
      prevSettlements.map(settlement => 
        settlement.id === settlementId 
          ? { ...settlement, revenueCollected: true, collectionDate: format(new Date(), 'yyyy-MM-dd') } 
          : settlement
      )
    );
    toast.success('Alacak onayı verildi');
  };

  return (
    <div className="space-y-4">
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
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrele
          </button>
          
          <button
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Excel'e Aktar
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tahsilat Durumu
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="all">Tümü</option>
              <option value="pending">Bekleyenler</option>
              <option value="collected">Tahsil Edilenler</option>
            </select>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Filtrele
            </button>
          </div>
        </div>
      )}

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
                  Komisyon Tutarı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gelir Tahsilat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettlements
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
                      {settlement.totalCommissionAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full ${settlement.revenueCollected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {settlement.revenueCollected ? 'Evet' : 'Hayır'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!settlement.revenueCollected && (
                        <button
                          onClick={() => handleRevenueApproval(settlement.id)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Alacak Onayı Ver
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
    </div>
  );
}