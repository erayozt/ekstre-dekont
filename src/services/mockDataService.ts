import { format, subDays, subMonths, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Ay adını getiren yardımcı fonksiyon
const getMonthName = (month: number): string => {
  const date = new Date(2023, month - 1, 1);
  return format(date, 'MMMM', { locale: tr });
};

// Merchant listesi
const merchants = [
  {
    id: 'M1001',
    name: 'ABC Elektronik Ltd. Şti.',
    title: 'ABC Elektronik Ticaret A.Ş.',
    type: 'KA', // Kurumsal
    iban: 'TR12 3456 7890 1234 5678 9012 34',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,5',
    walletValor: '1 Gün',
    storedCardCommission: '%1,8',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-01-15',
    email: 'finans@abcelektronik.com',
    phone: '+90 212 555 1234',
    address: 'Maslak Mah. Büyükdere Cad. No:123 Sarıyer/İstanbul'
  },
  {
    id: 'M1002',
    name: 'Moda Butik A.Ş.',
    title: 'Moda Butik Tekstil A.Ş.',
    type: 'KA',
    iban: 'TR98 7654 3210 9876 5432 1098 76',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,8',
    walletValor: '1 Gün',
    storedCardCommission: '%2,0',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-02-20',
    email: 'muhasebe@modabutik.com',
    phone: '+90 212 555 5678',
    address: 'Nişantaşı Mah. Teşvikiye Cad. No:45 Şişli/İstanbul'
  },
  {
    id: 'M1003',
    name: 'Kitap Dünyası',
    title: 'Kitap Dünyası Yayıncılık Ltd. Şti.',
    type: 'SME', // KOBİ
    iban: 'TR45 6789 0123 4567 8901 2345 67',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,0',
    walletValor: '2 Gün',
    storedCardCommission: '%2,2',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-03-10',
    email: 'info@kitapdunyasi.com',
    phone: '+90 216 555 9012',
    address: 'Bağdat Cad. No:78 Kadıköy/İstanbul'
  },
  {
    id: 'M1004',
    name: 'Spor Malzemeleri A.Ş.',
    title: 'Spor Malzemeleri Ticaret A.Ş.',
    type: 'KA',
    iban: 'TR32 1098 7654 3210 9876 5432 10',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,6',
    walletValor: '1 Gün',
    storedCardCommission: '%1,9',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-04-05',
    email: 'finans@spormalzemeleri.com',
    phone: '+90 212 555 3456',
    address: 'Levent Mah. Büyükdere Cad. No:189 Beşiktaş/İstanbul'
  },
  {
    id: 'M1005',
    name: 'Organik Market',
    title: 'Organik Gıda Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR76 5432 1098 7654 3210 9876 54',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,2',
    walletValor: '2 Gün',
    storedCardCommission: '%2,4',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-05-15',
    email: 'muhasebe@organikmarket.com',
    phone: '+90 216 555 7890',
    address: 'Acıbadem Mah. Çeçen Sok. No:25 Üsküdar/İstanbul'
  },
  {
    id: 'M1006',
    name: 'Teknoloji Merkezi',
    title: 'Teknoloji Merkezi Bilişim A.Ş.',
    type: 'KA',
    iban: 'TR21 0987 6543 2109 8765 4321 09',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,4',
    walletValor: '1 Gün',
    storedCardCommission: '%1,7',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-06-20',
    email: 'finans@teknolojimarkezi.com',
    phone: '+90 212 555 2345',
    address: 'Esentepe Mah. Büyükdere Cad. No:201 Şişli/İstanbul'
  },
  {
    id: 'M1007',
    name: 'Bebek Ürünleri',
    title: 'Bebek Ürünleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR65 4321 0987 6543 2109 8765 43',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,1',
    walletValor: '2 Gün',
    storedCardCommission: '%2,3',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-07-10',
    email: 'info@bebekurunleri.com',
    phone: '+90 216 555 6789',
    address: 'Kozyatağı Mah. Değirmen Sok. No:18 Kadıköy/İstanbul'
  },
  {
    id: 'M1008',
    name: 'Mobilya Dünyası',
    title: 'Mobilya Dünyası Ticaret A.Ş.',
    type: 'KA',
    iban: 'TR10 9876 5432 1098 7654 3210 98',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,7',
    walletValor: '1 Gün',
    storedCardCommission: '%2,0',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-08-15',
    email: 'finans@mobilyadunyasi.com',
    phone: '+90 212 555 8901',
    address: 'Mecidiyeköy Mah. Büyükdere Cad. No:85 Şişli/İstanbul'
  },
  {
    id: 'M1009',
    name: 'Kozmetik Mağazası',
    title: 'Kozmetik Ürünleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR54 3210 9876 5432 1098 7654 32',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,3',
    walletValor: '2 Gün',
    storedCardCommission: '%2,5',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-09-20',
    email: 'muhasebe@kozmetikmağazasi.com',
    phone: '+90 216 555 4567',
    address: 'Caddebostan Mah. Bağdat Cad. No:223 Kadıköy/İstanbul'
  },
  {
    id: 'M1010',
    name: 'Oyuncak Dükkanı',
    title: 'Oyuncak Dükkanı Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR43 2109 8765 4321 0987 6543 21',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,0',
    walletValor: '2 Gün',
    storedCardCommission: '%2,2',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-10-10',
    email: 'info@oyuncakdukkani.com',
    phone: '+90 216 555 2345',
    address: 'Ataşehir Mah. Atatürk Cad. No:56 Ataşehir/İstanbul'
  },
  // 10 merchant daha ekleyelim
  {
    id: 'M1011',
    name: 'Ev Dekorasyon',
    title: 'Ev Dekorasyon Ürünleri A.Ş.',
    type: 'KA',
    iban: 'TR32 1098 7654 3210 9876 5432 11',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,5',
    walletValor: '1 Gün',
    storedCardCommission: '%1,8',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2022-11-15',
    email: 'finans@evdekorasyon.com',
    phone: '+90 212 555 6789',
    address: 'Etiler Mah. Nispetiye Cad. No:102 Beşiktaş/İstanbul'
  },
  {
    id: 'M1012',
    name: 'Spor Giyim',
    title: 'Spor Giyim Tekstil Ltd. Şti.',
    type: 'SME',
    iban: 'TR76 5432 1098 7654 3210 9876 55',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,2',
    walletValor: '2 Gün',
    storedCardCommission: '%2,4',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2022-12-20',
    email: 'muhasebe@sporgiyim.com',
    phone: '+90 216 555 9012',
    address: 'Fenerbahçe Mah. Bağdat Cad. No:112 Kadıköy/İstanbul'
  },
  {
    id: 'M1013',
    name: 'Bilgisayar Dünyası',
    title: 'Bilgisayar Dünyası Bilişim A.Ş.',
    type: 'KA',
    iban: 'TR21 0987 6543 2109 8765 4321 10',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,6',
    walletValor: '1 Gün',
    storedCardCommission: '%1,9',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2023-01-10',
    email: 'finans@bilgisayardunyasi.com',
    phone: '+90 212 555 3456',
    address: 'Gayrettepe Mah. Büyükdere Cad. No:125 Beşiktaş/İstanbul'
  },
  {
    id: 'M1014',
    name: 'Mutfak Gereçleri',
    title: 'Mutfak Gereçleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR65 4321 0987 6543 2109 8765 44',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,1',
    walletValor: '2 Gün',
    storedCardCommission: '%2,3',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2023-02-15',
    email: 'info@mutfakgerecleri.com',
    phone: '+90 216 555 7890',
    address: 'Suadiye Mah. Bağdat Cad. No:345 Kadıköy/İstanbul'
  },
  {
    id: 'M1015',
    name: 'Bahçe Market',
    title: 'Bahçe Market Peyzaj Ltd. Şti.',
    type: 'SME',
    iban: 'TR10 9876 5432 1098 7654 3210 99',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,0',
    walletValor: '2 Gün',
    storedCardCommission: '%2,2',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2023-03-20',
    email: 'muhasebe@bahcemarket.com',
    phone: '+90 216 555 2345',
    address: 'Çekmeköy Mah. Atatürk Cad. No:67 Çekmeköy/İstanbul'
  },
  {
    id: 'M1016',
    name: 'Ofis Malzemeleri',
    title: 'Ofis Malzemeleri Ticaret A.Ş.',
    type: 'KA',
    iban: 'TR54 3210 9876 5432 1098 7654 33',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,7',
    walletValor: '1 Gün',
    storedCardCommission: '%2,0',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2023-04-10',
    email: 'finans@ofismalzemeleri.com',
    phone: '+90 212 555 8901',
    address: 'Maslak Mah. Büyükdere Cad. No:255 Sarıyer/İstanbul'
  },
  {
    id: 'M1017',
    name: 'Sağlık Ürünleri',
    title: 'Sağlık Ürünleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR43 2109 8765 4321 0987 6543 22',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,3',
    walletValor: '2 Gün',
    storedCardCommission: '%2,5',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2023-05-15',
    email: 'info@saglikurunleri.com',
    phone: '+90 216 555 4567',
    address: 'Ümraniye Mah. Alemdağ Cad. No:123 Ümraniye/İstanbul'
  },
  {
    id: 'M1018',
    name: 'Hobi Malzemeleri',
    title: 'Hobi Malzemeleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR32 1098 7654 3210 9876 5432 12',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,0',
    walletValor: '2 Gün',
    storedCardCommission: '%2,2',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2023-06-20',
    email: 'muhasebe@hobimalzemeleri.com',
    phone: '+90 216 555 6789',
    address: 'Maltepe Mah. Bağdat Cad. No:78 Maltepe/İstanbul'
  },
  {
    id: 'M1019',
    name: 'Gıda Market',
    title: 'Gıda Market Ticaret A.Ş.',
    type: 'KA',
    iban: 'TR76 5432 1098 7654 3210 9876 56',
    paymentTerm: 'Ertesi Gün Ödeme',
    walletCommission: '%2,5',
    walletValor: '1 Gün',
    storedCardCommission: '%1,8',
    package: 'Premium E-Ticaret Paketi',
    packageId: 'PKG001',
    status: 'active',
    createdAt: '2023-07-10',
    email: 'finans@gidamarket.com',
    phone: '+90 212 555 9012',
    address: 'Beşiktaş Mah. Barbaros Bulvarı No:45 Beşiktaş/İstanbul'
  },
  {
    id: 'M1020',
    name: 'Evcil Hayvan Ürünleri',
    title: 'Evcil Hayvan Ürünleri Ticaret Ltd. Şti.',
    type: 'SME',
    iban: 'TR21 0987 6543 2109 8765 4321 11',
    paymentTerm: '2 Gün Valörlü Ödeme',
    walletCommission: '%3,2',
    walletValor: '2 Gün',
    storedCardCommission: '%2,4',
    package: 'Standart E-Ticaret Paketi',
    packageId: 'PKG002',
    status: 'active',
    createdAt: '2023-08-15',
    email: 'info@evcilhayvanmarket.com',
    phone: '+90 216 555 3456',
    address: 'Kartal Mah. Ankara Cad. No:56 Kartal/İstanbul'
  }
];

// Paket bilgileri
const packages = [
  {
    id: 'PKG001',
    name: 'Premium E-Ticaret Paketi',
    price: 2500,
    description: 'Büyük işletmeler için gelişmiş e-ticaret çözümü',
    features: [
      'Sınırsız ürün',
      'Gelişmiş analitik',
      '7/24 destek',
      'Özel entegrasyonlar',
      'Düşük komisyon oranları'
    ],
    validityPeriod: '12 ay'
  },
  {
    id: 'PKG002',
    name: 'Standart E-Ticaret Paketi',
    price: 1200,
    description: 'KOBİ\'ler için uygun fiyatlı e-ticaret çözümü',
    features: [
      '10.000 ürün',
      'Temel analitik',
      'E-posta desteği',
      'Standart entegrasyonlar',
      'Standart komisyon oranları'
    ],
    validityPeriod: '12 ay'
  },
  {
    id: 'PKG003',
    name: 'Başlangıç E-Ticaret Paketi',
    price: 600,
    description: 'Yeni başlayan işletmeler için ekonomik çözüm',
    features: [
      '1.000 ürün',
      'Temel raporlama',
      'Sınırlı destek',
      'Temel entegrasyonlar',
      'Standart komisyon oranları'
    ],
    validityPeriod: '6 ay'
  }
];

// Ekstre oluşturma fonksiyonu
const generateStatements = () => {
  const statements: any[] = [];
  const today = new Date();
  
  // Örnek ekstreler oluşturalım
  statements.push({
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
      earnings: 1062.50,
      refundCount: 28,
      refundVolume: 2800.00
    },
    bsmvAmount: 209.38,
    otherFees: 63.25,
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
      }
    ]
  });
  
  statements.push({
    id: 'EKS-2023-11',
    period: 'Kasım 2023',
    issueDate: '2023-12-05',
    dueDate: '2023-12-15',
    totalAmount: 3850.25,
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
      refundCount: 40,
      refundVolume: 4000.00
    },
    storedCardTransactions: {
      count: 800,
      volume: 80000.00,
      commission: 1000.00,
      earnings: 79000.00,
      refundCount: 25,
      refundVolume: 2500.00
    },
    bsmvAmount: 200.00,
    otherFees: 50.25,
    transactionDetails: []
  });
  
  return statements;
};

