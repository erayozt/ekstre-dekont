import React from 'react';

interface PdfFooterProps {
  statementId: string;
}

export default function PdfFooter({ statementId }: PdfFooterProps) {
  return (
    <div className="text-xs text-gray-500 mt-6 pt-4 border-t">
      <p>Bu ekstre, Hepsipay Ödeme Hizmetleri ve Elektronik Para A.Ş. tarafından düzenlenmiştir.</p>
      <p>Ekstre ile ilgili sorularınız için 0850 123 45 67 numaralı telefondan müşteri hizmetlerimize ulaşabilirsiniz.</p>
      <p>© {new Date().getFullYear()} Hepsipay Ödeme Hizmetleri ve Elektronik Para A.Ş. Tüm hakları saklıdır.</p>
      <p className="mt-2 text-right">Ekstre No: {statementId}</p>
    </div>
  );
} 