import { useState, useRef } from 'react';
import { X, Printer, Download, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import hepsipayLogo from '../assets/hepsipay-logo.png';

// Alt bileşenler
import PdfHeader from './pdf/PdfHeader';
import PdfSummarySection from './pdf/PdfSummarySection';
import PdfTransactionsSection from './pdf/PdfTransactionsSection';
import PdfMetricsSection from './pdf/PdfMetricsSection';
import PdfFooter from './pdf/PdfFooter';
import PdfDocument from './pdf/PdfDocument';

interface StatementPdfViewProps {
  isOpen: boolean;
  onClose: () => void;
  statement: any;
}

export default function StatementPdfView({ isOpen, onClose, statement }: StatementPdfViewProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen || !statement) {
    return null;
  }
  
  // Para birimini formatlama
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return "₺0,00";
    }
    return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
  };
  
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: tr });
  };
  
  // PDF indirme işlemi
  const handleDownload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Ekstre PDF olarak indirildi.');
    }, 1500);
  };
  
  // Yazdırma işlemi
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ekstre PDF Görünümü</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Kapat</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* PDF bileşeni - key ekleyerek yeniden render olmasını sağlayalım */}
        <div ref={pdfRef} key={Date.now()} className="bg-white rounded-lg shadow-xl max-w-5xl mx-auto">
          <PdfDocument statement={statement} formatCurrency={formatCurrency} />
        </div>
      </div>
    </div>
  );
}