// Cüzdan hakedişleri oluşturma fonksiyonu
const generateWalletSettlements = () => {
  const settlements: any[] = [];
  const today = new Date();
  
  // Son 30 gün için günlük hakediş verileri oluştur
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Her gün için rastgele 3-8 merchant seç
    const merchantCount = Math.floor(Math.random() * 6) + 3;
    const selectedMerchants = [...merchants].sort(() => 0.5 - Math.random()).slice(0, merchantCount);
    
    selectedMerchants.forEach(merchant => {
      // Rastgele işlem sayıları ve tutarları
      const paymentCount = Math.floor(Math.random() * 100) + 20;
      const paymentAmount = Math.random() * 20000 + 2000;
      const refundCount = Math.floor(Math.random() * 10);
      const refundAmount = Math.random() * paymentAmount * 0.1;
      const netAmount = paymentAmount - refundAmount;
      
      // Komisyon hesaplamaları
      const commissionRate = parseFloat(merchant.walletCommission.replace('%', '').replace(',', '.')) / 100;
      const commissionAmount = netAmount * commissionRate;
      const bsmvRate = 0.05; // %5 BSMV
      const bsmvAmount = commissionAmount * bsmvRate;
      
      // Hakediş durumu
      const paymentSent = i > 3 || (i <= 3 && Math.random() > 0.7);
      const confirmationReceived = paymentSent && (i > 5 || (i <= 5 && Math.random() > 0.3));
      
      // Valör günü
      const valorDay = merchant.walletValor.includes('1') ? 1 : 2;
      
      // Ödeme tarihi
      const paymentDate = paymentSent ? format(addDays(date, valorDay), 'yyyy-MM-dd') : null;
      
      settlements.push({
        id: `HAK-${dateStr}-${merchant.id}`,
        settlementDate: dateStr,
        merchant: merchant,
        totalPaymentAmount: paymentAmount,
        totalPaymentCount: paymentCount,
        totalRefundAmount: refundAmount,
        totalRefundCount: refundCount,
        totalNetAmount: netAmount,
        valorDay: valorDay,
        commissionRate: commissionRate,
        commissionAmount: commissionAmount,
        bsmvAmount: bsmvAmount,
        finalAmount: netAmount - commissionAmount - bsmvAmount,
        paymentSent: paymentSent,
        paymentDate: paymentDate,
        confirmationReceived: confirmationReceived,
        confirmationDate: confirmationReceived ? format(addDays(new Date(paymentDate || dateStr), Math.floor(Math.random() * 3) + 1), 'yyyy-MM-dd') : null
      });
    });
  }
  
  return settlements;
};

