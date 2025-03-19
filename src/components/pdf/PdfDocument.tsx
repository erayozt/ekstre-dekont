import React from 'react';
import PdfHeader from './PdfHeader';
import PdfSummarySection from './PdfSummarySection';
import PdfTransactionDetailsSection from './PdfTransactionDetailsSection';
import PdfMetricsSection from './PdfMetricsSection';
import PdfFooter from './PdfFooter';

interface PdfDocumentProps {
  statement: any;
  formatCurrency: (amount: number | undefined) => string;
}

export default function PdfDocument({ statement, formatCurrency }: PdfDocumentProps) {
  return (
    <div className="p-8">
      {/* PDF Header */}
      <PdfHeader 
        statementId={statement.id} 
        merchantName={statement.merchant?.name} 
        period={statement.period} 
      />
      
      {/* Özet Bilgiler */}
      <PdfSummarySection statement={statement} formatCurrency={formatCurrency} />
      
      {/* İşlem Detayları Bölümü */}
      <PdfTransactionDetailsSection statement={statement} formatCurrency={formatCurrency} />
      
      {/* Geçiş Metrikleri */}
      <PdfMetricsSection statement={statement} formatCurrency={formatCurrency} />

      {/* Footer */}
      <PdfFooter statementId={statement.id} />
    </div>
  );
} 