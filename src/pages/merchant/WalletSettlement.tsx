import { useState } from 'react';
import { Download } from 'lucide-react';

export default function WalletSettlement() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cüzdan Hakediş Tablosu</h1>
        <button
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Excel'e Aktar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <p>Merchant cüzdan hakediş detayları burada listelenecek</p>
        </div>
      </div>
    </div>
  );
}