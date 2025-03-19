import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Yönlendirme fonksiyonları
  const goToWalletEarnings = () => {
    navigate('/wallet-earnings?status=pending');
  };

  const goToHiddenCardCommissions = () => {
    navigate('/hidden-card-commissions?status=pending');
  };

  const goToAccrualConfirmations = () => {
    navigate('/accrual-confirmations?status=pending');
  };

  return (
    <div className="dashboard-cards">
      {/* Bekleyen Cüzdan Hakedişleri Kartı */}
      <div className="card" onClick={goToWalletEarnings}>
        <h3>Bekleyen Cüzdan Hakedişleri</h3>
        {/* Diğer içerikler... */}
      </div>

      {/* Bekleyen Saklı Kart Komisyonları Kartı */}
      <div className="card" onClick={goToHiddenCardCommissions}>
        <h3>Bekleyen Saklı Kart Komisyonları</h3>
        {/* Diğer içerikler... */}
      </div>

      {/* Tahakkuk Teyidi Bekleyenler Kartı */}
      <div className="card" onClick={goToAccrualConfirmations}>
        <h3>Tahakkuk Teyidi Bekleyenler</h3>
        {/* Diğer içerikler... */}
      </div>
      {/* Diğer kartlar... */}
    </div>
  );
}

export default Dashboard; 