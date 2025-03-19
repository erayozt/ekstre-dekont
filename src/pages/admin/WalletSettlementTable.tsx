import { useState, useEffect } from 'react';
import { Download, Check, Filter } from 'lucide-react';
import { format, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { exportToExcel } from '../../utils/exportToExcel';
import { useLocation, useNavigate } from 'react-router-dom';

// Örnek veri üreteci
const generateWalletSettlements = () => {
  const settlements = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Her gün için 5-10 arası merchant oluştur
    const merchantCount = Math.floor(Math.random() * 6) + 5;
    
    for (let j = 0; j < merchantCount; j++) {
      const merchantId = `M${1000 + j}`;
      const paymentAmount = Math.random() * 10000 + 1000;
      const paymentCount = Math.floor(Math.random() * 50) + 10;
      const refundAmount = Math.random() * paymentAmount * 0.2;
      const refundCount = Math.floor(Math.random() * 5);
      const netAmount = paymentAmount - refundAmount;
      const commissionRate = 0.015 + (Math.random() * 0.01);
      const commissionAmount = netAmount * commissionRate;
      const bsmv = 0.05;
      const bsmvAmount = commissionAmount * bsmv;
      const merchantType = Math.random() > 0.5 ? 'SME' : 'KA';
      
      settlements.push({
        id: `HAK-${dateStr}-${merchantId}`,
        settlementDate: dateStr,
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
        paymentSent: Math.random() > 0.3,
        paymentDate: Math.random() > 0.3 ? format(subDays(date, Math.floor(Math.random() * 3) + 1), 'yyyy-MM-dd') : null,
        confirmationReceived: Math.random() > 0.5
      });
    }
  }
  
  return settlements;
};

export default function WalletSettlementTable() {
  const [settlements, setSettlements] = useState(generateWalletSettlements());
  const [filteredSettlements, setFilteredSettlements] = useState(settlements);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterConfirmation, setFilterConfirmation] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const confirmation = searchParams.get('confirmation');
    
    if (status === 'pending') {
      setFilterStatus('pending');
    }
    
    if (confirmation === 'pending') {
      setFilterConfirmation('pending');
    }
    
    applyFilters(status, confirmation);
  }, [settlements, location.search]);
  
  const applyFilters = (status = filterStatus, confirmation = filterConfirmation) => {
    let filtered = settlements;
    
    if (status === 'pending') {
      filtered = filtered.filter(settlement => !settlement.paymentSent);
    } else if (status === 'completed') {
      filtered = filtered.filter(settlement => settlement.paymentSent);
    }
    
    if (confirmation === 'pending') {
      filtered = filtered.filter(settlement => !settlement.confirmationReceived);
    } else if (confirmation === 'confirmed') {
      filtered = filtered.filter(settlement => settlement.confirmationReceived);
    }
    
    setFilteredSettlements(filtered);
  };
  
  const handleFilterChange = () => {
    applyFilters();
    
    // URL'yi güncelle
    const searchParams = new URLSearchParams();
    if (filterStatus !== 'all') searchParams.set('status', filterStatus);
    if (filterConfirmation !== 'all') searchParams.set('confirmation', filterConfirmation);
    
    navigate({
      pathname: location.pathname,
      search: searchParams.toString()
    });
  };
  
  // Son 30 gün için tarih seçenekleri oluştur
  const getLastThirtyDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      days.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd MMMM yyyy')
      });
    }
    
    return days;
  };
  
  const lastThirtyDays = getLastThirtyDays();
  
  const handleExportExcel = () => {
    const exportData = filteredSettlements
      .filter(s => s.settlementDate === selectedDate)
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
        'Para Gönderildi': s.paymentSent ? 'Evet' : 'Hayır',
        'Gönderim Tarihi': s.paymentDate || '-',
        'Tahakkuk Teyit': s.confirmationReceived ? 'VAR' : 'YOK',
        'Valör Günü': s.valorDay || '',
        'Komisyon Oranı': `%${(s.commissionRate * 100).toFixed(2)}`,
        'BSMV': `%${(s.bsmv * 100).toFixed(2)}`,
        'Toplam Komisyon Tutarı': s.totalCommissionAmount.toFixed(2)
      }));

    exportToExcel(exportData, `cuzdan_hakedis_${selectedDate}`);
    toast.success('Excel dosyası başarıyla indirildi');
  };
  
  const handlePaymentApproval = (settlementId) => {
    setSettlements(prevSettlements => 
      prevSettlements.map(settlement => 
        settlement.id === settlementId 
          ? { ...settlement, paymentSent: true, paymentDate: format(new Date(), 'yyyy-MM-dd') } 
          : settlement
      )
    );
    toast.success('Ödeme onayı verildi');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cüzdan Hakediş Tablosu</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {lastThirtyDays.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ödeme Durumu
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">Tümü</option>
                <option value="pending">Bekleyenler</option>
                <option value="completed">Tamamlananlar</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahakkuk Teyidi
              </label>
              <select
                value={filterConfirmation}
                onChange={(e) => setFilterConfirmation(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="all">Tümü</option>
                <option value="pending">Bekleyenler</option>
                <option value="confirmed">Teyit Edilenler</option>
              </select>
            </div>
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
                  Üye İşyeri Tipi
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
                  Para Gönderildi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tahakkuk Teyit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettlements
                .filter(s => s.settlementDate === selectedDate)
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
                      {settlement.merchant.merchantType || '-'}
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
                        {settlement.paymentSent ? 'Evet' : 'Hayır'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full ${settlement.confirmationReceived ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settlement.confirmationReceived ? 'VAR' : 'YOK'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {!settlement.paymentSent && (
                        <button
                          onClick={() => handlePaymentApproval(settlement.id)}
                          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Ödeme Onayı Ver
                        </button>
                      )}
                      {settlement.paymentSent && (
                        <span className="text-gray-500">
                          {settlement.paymentDate}
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