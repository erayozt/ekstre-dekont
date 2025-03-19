import { useState } from 'react';
import { X, CreditCard, Check, Shield, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import hepsipayLogo from '../assets/hepsipay-logo.png';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: any;
}

export default function PaymentModal({ isOpen, onClose, statement }: PaymentModalProps) {
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen || !statement) {
    return null;
  }
  
  // Kart numarası formatı
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Son kullanma tarihi formatı
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Ödeme işlemi
  const handlePayment = () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      toast.error('Lütfen tüm kart bilgilerini doldurun.');
      return;
    }
    
    setIsProcessing(true);
    
    // Simüle edilmiş ödeme işlemi
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2); // Başarılı ödeme ekranına geç
    }, 2000);
  };
  
  // Ödeme tamamlandı
  const handleComplete = () => {
    toast.success('Ödeme başarıyla tamamlandı!');
    onClose();
  };
  
  // Para birimini formatlama
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative mx-auto max-w-lg w-full rounded-xl bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-8 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Hepsipay Checkout</h2>
                <p className="text-sm text-blue-100">Güvenli Ödeme</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-blue-700 transition-colors"
              title="Kapat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {step === 1 ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödeme Detayları</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Ekstre No:</span>
                    <span className="font-medium">{statement.id}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Dönem:</span>
                    <span className="font-medium">{statement.period}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Son Ödeme Tarihi:</span>
                    <span className="font-medium">{format(new Date(statement.dueDate), 'dd MMMM yyyy', { locale: tr })}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Toplam Tutar:</span>
                    <span className="text-blue-700">{formatCurrency(statement.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kart Bilgileri</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      />
                      <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                      Kart Üzerindeki İsim
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ad Soyad"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Son Kullanma Tarihi
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="AA/YY"
                        maxLength={5}
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                    />
                    <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                      Kartımı gelecekteki ödemeler için kaydet
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Lock className="h-4 w-4 mr-1" />
                  <span>256-bit SSL ile güvenli ödeme</span>
                </div>
                <div className="flex space-x-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6" />
                </div>
              </div>
              
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? 'İşleniyor...' : `${formatCurrency(statement.totalAmount)} Öde`}
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ödeme Başarılı!</h3>
              <p className="text-gray-600 mb-6">
                {statement.id} numaralı ekstre ödemesi başarıyla tamamlandı.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">İşlem Numarası:</span>
                  <span className="font-medium">TRX-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Ödeme Tarihi:</span>
                  <span className="font-medium">{format(new Date(), 'dd MMMM yyyy HH:mm', { locale: tr })}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Ödenen Tutar:</span>
                  <span className="text-green-700">{formatCurrency(statement.totalAmount)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-600 mb-6">
                <Shield className="h-4 w-4 mr-1" />
                <span>Ödeme makbuzunuz e-posta adresinize gönderildi.</span>
              </div>
              
              <button
                onClick={handleComplete}
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
              >
                Tamam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 