import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import hepsipayLogo from '../assets/hepsipay-logo.png';

export const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  
  // Logo eklemek için özel bir başlık satırı oluşturma
  // Not: Excel'de doğrudan resim eklemek için daha karmaşık bir işlem gerekir
  // Bu basit bir metin başlığı ekler
  XLSX.utils.sheet_add_aoa(worksheet, [['Hepsipay Raporu']], { origin: 'A1' });
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapor');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};