// Saklı kart hakedişleri oluşturma fonksiyonu
const generateStoredCardSettlements = () => {
  const settlements: any[] = [];
  const today = new Date();
  
  // Son 6 ay için aylık hakediş verileri oluştur
  for (let i = 0; i < 6; i++) {
    const date = subMonths(today, i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const periodStr = `${year}-${monthStr}`;
    
    // Her ay için tüm merchantlar için hakediş oluştur
    merchants.forEach(merchant => {
      // Rastgele işlem sayıları ve tutarları
      const paymentCount = Math.floor(Math.random() * 500) + 100;
      const paymentAmount = Math.random() * 50000 + 10000;
      const refundCount = Math.floor(Math.random() * 25);
      const refundAmount = Math.random() * paymentAmount * 0.1;
      const netAmount = paymentAmount - refundAmount;
      
      // Komisyon hesaplamaları
      const commissionRate = parseFloat(merchant.storedCardCommission.replace('%', '').replace(',', '.')) / 100;
      const commissionAmount = netAmount * commissionRate;
      const bsmvRate = 0.05; // %5 BSMV
      const bsmvAmount = commissionAmount * bsmvRate;
      
      // Hakediş durumu
      const revenueCollected = i > 1 || (i <= 1 && Math.random() > 0.3);
      
      // Tahsilat tarihi
      const collectionDate = revenueCollected ? format(new Date(year, month, 15), 'yyyy-MM-dd') : null;
      
      settlements.push({
        id: `HAK-SC-${periodStr}-${merchant.id}`,
        settlementDate: periodStr,
        period: `${getMonthName(month)} ${year}`,
        merchant: merchant,
        totalPaymentAmount: paymentAmount,
        totalPaymentCount: paymentCount,
        totalRefundAmount: refundAmount,
        totalRefundCount: refundCount,
        totalNetAmount: netAmount,
        commissionRate: commissionRate,
        totalCommissionAmount: commissionAmount,
        bsmvAmount: bsmvAmount,
        finalAmount: commissionAmount - bsmvAmount,
        revenueCollected: revenueCollected,
        collectionDate: collectionDate
      });
    });
  }
  
  return settlements;
};

// Tahakkuk teyitleri oluşturma fonksiyonu
const generateAccrualConfirmations = () => {
  const walletSettlements = generateWalletSettlements();
  
  // Sadece ödeme yapılmış ama teyit edilmemiş hakedişleri filtrele
  return walletSettlements.filter(settlement => 
    settlement.paymentSent && !settlement.confirmationReceived
  );
};

// Dışa aktarılan fonksiyonlar
export const mockDataService = {
  getMerchants: () => [...merchants],
  getPackages: () => [...packages],
  getStatements: () => generateStatements(),
  getWalletSettlements: () => generateWalletSettlements(),
  getStoredCardSettlements: () => generateStoredCardSettlements(),
  getAccrualConfirmations: () => generateAccrualConfirmations(),
  
  // Belirli bir merchant için verileri getir
  getMerchantStatements: (merchantId: string) => {
    console.log("getMerchantStatements çağrıldı, merchantId:", merchantId);
    const statements = generateStatements();
    console.log("Oluşturulan ekstreler:", statements);
    return statements.filter(statement => statement.merchant.id === merchantId);
  },
  getMerchantWalletSettlements: (merchantId: string) => generateWalletSettlements().filter(settlement => settlement.merchant.id === merchantId),
  getMerchantStoredCardSettlements: (merchantId: string) => generateStoredCardSettlements().filter(settlement => settlement.merchant.id === merchantId),
  
  // Belirli bir duruma göre verileri filtrele
  getStatementsByStatus: (status: string) => generateStatements().filter(statement => statement.status === status),
  getWalletSettlementsByStatus: (status: string) => {
    if (status === 'pending') {
      return generateWalletSettlements().filter(settlement => !settlement.paymentSent);
    } else if (status === 'paid') {
      return generateWalletSettlements().filter(settlement => settlement.paymentSent);
    }
    return generateWalletSettlements();
  },
  getStoredCardSettlementsByStatus: (status: string) => {
    if (status === 'pending') {
      return generateStoredCardSettlements().filter(settlement => !settlement.revenueCollected);
    } else if (status === 'collected') {
      return generateStoredCardSettlements().filter(settlement => settlement.revenueCollected);
    }
    return generateStoredCardSettlements();
  },
  
  // Belirli bir ID'ye göre veri getir
  getStatementById: (id: string) => generateStatements().find(statement => statement.id === id),
  getWalletSettlementById: (id: string) => generateWalletSettlements().find(settlement => settlement.id === id),
  getStoredCardSettlementById: (id: string) => generateStoredCardSettlements().find(settlement => settlement.id === id),
  getMerchantById: (id: string) => merchants.find(merchant => merchant.id === id),
  getPackageById: (id: string) => packages.find(pkg => pkg.id === id)
};

export default mockDataService;