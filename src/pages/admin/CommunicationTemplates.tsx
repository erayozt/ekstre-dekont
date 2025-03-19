import { useState } from 'react';
import { Save, Edit, Trash, Plus, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

// Örnek e-posta şablonları
const initialTemplates = [
  {
    id: 1,
    name: 'Cüzdan Hakediş Bildirimi',
    subject: 'Hepsipay Cüzdan Hakediş Bildirimi - {{settlementDate}}',
    body: `Sayın {{merchantName}} Yetkilisi,

{{settlementDate}} tarihli cüzdan hakediş bildirimine ilişkin detaylar aşağıda bilgilerinize sunulmuştur:

Hakediş Referans No: {{settlementId}}
Hakediş Dönemi: {{settlementDate}}
Toplam İşlem Tutarı: {{totalPaymentAmount}} TL
Toplam İşlem Sayısı: {{totalPaymentCount}} adet
Toplam İade Tutarı: {{totalRefundAmount}} TL
Toplam İade Sayısı: {{totalRefundCount}} adet
Net Tutar: {{totalNetAmount}} TL
Valör Günü: {{valorDay}} iş günü

Yukarıdaki bilgileri kontrol ederek, hakediş bildirimine onay vermenizi rica ederiz. Onay vermeniz durumunda, belirtilen valör günü sonrasında ödemeniz IBAN numaranıza aktarılacaktır.

Herhangi bir sorunuz veya tereddütünüz olması durumunda, lütfen bizimle iletişime geçmekten çekinmeyiniz.

Saygılarımızla,
Hepsipay Finans Ekibi
finans@hepsipay.com
0850 123 45 67`,
    trigger: 'Cüzdan hakediş oluşturulduğunda',
    lastUpdated: '2023-05-15'
  },
  {
    id: 2,
    name: 'Saklı Kart Komisyon Bildirimi',
    subject: 'Hepsipay Saklı Kart Komisyon Bildirimi - {{settlementMonth}}',
    body: `Sayın {{merchantName}} Yetkilisi,

{{settlementMonth}} dönemine ait saklı kart komisyon bildirimine ilişkin detaylar aşağıda bilgilerinize sunulmuştur:

Hakediş Referans No: {{settlementId}}
Hakediş Dönemi: {{settlementMonth}}
Toplam İşlem Tutarı: {{totalPaymentAmount}} TL
Toplam İşlem Sayısı: {{totalPaymentCount}} adet
Toplam İade Tutarı: {{totalRefundAmount}} TL
Toplam İade Sayısı: {{totalRefundCount}} adet
Net Tutar: {{totalNetAmount}} TL
Komisyon Oranı: %{{commissionRate}}
Komisyon Tutarı: {{totalCommissionAmount}} TL
BSMV Oranı: %5
BSMV Tutarı: {{bsmvAmount}} TL
Toplam Ödenecek Tutar: {{totalAmount}} TL

Lütfen yukarıdaki komisyon tutarını belirtilen son ödeme tarihine kadar ödemenizi rica ederiz. Ödeme işlemini Hepsipay Merchant Panel üzerinden kredi kartı ile veya aşağıdaki banka hesabına EFT/Havale yoluyla gerçekleştirebilirsiniz:

Banka: Hepsipay Bank
Şube: Merkez Şube (123)
Hesap Adı: Hepsipay Ödeme Hizmetleri A.Ş.
IBAN: TR12 3456 7890 1234 5678 9012 34

Son Ödeme Tarihi: {{dueDate}}

Herhangi bir sorunuz veya tereddütünüz olması durumunda, lütfen bizimle iletişime geçmekten çekinmeyiniz.

Saygılarımızla,
Hepsipay Finans Ekibi
finans@hepsipay.com
0850 123 45 67`,
    trigger: 'Saklı kart hakediş oluşturulduğunda',
    lastUpdated: '2023-06-20'
  },
  {
    id: 3,
    name: 'Ödeme Onay Bildirimi',
    subject: 'Hepsipay Ödeme Onayı - {{settlementId}}',
    body: `Sayın {{merchantName}} Yetkilisi,

{{settlementId}} referans numaralı hakediş ödemesi {{paymentDate}} tarihinde hesabınıza başarıyla aktarılmıştır.

Ödeme Detayları:
Hakediş Referans No: {{settlementId}}
Hakediş Dönemi: {{settlementDate}}
Ödeme Tutarı: {{paymentAmount}} TL
Ödeme Tarihi: {{paymentDate}}
Alıcı IBAN: {{merchantIban}}
Açıklama: HP-{{settlementId}} Hakediş Ödemesi

Bu ödemeye ilişkin dekont bilgilerinizi Hepsipay Merchant Panel üzerinden "Cüzdan Hakediş Tablosu" sayfasından indirebilirsiniz.

Herhangi bir sorunuz veya tereddütünüz olması durumunda, lütfen bizimle iletişime geçmekten çekinmeyiniz.

Saygılarımızla,
Hepsipay Finans Ekibi
finans@hepsipay.com
0850 123 45 67`,
    trigger: 'Ödeme onaylandığında',
    lastUpdated: '2023-07-10'
  },
  {
    id: 4,
    name: 'Komisyon Ödeme Hatırlatması',
    subject: 'Hepsipay Komisyon Ödeme Hatırlatması - {{settlementMonth}}',
    body: `Sayın {{merchantName}} Yetkilisi,

{{settlementMonth}} dönemine ait saklı kart komisyon ödemesinin henüz gerçekleşmediğini hatırlatmak isteriz.

Ödeme Detayları:
Hakediş Referans No: {{settlementId}}
Hakediş Dönemi: {{settlementMonth}}
Toplam Ödenecek Tutar: {{totalAmount}} TL
Son Ödeme Tarihi: {{dueDate}}

Ödeme işlemini Hepsipay Merchant Panel üzerinden kredi kartı ile veya aşağıdaki banka hesabına EFT/Havale yoluyla en kısa sürede gerçekleştirmenizi rica ederiz:

Banka: Hepsipay Bank
Şube: Merkez Şube (123)
Hesap Adı: Hepsipay Ödeme Hizmetleri A.Ş.
IBAN: TR12 3456 7890 1234 5678 9012 34

Son ödeme tarihinden sonra gerçekleştirilecek ödemelere gecikme faizi uygulanacağını hatırlatır, anlayışınız için teşekkür ederiz.

Herhangi bir sorunuz veya tereddütünüz olması durumunda, lütfen bizimle iletişime geçmekten çekinmeyiniz.

Saygılarımızla,
Hepsipay Finans Ekibi
finans@hepsipay.com
0850 123 45 67`,
    trigger: 'Ödeme son tarihinden 3 gün önce',
    lastUpdated: '2023-08-05'
  },
  {
    id: 5,
    name: 'Cüzdan Hakediş Ödeme Talimatı',
    subject: 'Hepsipay Cüzdan Hakediş Ödeme Talimatı - {{settlementDate}}',
    body: `Sayın Finans Ekibi,

{{settlementDate}} tarihli cüzdan hakediş ödemelerine ilişkin ödeme talimatı aşağıda bilgilerinize sunulmuştur:

Ödeme Talimatı Referans No: ODEME-{{settlementDate}}
Toplam Üye İşyeri Sayısı: {{merchantCount}} adet
Toplam Ödeme Tutarı: {{totalPaymentAmount}} TL
Ödeme Valör Tarihi: {{paymentDate}}

Ödeme Detayları:
{{paymentDetails}}

Yukarıdaki ödemelerin belirtilen valör tarihinde gerçekleştirilmesi için gerekli işlemlerin yapılmasını rica ederiz.

Saygılarımızla,
Hepsipay Operasyon Ekibi
operasyon@hepsipay.com
0850 123 45 67

Not: Bu e-posta otomatik olarak oluşturulmuştur. Lütfen yanıtlamayınız.`,
    trigger: 'Cüzdan hakediş ödemeleri onaylandığında',
    lastUpdated: '2023-09-10'
  }
];

export default function CommunicationTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    subject: '',
    body: '',
    trigger: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [testData, setTestData] = useState({
    merchantName: 'Test Üye İşyeri',
    settlementId: 'HAK-2023-09-15-M1001',
    settlementDate: '15.09.2023',
    settlementMonth: 'Eylül 2023',
    totalPaymentAmount: '50,000.00',
    totalPaymentCount: '250',
    totalRefundAmount: '5,000.00',
    totalRefundCount: '15',
    totalNetAmount: '45,000.00',
    commissionRate: '1.85',
    totalCommissionAmount: '832.50',
    bsmvAmount: '41.63',
    totalAmount: '874.13',
    dueDate: '30.09.2023',
    paymentAmount: '45,000.00',
    paymentDate: '18.09.2023',
    merchantIban: 'TR123456789012345678901234',
    valorDay: '2',
    merchantCount: '15',
    paymentDetails: `1. Üye İşyeri: ABC Ltd. Şti. - Tutar: 12,500.00 TL - IBAN: TR11 1111 1111 1111 1111 1111 11
2. Üye İşyeri: XYZ A.Ş. - Tutar: 8,750.00 TL - IBAN: TR22 2222 2222 2222 2222 2222 22
3. Üye İşyeri: DEF Ticaret - Tutar: 23,750.00 TL - IBAN: TR33 3333 3333 3333 3333 3333 33`
  });
  
  const handleAddNew = () => {
    setFormData({
      id: null,
      name: '',
      subject: '',
      body: '',
      trigger: ''
    });
    setShowTemplateForm(true);
    setEditingTemplate(null);
  };
  
  const handleEdit = (template) => {
    setFormData({
      id: template.id,
      name: template.name,
      subject: template.subject,
      body: template.body,
      trigger: template.trigger
    });
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      setTemplates(templates.filter(template => template.id !== id));
      toast.success('Şablon başarıyla silindi');
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTemplate) {
      // Güncelleme
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { 
              ...formData, 
              lastUpdated: format(new Date(), 'yyyy-MM-dd')
            } 
          : template
      ));
      toast.success('Şablon başarıyla güncellendi');
    } else {
      // Yeni ekleme
      const newTemplate = {
        ...formData,
        id: Math.max(...templates.map(t => t.id), 0) + 1,
        lastUpdated: format(new Date(), 'yyyy-MM-dd')
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Şablon başarıyla eklendi');
    }
    
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };
  
  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };
  
  const handleSendTest = () => {
    toast.success('Test e-postası başarıyla gönderildi');
    setShowPreview(false);
  };
  
  // Şablon içindeki değişkenleri test verileriyle değiştir
  const replaceVariables = (text) => {
    if (!text) return '';
    
    let result = text;
    Object.keys(testData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, testData[key]);
    });
    
    return result;
  };
  
  const format = (date, formatStr) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return formatStr.replace('yyyy', year)
      .replace('MM', month)
      .replace('dd', day);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">İletişim Senaryoları</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Şablon Ekle
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şablon Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tetikleyici
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {templates.map((template) => (
                <tr key={template.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.subject}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.trigger}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {template.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Önizle"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Düzenle"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Sil"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Şablon Ekleme/Düzenleme Formu */}
      {showTemplateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingTemplate ? 'Şablonu Düzenle' : 'Yeni Şablon Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şablon Adı
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Konusu
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta İçeriği
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md h-64 font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Değişkenler için {{değişken_adı}} formatını kullanın. Örn: {{merchantName}}, {{settlementId}}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tetikleyici
                </label>
                <input
                  type="text"
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowTemplateForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* E-posta Önizleme */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">E-posta Önizleme</h2>
            
            <div className="border rounded-md p-4 mb-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">Konu: </span>
                <span>{replaceVariables(previewTemplate.subject)}</span>
              </div>
              
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md font-mono text-sm">
                {replaceVariables(previewTemplate.body)}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Kapat
              </button>
              <button 
                onClick={handleSendTest}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Test E-postası Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 