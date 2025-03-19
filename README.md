#  Üye İşyeri Yönetim Paneli

 Üye İşyeri Yönetim Paneli, işyerlerinin finansal işlemlerini, ödemelerini ve hakediş durumlarını yönetebilecekleri kapsamlı bir web uygulamasıdır. Panel, modern bir tasarım ve kullanıcı dostu bir arayüz ile üye işyerlerine geniş bir finansal yönetim yeteneği sunmaktadır. Live preview: https://majestic-valkyrie-868db7.netlify.app

## Genel Bakış

Bu proje,  ödeme sistemini kullanan üye işyerlerine yönelik geliştirilmiş bir dashboard çözümüdür. Ekstrelerin görüntülenmesi, dekontların yönetimi, cüzdan ve saklı kart işlemlerinin takibi gibi temel finansal süreçleri kapsar.

## Teknoloji Yığını

### Frontend
- **React**: Kullanıcı arayüzü geliştirme
- **TypeScript**: Tip güvenliği ve kodun daha sürdürülebilir olması için
- **TailwindCSS**: Kapsamlı ve özelleştirilebilir UI tasarımı
- **React Router**: Sayfa yönlendirme ve navigasyon
- **Lucide Icons**: Modern ve tutarlı ikon kütüphanesi
- **date-fns**: Tarih işlemleri için kullanılan kütüphane

### Araçlar & Geliştirme
- **Vite**: Hızlı geliştirme ortamı
- **ESLint**: Kod kalitesi ve tutarlılığı
- **Git & GitHub**: Versiyon kontrolü ve kod paylaşımı

## Proje Yapısı

```
src/
├── assets/              # Statik dosyalar (logo, görseller)
├── components/          # Yeniden kullanılabilir UI bileşenleri
│   ├── pdf/             # PDF görüntüleme ve oluşturma bileşenleri
│   └── ...
├── layouts/             # Sayfa düzenleri
│   └── MerchantLayout.tsx # Üye işyeri paneli ana düzeni
├── pages/               # Sayfalar
│   └── merchant/        # Üye işyeri sayfaları
│       ├── Dashboard.tsx  # Ana gösterge paneli
│       ├── Statements.tsx # Ekstreler sayfası
│       ├── Receipts.tsx   # Dekontlar sayfası
│       └── ...
├── services/            # API istekleri ve veri yönetimi
├── styles/              # Global stiller
└── App.tsx              # Ana uygulama bileşeni ve rotalar
```

## Temel Özellikler

### 1. Ekstre Yönetimi

Üye işyerleri, belirli dönemlere ait ekstrelerini görüntüleyebilir, filtreleyebilir ve indirebilirler. Ekstreler, saklı kart işlemleri ve iade detaylarını içerir.

- **Ekstre Listesi**: Tüm ekstrelerin görüntülendiği liste
- **Ekstre Detayı**: Spesifik bir ekstrenin detayları
- **PDF Görüntüleme**: Ekstrelerin PDF formatında görüntülenmesi
- **Filtreleme**: Tarih, tutar ve durum bazlı filtreleme özellikleri

### 2. Dekont Sistemi

Üye işyerlerine yapılan ödemelerin detaylı dekontlarını görüntüleme ve yönetme imkanı sunar.

- **Dekont Listesi**: Tüm dekontların görüntülendiği liste
- **Dekont Detayı**: Ödeme detaylarını içeren ayrıntılı görünüm
- **Yazdırma ve İndirme**: Dekontları yazdırma ve PDF olarak indirme
- **Bilgilendirme Notları**: Cüzdan ve alışveriş kredisi ilişkisi gibi bilgilendirmeler

### 3. Finansal İşlem Takibi

- **Saklı Kart İşlemleri**: Saklı kartlar üzerinden yapılan işlemlerin takibi
- **Komisyon Yönetimi**: Komisyon oranları ve tutarlarının görüntülenmesi
- **Hakediş Tabloları**: Günlük ve aylık hakediş durumları

### 4. Kullanıcı Deneyimi

- **Duyarlı Tasarım**: Tüm ekran boyutlarına uyumlu arayüz
- **Kolay Navigasyon**: Kategorize edilmiş menu yapısı
- **Arama ve Filtreleme**: Gelişmiş arama ve filtreleme özellikleri
- **Bildirimler**: İşlem durumlarına dair bildirimler

## Bileşenler

### MerchantLayout

Üye işyeri paneli için ana düzen bileşeni. Sidebar navigasyonu, üst başlık ve içerik alanından oluşur.

### StatementModal

Ekstre detaylarının gösterildiği modal bileşeni. Özet bilgiler, işlem detayları ve geçiş metrikleri içerir.

### PdfTransactionDetailsSection

Ekstre PDF'lerinde kullanılan, işlem detaylarını gösteren bileşen. Saklı kart ve iade işlemlerinin detaylarını içerir.

### ReceiptDetailModal

Dekont detaylarını gösteren modal bileşeni. Cüzdan işlemleri, alışveriş kredisi işlemleri ve toplam tutar bilgilerini içerir.

## Sayfa Yapısı

### Dashboard

Ana sayfa, önemli metrikleri ve özet bilgileri gösterir.

### Statements

Ekstre listesi ve detaylarını görüntüleme sayfası. Filtreleme ve arama özellikleri içerir.

### Receipts

Dekont listesi ve detaylarını görüntüleme sayfası. Tarih filtreleme ve arama özellikleri içerir.

### Settings

Üye işyeri ayarlarının yapılandırıldığı sayfa.

## Veri Akışı

1. Kullanıcı panele giriş yapar
2. İlgili menü öğesine tıklar (örn. Ekstreler)
3. Sayfa veriyi yükler ve listeler
4. Kullanıcı bir öğeye tıkladığında detaylar gösterilir
5. Kullanıcı PDF görüntüleme, indirme veya yazdırma işlemlerini gerçekleştirebilir

## İş Mantığı

- **Ekstre Hesaplama**: Saklı kart işlemleri üzerinden toplam ciro, komisyon ve net tutar hesaplanır
- **Dekont İşlemleri**: Cüzdan ve alışveriş kredisi işlemlerinin toplam tutarı ve komisyonu hesaplanır
- **Toplam Tutar Hesaplama**: İşlem tutarından komisyon çıkarılarak net tutar hesaplanır

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Kurulum Adımları
```bash
# Repoyu klonlayın
git clone https://github.com/username/-merchant-panel.git

# Proje dizinine gidin
cd -merchant-panel

# Bağımlılıkları yükleyin
npm install
# veya
yarn install

# Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev
```

### Derleme
```bash
npm run build
# veya
yarn build
```

## Test

```bash
npm test
# veya
yarn test
```

## Notlar ve Kısıtlamalar

- Uygulama şu anki haliyle mock veriler kullanmaktadır
- Gerçek API entegrasyonu için endpoints yapılandırılmalıdır
- Cüzdan işlemleri ve alışveriş kredisi ilişkisi özellikle dekontlarda belirtilmiştir
- Ekstreler, cüzdan ve alışveriş kredisi verilerini içermez, sadece saklı kart işlemleri içerir

## Gelecek Geliştirmeler

- Gerçek zamanlı bildirim sistemi
- İleri düzey raporlama ve analiz özellikleri
- Çoklu dil desteği
- Dark mode
- Mobile uygulamalar

---

Bu proje,  Ödeme Hizmetleri ve Elektronik Para A.Ş. için geliştirilmiş olup, tüm hakları saklıdır.
