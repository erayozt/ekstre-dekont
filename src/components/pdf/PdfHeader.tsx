import React from 'react';
import hepsipayLogo from '../../assets/hepsipay-logo.png';

interface PdfHeaderProps {
  period: string;
}

export default function PdfHeader({ period }: PdfHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-10" />
      </div>
      <div className="text-right">
        <h1 className="text-xl font-bold text-gray-800">ÜYE İŞYERİ EKSTRESİ</h1>
        <p className="text-sm text-gray-600">Dönem: {period}</p>
      </div>
    </div>
  );
} 