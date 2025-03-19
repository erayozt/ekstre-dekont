import React, { useState } from 'react';
import { X, Download, Printer, Share2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import hepsipayLogo from '../assets/hepsipay-logo.png';

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: any;
}

export default function ReceiptDetailModal({ isOpen, onClose, receipt }: ReceiptDetailModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  
  if (!isOpen || !receipt) {
    return null;
  }
  
  // Para birimini formatlama
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };
  
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: tr });
  };
  
  // Yazdırma işlemi
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };
  
  // İndirme işlemi (PDF olarak)
  const handleDownload = () => {
    console.log('Dekont indiriliyor:', receipt.id);
    // PDF indirme işlemi burada gerçekleştirilecek
  };
  
  // Hesaplamalar ve tutarlılık kontrolü
  const totalWalletVolume = receipt.walletTransactions.volume; // Cüzdan toplam hacmi
  const totalCommission = receipt.walletTransactions.commission; // Toplam komisyon
  
  // Net tutar hesaplaması (tutarlı olması için)
  const netAmount = totalWalletVolume - totalCommission; 
  
  // Eğer gelen veri ile hesaplanan net tutar uyuşmuyorsa, hesaplanan değeri kullan
  const displayNetAmount = netAmount !== receipt.walletTransactions.netAmount
    ? netAmount
    : receipt.walletTransactions.netAmount;
  
  // Alışveriş kredisi net tutar hesaplaması
  const creditVolume = receipt.creditTransactions.volume;
  const creditCommission = receipt.creditTransactions.commission;
  const creditNetAmount = creditVolume - creditCommission;
  
  // Eğer gelen veri ile hesaplanan net tutar uyuşmuyorsa, hesaplanan değeri kullan
  const displayCreditNetAmount = creditNetAmount !== receipt.creditTransactions.netAmount
    ? creditNetAmount
    : receipt.creditTransactions.netAmount;
  
  return (
    <>
      <div className={`fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm ${isPrinting ? 'print:hidden' : ''}`}>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative mx-auto max-w-3xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Ödeme Dekontu: {receipt.id}</h2>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="print:block" id="printableReceipt">
                {/* Dekont Başlık */}
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-10" />
                  </div>
                  <div className="text-right">
                    <h1 className="text-xl font-bold text-gray-800">ÖDEME DEKONTU</h1>
                    <p className="text-gray-600 text-sm">Dekont No: {receipt.id}</p>
                    <p className="text-gray-600 text-sm">Tarih: {formatDate(receipt.date)}</p>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Ödeme Bilgileri</h2>
                  <p className="text-gray-600 mb-1">{receipt.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Durum:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      receipt.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {receipt.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                    </span>
                  </div>
                </div>
                
                {/* Bilgi Notu */}
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Önemli Bilgi</p>
                    <p>Alışveriş kredisi işlemleri cüzdan işlemlerinin bir parçasıdır. Dekont üzerinde gösterilen alışveriş kredisi verileri, cüzdan işlemleri içindeki kredi işlemlerinin detayını gösterir. Toplam hacim hesaplamalarında alışveriş kredisi işlemleri ayrıca eklenmez.</p>
                  </div>
                </div>
                
                {/* Cüzdan İşlemleri */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b">Cüzdan İşlemleri</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">İşlem Adedi</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Toplam Tutar</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Komisyon</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Net Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap">{receipt.walletTransactions.count}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(receipt.walletTransactions.volume)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(receipt.walletTransactions.commission)}</td>
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{formatCurrency(displayNetAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {netAmount !== receipt.walletTransactions.netAmount && (
                    <p className="text-xs text-orange-600 mt-2 italic">
                      * Net tutar, toplam tutardan komisyon çıkarılarak yeniden hesaplanmıştır.
                    </p>
                  )}
                </div>
                
                {/* Alışveriş Kredisi İşlemleri (Cüzdan içindeki detay) */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-3 pb-2 border-b flex items-center">
                    <span>Alışveriş Kredisi İşlemleri</span>
                    <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">Cüzdan İçinde</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">İşlem Adedi</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Toplam Tutar</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Komisyon</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Net Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap">{receipt.creditTransactions.count}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(receipt.creditTransactions.volume)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatCurrency(receipt.creditTransactions.commission)}</td>
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{formatCurrency(displayCreditNetAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    * Yukarıdaki alışveriş kredisi işlemleri, cüzdan işlemlerinin bir alt kümesidir ve toplam tutara ayrıca eklenmez.
                  </p>
                </div>
                
                {/* Özet ve Açıklamalar */}
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Toplam İşlem Tutarı:</p>
                        <p className="text-lg font-semibold">{formatCurrency(totalWalletVolume)}</p>
                        <p className="text-xs text-gray-500 mt-1">Cüzdan üzerinden yapılan tüm ödemeler</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Hepsipay Komisyon Hakediş:</p>
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalCommission)}</p>
                        <p className="text-xs text-gray-500 mt-1">Toplam tutardan kesilen komisyon miktarı</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Net Ödenen Tutar:</span>
                        <span className="font-bold text-green-600">{formatCurrency(displayNetAmount)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Bu tutar, toplam işlem tutarından Hepsipay komisyon hakediş tutarı düşülerek hesaplanmıştır ve üye iş yerine ödenen net tutarı gösterir.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-8">
                  <p>Hepsipay Ödeme Hizmetleri ve Elektronik Para A.Ş.</p>
                  <p>Kuştepe Mah. Mecidiyeköy Yolu Cad. Trump Towers No:12 Kule:2 Kat:15 Şişli / İstanbul</p>
                  <p>Müşteri Hizmetleri: 0850 252 40 00</p>
                </div>
              </div>
            </div>
            
            {/* Footer Buttons */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between border-t border-gray-200">
              <div>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Kapat
                </button>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Yazdır
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  İndir
                </button>
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printableReceipt, #printableReceipt * {
            visibility: visible;
          }
          #printableReceipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
} 