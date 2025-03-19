import { X, CreditCard, ExternalLink, Download, FileText, ChevronDown, ChevronUp, CreditCard as CreditCardIcon, Wallet, DollarSign, Info } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import StatementPdfView from './StatementPdfView';
import PdfHeader from './pdf/PdfHeader';
import PdfFooter from './pdf/PdfFooter';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: any;
  onPayment?: (e: React.MouseEvent, statement: any) => void;
}

export default function StatementModal({ isOpen, onClose, statement, onPayment }: StatementModalProps) {
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);
  const [showDetailedSummary, setShowDetailedSummary] = useState(false);
  const [isPdfViewOpen, setIsPdfViewOpen] = useState(false);
  const [isTransactionsOnlyPdfOpen, setIsTransactionsOnlyPdfOpen] = useState(false);
  
  // Eksik olan 'openSections' state'ini ekleyelim
  const [openSections, setOpenSections] = useState<string[]>([]);
  
  // Modal açıkken konsola bilgi yazdıralım
  console.log("StatementModal render edildi:", { isOpen, statement });
  
  if (!isOpen || !statement) {
    console.log("Modal gösterilmiyor çünkü:", { isOpen, hasStatement: !!statement });
    return null;
  }
  
  // Paket detayları sayfasına yönlendirme
  const handleViewPackageDetails = () => {
    console.log('Paket detayları görüntüleniyor:', statement.merchant?.package);
  };
  
  // İşlem detaylarını göster/gizle
  const toggleTransactionDetails = () => {
    setShowTransactionDetails(!showTransactionDetails);
  };
  
  // Eksik olan toggleSection fonksiyonunu ekleyelim
  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
    
    // Eğer transactions bölümüyse, eski state'i de güncelle
    if (section === 'transactions') {
      setShowTransactionDetails(!showTransactionDetails);
    }
  };
  
  // PDF indirme işlemi - güncellendi
  const handleDownloadPdf = () => {
    console.log('PDF görüntüleniyor:', statement.id);
    setIsPdfViewOpen(true);
  };
  
  // Excel indirme işlemi
  const handleDownloadExcel = () => {
    console.log('Excel indiriliyor:', statement.id);
    // Excel indirme işlemi burada gerçekleştirilecek
  };
  
  // Ödeme işlemi
  const handlePayment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPayment) {
      onPayment(e, statement);
    }
  };
  
  // Para birimini formatlama
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };
  
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };
  
  // Ödeme durumu gösterimi
  const renderPaymentStatus = () => {
    const isPaid = statement.status === 'paid';
    const isPending = statement.status === 'pending';
    const isOverdue = statement.status === 'overdue' || statement.status === 'late';
    
    return (
      <div className="flex items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isPaid 
            ? 'bg-green-100 text-green-800' 
            : isPending 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
        }`}>
          {isPaid ? 'Ödendi' : isPending ? 'Bekliyor' : 'Gecikti'}
        </span>
        
        {/* Ödenmemiş ekstreler için ödeme butonu */}
        {(isPending || isOverdue) && onPayment && (
          <button
            onClick={handlePayment}
            className="ml-3 flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
          >
            <CreditCardIcon className="w-4 h-4 mr-1" />
            Şimdi Öde
          </button>
        )}
      </div>
    );
  };
  
  // Toplam komisyon tutarını hesapla (BSMV dahil)
  const calculateTotalCommission = () => {
    const storedCardCommission = statement.storedCardTransactions.commission;
    
    // İade komisyonlarını hesapla
    const refundCommission = 
      statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100;
    
    // Toplam komisyon (iadeler düşülmüş)
    const totalCommission = storedCardCommission - refundCommission;
    
    // BSMV ve diğer ücretleri ekle
    return totalCommission + statement.bsmvAmount + (statement.otherFees || 0);
  };
  
  // Detaylı özet göster/gizle
  const toggleDetailedSummary = () => {
    setShowDetailedSummary(!showDetailedSummary);
  };
  
  // İndirme butonu için fonksiyonu değiştirelim
  const showTransactionsOnlyPdf = (statement: any) => {
    console.log('Sadece işlem detayları PDF görüntüleniyor:', statement.id);
    setIsTransactionsOnlyPdfOpen(true);
  };
  
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative mx-auto max-w-5xl w-full rounded-xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Ekstre Detayları: {statement.id}</h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Üye İşyeri Bilgileri Kartı */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Üye İşyeri Bilgileri</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Üye İşyeri Adı</p>
                          <p className="font-medium">{statement.merchant.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Üye İşyeri No</p>
                          <p className="font-medium">{statement.merchant.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IBAN</p>
                          <p className="font-medium">{statement.merchant.iban}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ödeme Vadesi</p>
                          <p className="font-medium">{statement.merchant.paymentTerm}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Saklı Kart Komisyon Oranı</p>
                          <p className="font-medium">{statement.merchant.storedCardCommission}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Paket</p>
                          <div className="flex items-center">
                            <p className="font-medium mr-2">{statement.merchant.package}</p>
                            <button 
                              onClick={handleViewPackageDetails}
                              className="text-blue-600 hover:text-blue-800"
                              title="Paket Detayları"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ekstre Bilgileri Kartı */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Ekstre Bilgileri</h3>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Dönem</p>
                          <p className="font-medium">{statement.period}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ekstre Tarihi</p>
                          <p className="font-medium">{formatDate(statement.issueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Son Ödeme Tarihi</p>
                          <p className="font-medium">{formatDate(statement.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ödeme Durumu</p>
                          {renderPaymentStatus()}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Toplam İşlem Hacmi</p>
                          <p className="font-medium">{formatCurrency(statement.storedCardTransactions.volume)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ödenecek Komisyon</p>
                          <p className="font-medium text-blue-600">{formatCurrency(calculateTotalCommission())}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">BSMV</p>
                          <p className="font-medium">{formatCurrency(statement.bsmvAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Net İşlem Tutarı</p>
                          <p className="font-medium text-green-600">{formatCurrency(statement.storedCardTransactions.volume - calculateTotalCommission())}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* İşlem Özeti Kartı - Güncellendi */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">İşlem Özeti</h3>
                    <button 
                      onClick={toggleDetailedSummary}
                      className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                    >
                      {showDetailedSummary ? "Basit Görünüm" : "Detaylı Görünüm"}
                      {showDetailedSummary ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </button>
                  </div>
                  <div className="p-4">
                    {!showDetailedSummary ? (
                      // Basit Özet Görünümü
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem Tipi</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem Adedi</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Tutar</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komisyon</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BSMV</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Tutar</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* Saklı Kart İşlemleri */}
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span>Saklı Kart</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium">
                                {statement.storedCardTransactions.count.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-green-600">
                                {formatCurrency(statement.storedCardTransactions.volume)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600">
                                {formatCurrency(statement.storedCardTransactions.commission)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium">
                                {formatCurrency(statement.storedCardTransactions.commission * 0.05)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-green-600">
                                {formatCurrency(statement.storedCardTransactions.volume - statement.storedCardTransactions.commission - (statement.storedCardTransactions.commission * 0.05))}
                              </td>
                            </tr>
                            
                            {/* İade İşlemleri */}
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="bg-red-100 p-1 rounded-full mr-2">
                                    <CreditCard className="h-4 w-4 text-red-600" />
                                  </div>
                                  <span>İade</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium">
                                {(statement.storedCardTransactions.refundCount).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-red-600">
                                {formatCurrency(-(statement.storedCardTransactions.refundVolume))}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-red-600">
                                {formatCurrency(-(statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100))}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-red-600">
                                {formatCurrency(-((statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100) * 0.05))}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-medium text-red-600">
                                {formatCurrency(-(statement.storedCardTransactions.refundVolume) + 
                                  (statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100) + 
                                  ((statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100) * 0.05))}
                              </td>
                            </tr>
                            
                            {/* Toplam Satırı - Değiştirildi */}
                            <tr className="bg-gray-50 font-medium">
                              <td className="px-4 py-3 whitespace-nowrap font-semibold">Toplam</td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold">
                                {(statement.storedCardTransactions.count - statement.storedCardTransactions.refundCount).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold">
                                {formatCurrency(statement.storedCardTransactions.volume - statement.storedCardTransactions.refundVolume)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold text-blue-700">
                                {formatCurrency(statement.storedCardTransactions.commission - 
                                  (statement.storedCardTransactions.refundVolume * parseFloat(statement.merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100))}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold">
                                {formatCurrency(statement.bsmvAmount)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-700">
                                {formatCurrency((statement.storedCardTransactions.volume) - 
                                  (statement.storedCardTransactions.refundVolume) - 
                                  (statement.storedCardTransactions.commission) - 
                                  statement.bsmvAmount)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      // Detaylı Özet Görünümü
                      <div className="space-y-6">
                        {/* Genel Özet */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Genel Özet</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500">Toplam GMV</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(statement.storedCardTransactions.volume)}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500">Sipariş Sayısı</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {statement.storedCardTransactions.count.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500">Kullanıcı Sayısı</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {statement.userCount ? statement.userCount.toLocaleString() : "N/A"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500">Frekans</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {statement.frequency ? statement.frequency.toFixed(2) : "N/A"}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500">Ortalama Sepet</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(statement.storedCardTransactions.volume / (statement.storedCardTransactions.count || 1))}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Kart Formu Geçişleri */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Kart Formu Geçişleri</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-medium text-gray-600 mb-2">GMV</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Toplam</span>
                                  <span className="font-medium">{formatCurrency(statement.cardFormTransactions?.totalGMV || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">HPli</span>
                                  <span className="font-medium">{formatCurrency(statement.cardFormTransactions?.hpGMV || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">NonHPli</span>
                                  <span className="font-medium">{formatCurrency(statement.cardFormTransactions?.nonHpGMV || 0)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-gray-600 mb-2">İşlem Adedi</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Toplam</span>
                                  <span className="font-medium">{(statement.cardFormTransactions?.totalCount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">HPli</span>
                                  <span className="font-medium">{(statement.cardFormTransactions?.hpCount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">NonHPli</span>
                                  <span className="font-medium">{(statement.cardFormTransactions?.nonHpCount || 0).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* HP Ürünleri Geçişleri */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">HP Ürünleri Geçişleri</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-medium text-gray-600 mb-2">GMV</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Toplam</span>
                                  <span className="font-medium">{formatCurrency(statement.hpProductTransactions?.totalGMV || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Kayıtlı Kart</span>
                                  <span className="font-medium">{formatCurrency(statement.storedCardTransactions.volume)}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-gray-600 mb-2">İşlem Adedi</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Toplam</span>
                                  <span className="font-medium">{(statement.hpProductTransactions?.totalCount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">Kayıtlı Kart</span>
                                  <span className="font-medium">{statement.storedCardTransactions.count.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Diğer ücretler varsa göster */}
                    {statement.otherFees > 0 && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Diğer Ücretler:</span>
                          <span className="font-medium">{formatCurrency(statement.otherFees)}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Ödenecek toplam tutar */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Ödenecek Toplam Komisyon:</span>
                        <span className="text-blue-700">{formatCurrency(calculateTotalCommission())}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* İşlem Detayları Açılır Panel */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <button 
                    onClick={() => toggleSection('transactions')} 
                    className="w-full bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">İşlem Detayları</h3>
                    <div className="flex items-center gap-2">
                      {/* İndirme butonu */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Ana butonun tetiklenmesini engelle
                          // Sadece işlem detaylarını içeren PDF'i göster
                          showTransactionsOnlyPdf(statement);
                        }}
                        className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="İşlem Detaylarını Görüntüle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <line x1="10" y1="9" x2="8" y2="9"></line>
                        </svg>
                      </button>
                      {/* Mevcut ok ikonu */}
                      {openSections.includes('transactions') ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {showTransactionDetails && (
                    <div className="p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem ID</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komisyon</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Tutar</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {statement.transactionDetails
                              .filter((tx: any) => tx.type === 'storedCard' || tx.status === 'refunded')
                              .slice(0, 10)
                              .map((tx: any, index: number) => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{tx.id}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(tx.date)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {tx.status === 'refunded' ? (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">İade</span>
                                    ) : (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Saklı Kart</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                    {tx.status === 'refunded' ? (
                                      <span className="text-red-600">{formatCurrency(-tx.amount)}</span>
                                    ) : (
                                      <span className="text-green-600">{formatCurrency(tx.amount)}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatCurrency(tx.commission)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{formatCurrency(tx.netAmount)}</td>
                                </tr>
                              ))}
                            {statement.transactionDetails.filter((tx: any) => tx.type === 'storedCard' || tx.status === 'refunded').length > 10 && (
                              <tr>
                                <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-500">
                                  ... ve {statement.transactionDetails.filter((tx: any) => tx.type === 'storedCard' || tx.status === 'refunded').length - 10} işlem daha
                                </td>
                              </tr>
                            )}
                            {statement.transactionDetails.filter((tx: any) => tx.type === 'storedCard' || tx.status === 'refunded').length === 0 && (
                              <tr>
                                <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-500">
                                  İşlem bulunamadı
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* PDF Görüntüleme Bileşeni */}
      <StatementPdfView 
        isOpen={isPdfViewOpen} 
        onClose={() => setIsPdfViewOpen(false)} 
        statement={statement} 
      />
      
      {/* Sadece işlem detayları PDF'i */}
      {isTransactionsOnlyPdfOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-white">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">İşlem Detayları</h2>
              <button onClick={() => setIsTransactionsOnlyPdfOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl max-w-5xl mx-auto">
              <div className="p-8">
                {/* PDF Header bileşenini kullan */}
                <PdfHeader 
                  statementId={statement.id} 
                  merchantName={statement.merchant?.name} 
                  period={statement.period} 
                />
                
                {/* İşlem Detayları Tablosu - Cüzdan ve Alışveriş Kredisi filtrelendi */}
                <div className="my-6">
                  <h2 className="text-sm font-semibold text-gray-800 mb-3 border-b-2 border-indigo-500 pb-2">TÜM İŞLEMLER</h2>
                  <table className="min-w-full border border-gray-200 text-xs rounded-lg overflow-hidden">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">İşlem ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tarih</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tip</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Tutar</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Komisyon</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">BSMV</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider border-b">Net Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statement.transactionDetails && statement.transactionDetails
                        .filter((tx: any) => tx.type === 'storedCard' || tx.status === 'refunded')
                        .map((tx: any, index: number) => (
                          <tr key={tx.id} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">{tx.id}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                              {tx.date ? format(new Date(tx.date), 'dd.MM.yyyy', { locale: tr }) : '-'}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                              {tx.status === 'refunded' ? (
                                <span className="text-red-600">İade</span>
                              ) : (
                                <span className="text-green-600">Saklı Kart</span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                              <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                                {formatCurrency(tx.status === 'refunded' ? -tx.amount : tx.amount)}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                              <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                                {formatCurrency(tx.commission)}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b">
                              <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                                {formatCurrency(tx.bsmv || 0)}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs border-b font-medium">
                              <span className={tx.status === 'refunded' ? 'text-red-600' : ''}>
                                {formatCurrency(tx.netAmount)}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                {/* PDF Footer bileşenini kullan */}
                <PdfFooter statementId={statement.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}