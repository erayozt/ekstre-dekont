import { useState, useEffect } from 'react';
import { Download, ChevronDown, ChevronUp, Search, FileText, Calendar, CreditCard, Wallet, BarChart3, DollarSign, Building, RefreshCw, ArrowDownCircle, ArrowUpCircle, Filter, Eye, CreditCard as CreditCardIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import StatementModal from '../../components/StatementModal';
import mockDataService from '../../services/mockDataService';
import PaymentModal from '../../components/PaymentModal';
import StatementPdfView from '../../components/StatementPdfView';

// Örnek ekstre verileri - güncellenmiş
const sampleStatements = [
  {
    id: 'EKS-2023-12',
    period: 'Aralık 2023',
    issueDate: '2024-01-05',
    dueDate: '2024-01-15',
    totalAmount: 4250.75,
    status: 'paid',
    merchant: {
      id: 'M123456',
      name: 'ABC Ticaret Ltd. Şti.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      paymentTerm: 'Ertesi Gün Ödeme',
      type: 'SME',
      walletCommission: '%2,5',
      walletValor: '1 Gün',
      storedCardCommission: '%1,8',
      package: 'Premium E-Ticaret Paketi'
    },
    walletTransactions: {
      count: 1250,
      volume: 125000.00,
      commission: 3125.00,
      earnings: 121875.00,
      refundCount: 45,
      refundVolume: 4500.00
    },
    storedCardTransactions: {
      count: 850,
      volume: 85000.00,
      commission: 1062.50,
      earnings: 1062.50, // Saklı kart hakedişi = Saklı kart komisyonu
      refundCount: 28,
      refundVolume: 2800.00
    },
    bsmvAmount: 209.38,
    otherFees: 63.25,
    // Detaylı işlem listesi
    transactionDetails: [
      { 
        id: 'TRX-12345', 
        settlementId: 'STL-2023-12-01',
        date: '2023-12-01', 
        time: '14:35:22',
        type: 'wallet', 
        amount: 250.00, 
        commission: 6.25,
        bsmv: 0.31,
        netAmount: 243.44,
        status: 'completed', 
        description: 'Cüzdan Ödemesi' 
      },
      { 
        id: 'TRX-12346', 
        settlementId: 'STL-2023-12-01',
        date: '2023-12-01', 
        time: '15:12:45',
        type: 'storedCard', 
        amount: 175.50, 
        commission: 4.39,
        bsmv: 0.22,
        netAmount: 170.89,
        status: 'completed', 
        description: 'Saklı Kart Ödemesi' 
      },
      { 
        id: 'TRX-12347', 
        settlementId: 'STL-2023-12-02',
        date: '2023-12-02', 
        time: '09:23:11',
        type: 'wallet', 
        amount: 320.00, 
        commission: 8.00,
        bsmv: 0.40,
        netAmount: 311.60,
        status: 'completed', 
        description: 'Cüzdan Ödemesi' 
      },
      { 
        id: 'TRX-12348', 
        settlementId: 'STL-2023-12-02',
        date: '2023-12-02', 
        time: '10:45:33',
        type: 'storedCard', 
        amount: 89.90, 
        commission: 2.25,
        bsmv: 0.11,
        netAmount: 87.54,
        status: 'completed', 
        description: 'Saklı Kart Ödemesi' 
      },
      { 
        id: 'TRX-12349', 
        settlementId: 'STL-2023-12-03',
        date: '2023-12-03', 
        time: '11:17:42',
        type: 'wallet', 
        amount: 150.00, 
        commission: 3.75,
        bsmv: 0.19,
        netAmount: 146.06,
        status: 'refunded', 
        description: 'Cüzdan İadesi' 
      },
      { 
        id: 'TRX-12350', 
        settlementId: 'STL-2023-12-03',
        date: '2023-12-03', 
        time: '13:28:55',
        type: 'storedCard', 
        amount: 75.50, 
        commission: 1.89,
        bsmv: 0.09,
        netAmount: 73.52,
        status: 'refunded', 
        description: 'Saklı Kart İadesi' 
      }
    ]
  },
  {
    id: 'EKS-2023-11',
    period: 'Kasım 2023',
    issueDate: '2023-12-05',
    dueDate: '2023-12-15',
    totalAmount: 3875.50,
    status: 'paid',
    merchant: {
      id: 'M123456',
      name: 'ABC Ticaret Ltd. Şti.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      paymentTerm: 'Ertesi Gün Ödeme',
      type: 'KA',
      walletCommission: '%2,5',
      walletValor: '1 Gün',
      storedCardCommission: '%1,8',
      package: 'Premium E-Ticaret Paketi'
    },
    walletTransactions: {
      count: 1150,
      volume: 115000.00,
      commission: 2875.00,
      earnings: 112125.00,
      refundCount: 38,
      refundVolume: 3800.00
    },
    storedCardTransactions: {
      count: 800,
      volume: 80000.00,
      commission: 1000.00,
      earnings: 1000.00, // Saklı kart hakedişi = Saklı kart komisyonu
      refundCount: 25,
      refundVolume: 2500.00
    },
    bsmvAmount: 193.75,
    otherFees: 0.50,
    transactionDetails: [
      { 
        id: 'TRX-11345', 
        settlementId: 'STL-2023-11-01',
        date: '2023-11-01', 
        time: '10:15:22',
        type: 'wallet', 
        amount: 320.50, 
        commission: 8.01,
        bsmv: 0.40,
        netAmount: 312.09,
        status: 'completed', 
        description: 'Cüzdan Ödemesi' 
      },
      { 
        id: 'TRX-11346', 
        settlementId: 'STL-2023-11-01',
        date: '2023-11-01', 
        time: '11:22:45',
        type: 'storedCard', 
        amount: 145.75, 
        commission: 3.64,
        bsmv: 0.18,
        netAmount: 141.93,
        status: 'completed', 
        description: 'Saklı Kart Ödemesi' 
      }
    ]
  },
  {
    id: 'EKS-2023-10',
    period: 'Ekim 2023',
    issueDate: '2023-11-05',
    dueDate: '2023-11-15',
    totalAmount: 4125.25,
    status: 'pending',
    merchant: {
      id: 'M123456',
      name: 'ABC Ticaret Ltd. Şti.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      paymentTerm: 'Ertesi Gün Ödeme',
      type: 'SME',
      walletCommission: '%2,5',
      walletValor: '1 Gün',
      storedCardCommission: '%1,8',
      package: 'Premium E-Ticaret Paketi'
    },
    walletTransactions: {
      count: 1200,
      volume: 120000.00,
      commission: 3000.00,
      earnings: 117000.00,
      refundCount: 42,
      refundVolume: 4200.00
    },
    storedCardTransactions: {
      count: 900,
      volume: 90000.00,
      commission: 1125.00,
      earnings: 1125.00, // Saklı kart hakedişi = Saklı kart komisyonu
      refundCount: 30,
      refundVolume: 3000.00
    },
    bsmvAmount: 206.25,
    otherFees: 0.25,
    transactionDetails: [
      { 
        id: 'TRX-10345', 
        settlementId: 'STL-2023-10-01',
        date: '2023-10-01', 
        time: '09:45:22',
        type: 'storedCard', 
        amount: 189.90, 
        commission: 4.75,
        bsmv: 0.24,
        netAmount: 184.91,
        status: 'completed', 
        description: 'Saklı Kart Ödemesi' 
      },
      { 
        id: 'TRX-10346', 
        settlementId: 'STL-2023-10-01',
        date: '2023-10-01', 
        time: '16:18:45',
        type: 'wallet', 
        amount: 420.00, 
        commission: 10.50,
        bsmv: 0.53,
        netAmount: 408.97,
        status: 'completed', 
        description: 'Cüzdan Ödemesi' 
      }
    ]
  },
  {
    id: 'EKS-2023-09',
    period: 'Eylül 2023',
    issueDate: '2023-10-05',
    dueDate: '2023-10-15',
    totalAmount: 3950.80,
    status: 'late',
    merchant: {
      id: 'M123456',
      name: 'ABC Ticaret Ltd. Şti.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      paymentTerm: 'Ertesi Gün Ödeme',
      type: 'KA',
      walletCommission: '%2,5',
      walletValor: '1 Gün',
      storedCardCommission: '%1,8',
      package: 'Premium E-Ticaret Paketi'
    },
    walletTransactions: {
      count: 1180,
      volume: 118000.00,
      commission: 2950.00,
      earnings: 115050.00
    },
    storedCardTransactions: {
      count: 820,
      volume: 82000.00,
      commission: 1025.00,
      earnings: 80975.00
    },
    bsmvAmount: 198.75,
    otherFees: 24.95
  },
  {
    id: 'EKS-2023-08',
    period: 'Ağustos 2023',
    issueDate: '2023-09-05',
    dueDate: '2023-09-15',
    totalAmount: 4350.60,
    status: 'paid',
    merchant: {
      id: 'M123456',
      name: 'ABC Ticaret Ltd. Şti.',
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      paymentTerm: 'Ertesi Gün Ödeme',
      type: 'SME',
      walletCommission: '%2,5',
      walletValor: '1 Gün',
      storedCardCommission: '%1,8',
      package: 'Premium E-Ticaret Paketi'
    },
    walletTransactions: {
      count: 1300,
      volume: 130000.00,
      commission: 3250.00,
      earnings: 126750.00
    },
    storedCardTransactions: {
      count: 880,
      volume: 88000.00,
      commission: 1100.00,
      earnings: 86900.00
    },
    bsmvAmount: 217.50,
    otherFees: 0.90
  }
];

export const downloadTransactions = (statement: any) => {
  // İşlem verilerini hazırla
  const transactions = statement.transactionDetails || [];
  
  if (transactions.length === 0) {
    toast.error('İndirilecek işlem bulunamadı');
    return;
  }
  
  // CSV içeriğini oluştur
  const headers = ['İşlem ID', 'Tarih', 'Tip', 'Tutar', 'Komisyon', 'BSMV', 'Net Tutar'];
  const csvRows = [headers];
  
  // İşlemleri CSV satırlarına dönüştür
  transactions.forEach((tx: any) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '-';
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
    };
    
    // İşlem tipini belirle
    let txType = 'Cüzdan';
    if (tx.status === 'refunded') {
      txType = 'İade';
    } else if (tx.type === 'storedCard') {
      txType = 'Saklı Kart';
    } else if (tx.type === 'credit') {
      txType = 'Alışveriş Kredisi';
    }
    
    // Para birimini formatla
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    };
    
    const row = [
      tx.id,
      formatDate(tx.date),
      txType,
      formatCurrency(tx.status === 'refunded' ? -tx.amount : tx.amount),
      formatCurrency(tx.commission),
      formatCurrency(tx.bsmv || 0),
      formatCurrency(tx.netAmount)
    ];
    
    csvRows.push(row);
  });
  
  // CSV formatına dönüştür
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  
  // CSV'yi indir
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Dosya adını belirleme
  const fileName = `islem-detaylari-${statement.id || 'ekstre'}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success('İşlemler başarıyla indirildi');
};

export default function Statements() {
  const [statements, setStatements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatement, setPaymentStatement] = useState<any>(null);
  const [isPdfViewOpen, setIsPdfViewOpen] = useState(false);
  const [pdfStatement, setPdfStatement] = useState<any>(null);
  
  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    // Simüle edilmiş veri yükleme
    setTimeout(() => {
      try {
        // mockDataService'den veri almayı deneyelim
        let data;
        try {
          data = mockDataService.getMerchantStatements('M123456');
          console.log("mockDataService'den alınan veriler:", data);
        } catch (error) {
          console.error("mockDataService hatası:", error);
          // Eğer mockDataService çalışmazsa, örnek verileri kullanalım
          data = sampleStatements;
          console.log("Örnek veriler kullanılıyor:", data);
        }
        
        // Veri boş mu kontrol edelim
        if (!data || data.length === 0) {
          console.log("Veri bulunamadı, örnek veriler kullanılıyor");
          data = sampleStatements;
        }
        
        setStatements(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        toast.error("Veriler yüklenirken bir hata oluştu.");
        // Hata durumunda da örnek verileri kullanalım
        setStatements(sampleStatements);
        setIsLoading(false);
      }
    }, 1000);
  }, []);
  
  // İndirme işlemi - güncellendi
  const handleDownload = (statementId: string) => {
    setIsDownloading(true);
    
    try {
      // Ekstre verisini bul
      const statement = statements.find(s => s.id === statementId);
      if (statement) {
        setPdfStatement(statement);
        setIsPdfViewOpen(true);
      } else {
        toast.error("Ekstre bulunamadı.");
      }
    } catch (error) {
      console.error("PDF indirme hatası:", error);
      toast.error("PDF indirme sırasında bir hata oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Excel indirme işlemi
  const handleExcelDownload = (statementId: string) => {
    setIsDownloading(true);
    
    try {
      // Simüle edilmiş Excel indirme işlemi
      setTimeout(() => {
        toast.success(`${statementId} numaralı ekstre Excel olarak indirildi.`);
        setIsDownloading(false);
      }, 1500);
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      toast.error("Excel indirme sırasında bir hata oluştu.");
      setIsDownloading(false);
    }
  };
  
  // Modal açma işlemi
  const openModal = (statement: any) => {
    console.log("Modal açılıyor, statement:", statement);
    
    // Veri yapısını kontrol et ve eksik alanları tamamla
    if (statement) {
      // Eksik alanları varsayılan değerlerle doldur
      if (!statement.transactionDetails) {
        statement.transactionDetails = [];
      }
      
      setSelectedStatement(statement);
      setIsModalOpen(true);
    }
  };
  
  // Modal kapatma işlemi
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStatement(null);
  };
  
  // Ödeme işlemi başlatma
  const handlePayment = (e: React.MouseEvent, statement: any) => {
    e.stopPropagation();
    setPaymentStatement(statement);
    setIsPaymentModalOpen(true);
  };
  
  // Ödeme modalını kapatma
  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentStatement(null);
  };
  
  // Filtreleme işlemi
  const filteredStatements = statements.filter(statement => {
    console.log("Filtreleniyor:", statement);
    
    // Durum filtresi
    if (statusFilter !== 'all' && statement.status !== statusFilter) {
      return false;
    }
    
    // İşlem tipi filtresi
    if (transactionFilter === 'wallet' && statement.walletTransactions.count === 0) {
      return false;
    } else if (transactionFilter === 'storedCard' && statement.storedCardTransactions.count === 0) {
      return false;
    }
    
    // Arama filtresi
    if (searchTerm && !statement.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !statement.period.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !statement.merchant.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  console.log("Filtrelenmiş ekstreler:", filteredStatements);
  
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
  };
  
  // Para birimi formatlama
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ekstreler</h1>
      
      {/* Filtreler */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Arama */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Ekstre ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Durum Filtresi */}
          <div className="w-full sm:w-auto">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekleyen</option>
              <option value="paid">Ödendi</option>
              <option value="overdue">Gecikmiş</option>
              <option value="late">Geç Ödeme</option>
            </select>
          </div>
          
          {/* İşlem Tipi Filtresi */}
          <div className="w-full sm:w-auto">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
            >
              <option value="all">Tüm İşlemler</option>
              <option value="wallet">Cüzdan İşlemleri</option>
              <option value="storedCard">Saklı Kart İşlemleri</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Ekstreler Tablosu */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ekstre No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dönem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ekstre Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Ödeme Tarihi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Ekstreler yükleniyor...
                  </div>
                </td>
              </tr>
            ) : filteredStatements.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Filtrelere uygun ekstre bulunamadı.
                </td>
              </tr>
            ) : (
              filteredStatements.map((statement) => (
                <tr 
                  key={statement.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openModal(statement)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{statement.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{statement.period}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(statement.issueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(statement.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(statement.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statement.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : statement.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {statement.status === 'paid' ? 'Ödendi' : statement.status === 'pending' ? 'Bekliyor' : 'Gecikti'}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {(statement.status === 'pending' || statement.status === 'overdue' || statement.status === 'late') && (
                        <button
                          onClick={(e) => handlePayment(e, statement)}
                          className="flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={isDownloading}
                        >
                          <CreditCardIcon className="w-4 h-4 mr-1" />
                          Öde
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(statement.id);
                        }}
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isDownloading}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        İndir
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExcelDownload(statement.id);
                        }}
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isDownloading}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Excel
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(statement);
                        }}
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isDownloading}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Görüntüle
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* StatementModal bileşenini çağırıyoruz */}
      {selectedStatement && (
        <StatementModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          statement={selectedStatement}
          onPayment={handlePayment}
        />
      )}
      
      {/* Ödeme Modalı */}
      {paymentStatement && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
          statement={paymentStatement}
        />
      )}
      
      {/* PDF Görüntüleme Bileşeni */}
      <StatementPdfView 
        isOpen={isPdfViewOpen} 
        onClose={() => setIsPdfViewOpen(false)} 
        statement={pdfStatement} 
      />
    </div>
  );
}