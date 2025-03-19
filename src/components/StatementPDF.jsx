import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// PDF için stil tanımları
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f3f4f6',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
  },
  descriptionCell: {
    width: '70%',
  },
  amountCell: {
    width: '30%',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#666',
    paddingVertical: 8,
  },
  totalLabel: {
    width: '70%',
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
  },
  totalAmount: {
    width: '30%',
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 8,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

// PDF Bileşeni
const StatementPDF = ({ statement }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ekstre #{statement.id}</Text>
          <Text style={styles.subtitle}>{statement.period} Dönemi</Text>
        </View>
        <Image
          style={styles.logo}
          src="https://images.hepsiburada.net/assets/sardes/wallet/redesign/mail/icons/Hepsipay.png"
        />
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>İşyeri Bilgileri</Text>
            <Text style={styles.value}>ABC Ticaret Ltd. Şti.</Text>
            <Text style={styles.value}>Vergi No: 1234567890</Text>
            <Text style={styles.value}>Atatürk Cad. No:123</Text>
            <Text style={styles.value}>Şişli / İstanbul</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Ekstre Bilgileri</Text>
            <Text style={styles.value}>Düzenleme Tarihi: {format(new Date(statement.issueDate), 'dd MMMM yyyy', { locale: tr })}</Text>
            <Text style={styles.value}>Son Ödeme Tarihi: {format(new Date(statement.dueDate), 'dd MMMM yyyy', { locale: tr })}</Text>
            <Text style={styles.value}>Ödeme Durumu: {statement.status === 'paid' ? 'Ödendi' : statement.status === 'pending' ? 'Bekliyor' : 'Gecikti'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Cüzdan İşlemleri</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>İşlem Adedi</Text>
          <Text style={styles.summaryValue}>{statement.walletTransactions.count.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>İşlem Hacmi</Text>
          <Text style={styles.summaryValue}>{statement.walletTransactions.volume.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Komisyon Tutarı</Text>
          <Text style={styles.summaryValue}>{statement.walletTransactions.commission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
        </View>
      </View>
      
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Saklı Kart İşlemleri</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>İşlem Adedi</Text>
          <Text style={styles.summaryValue}>{statement.storedCardTransactions.count.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>İşlem Hacmi</Text>
          <Text style={styles.summaryValue}>{statement.storedCardTransactions.volume.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Komisyon Tutarı</Text>
          <Text style={styles.summaryValue}>{statement.storedCardTransactions.commission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dönem Özeti</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>Kalem</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>Tutar</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>Cüzdan Komisyonu</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>
              {statement.walletTransactions.commission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>Saklı Kart Komisyonu</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>
              {statement.storedCardTransactions.commission.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.descriptionCell]}>BSMV (%5)</Text>
            <Text style={[styles.tableCell, styles.amountCell]}>
              {statement.bsmvAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Text>
          </View>
          
          {statement.otherFees > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCell]}>Diğer Ücretler</Text>
              <Text style={[styles.tableCell, styles.amountCell]}>
                {statement.otherFees.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </Text>
            </View>
          )}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalAmount}>
              {statement.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text>Bu bir elektronik belgedir.</Text>
        <Text>Ekstre No: {statement.id}</Text>
        <Text>D ÖDEME ELEKTRONİK PARA VE ÖDEME HİZMETLERİ A.Ş</Text>
        <Text>Kuştepe Mah. Mecidiyeköy Yolu Cad. Trump Tower Blok No:12 İç Kapı No: 434 Şişli / İstanbul</Text>
      </View>
    </Page>
  </Document>
);

export default StatementPDF; 