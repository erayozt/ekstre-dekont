import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';

// Admin Panel Bileşenleri
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import WalletSettlementTable from './pages/admin/WalletSettlementTable';
import WalletDailyTable from './pages/admin/WalletDailyTable';
import StoredCardSettlementTable from './pages/admin/StoredCardSettlementTable';
import StoredCardMonthlyTable from './pages/admin/StoredCardMonthlyTable';
import CommunicationTemplates from './pages/admin/CommunicationTemplates';

// Merchant Panel Bileşenleri
import MerchantLayout from './layouts/MerchantLayout';
import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantWalletSettlementTable from './pages/merchant/WalletSettlementTable';
import MerchantWalletDailyTable from './pages/merchant/WalletDailyTable';
import MerchantStoredCardSettlementTable from './pages/merchant/StoredCardSettlementTable';
import MerchantStoredCardMonthlyTable from './pages/merchant/StoredCardMonthlyTable';
import MerchantStatements from './pages/merchant/Statements';
import Receipts from './pages/merchant/Receipts';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Panel Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="wallet-settlement" element={<WalletSettlementTable />} />
          <Route path="wallet-daily" element={<WalletDailyTable />} />
          <Route path="stored-card-settlement" element={<StoredCardSettlementTable />} />
          <Route path="stored-card-monthly" element={<StoredCardMonthlyTable />} />
          <Route path="communication-templates" element={<CommunicationTemplates />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Merchant Panel Routes */}
        <Route path="/merchant" element={<MerchantLayout />}>
          <Route path="dashboard" element={<MerchantDashboard />} />
          <Route path="wallet-settlement" element={<MerchantWalletSettlementTable />} />
          <Route path="wallet-daily" element={<MerchantWalletDailyTable />} />
          <Route path="stored-card-settlement" element={<MerchantStoredCardSettlementTable />} />
          <Route path="stored-card-monthly" element={<MerchantStoredCardMonthlyTable />} />
          <Route path="statements" element={<MerchantStatements />} />
          <Route path="receipts" element={<Receipts />} />
          <Route index element={<Navigate to="/merchant/dashboard" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;