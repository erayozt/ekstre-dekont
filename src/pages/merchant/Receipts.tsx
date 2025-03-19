import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Search, FileText, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import ReceiptDetailModal from '../../components/ReceiptDetailModal';

export default function Receipts() {
  const [isLoading, setIsLoading] = useState(true);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });

  // Simüle edilmiş veri yüklemesi
  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      try {
        // Mock veri - gerçek API'den alınacak
        const mockData = Array.from({ length: 20 }, (_, i) => ({
          id: `REC-${1000 + i}`,
          date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
          amount: Math.round(Math.random() * 10000) / 100 * 1000,
          walletTransactions: {
            count: Math.floor(Math.random() * 500) + 50,
            volume: Math.round(Math.random() * 10000) / 100 * 1000,
            commission: Math.round(Math.random() * 1000) / 100 * 25,
            netAmount: Math.round(Math.random() * 10000) / 100 * 950
          },
          creditTransactions: {
            count: Math.floor(Math.random() * 100) + 10,
            volume: Math.round(Math.random() * 5000) / 100 * 1000,
            commission: Math.round(Math.random() * 500) / 100 * 25,
            netAmount: Math.round(Math.random() * 5000) / 100 * 950
          },
          status: i % 5 === 0 ? 'pending' : 'completed',
          description: `${format(new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), 'dd MMMM yyyy', { locale: tr })} tarihli cüzdan ve alışveriş kredisi hakediş ödemesi`
        }));
        
        setReceipts(mockData);
        setFilteredReceipts(mockData);
      } catch (error) {
        console.error('Dekontlar yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  // Arama ve filtreleme
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredReceipts(receipts);
      return;
    }

    const filtered = receipts.filter(receipt => 
      receipt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredReceipts(filtered);
  }, [searchQuery, receipts]);

  // Tarih aralığı filtrelemesi
  const handleDateRangeFilter = () => {
    const filtered = receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate >= dateRange.start && receiptDate <= dateRange.end;
    });
    
    setFilteredReceipts(filtered);
  };

  // Dekont detayı görüntüleme
  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  // Para birimini formatlama
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Tarih formatlama
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ödeme Dekontları</h1>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Dekont ara..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              onClick={() => document.getElementById('dateFilterDropdown')?.classList.toggle('hidden')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Tarih Filtresi
            </button>
            
            <div id="dateFilterDropdown" className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10 hidden">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Tarih Aralığı</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500">Başlangıç</label>
                    <input 
                      type="date" 
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      value={format(dateRange.start, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange({...dateRange, start: new Date(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Bitiş</label>
                    <input 
                      type="date" 
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      value={format(dateRange.end, 'yyyy-MM-dd')}
                      onChange={(e) => setDateRange({...dateRange, end: new Date(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={handleDateRangeFilter}
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredReceipts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Uygun dekont bulunamadı.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dekont ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Toplam Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReceipts.map((receipt) => (
                    <tr key={receipt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(receipt.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {receipt.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(receipt.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          receipt.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receipt.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FileText className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Önceki
                  </button>
                  <span className="text-sm text-gray-700">
                    Toplam <span className="font-medium">{filteredReceipts.length}</span> dekont
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Sonraki
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Dekont Detay Modal */}
      {selectedReceipt && (
        <ReceiptDetailModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          receipt={selectedReceipt}
        />
      )}
    </div>
  );
} 