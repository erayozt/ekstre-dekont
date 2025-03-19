import { Outlet, NavLink } from 'react-router-dom';
import { LogOut, CreditCard, Wallet, Calendar, BarChart3, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hepsipayLogo from '../assets/hepsipay-logo.png';

export default function AdminLayout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4 flex flex-col items-center">
          <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-10" />
          <span className="text-xl font-bold mt-2">Yönetici Paneli</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-2 text-xs font-semibold text-blue-300 uppercase">
            Ana Menü
          </div>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-blue-300 uppercase">
            Cüzdan İşlemleri
          </div>
          <NavLink 
            to="/admin/wallet-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <Wallet className="h-5 w-5 mr-3" />
            Cüzdan Hakediş Tablosu
          </NavLink>
          
          <NavLink 
            to="/admin/wallet-daily" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <Calendar className="h-5 w-5 mr-3" />
            Cüzdan Günsonu Tablosu
          </NavLink>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-blue-300 uppercase">
            Saklı Kart İşlemleri
          </div>
          <NavLink 
            to="/admin/stored-card-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <CreditCard className="h-5 w-5 mr-3" />
            Saklı Kart Hakediş Tablosu
          </NavLink>
          
          <NavLink 
            to="/admin/stored-card-monthly" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <Calendar className="h-5 w-5 mr-3" />
            Saklı Kart Aysonu Tablosu
          </NavLink>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-blue-300 uppercase">
            Sistem Yönetimi
          </div>
          <NavLink 
            to="/admin/communication-templates" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}`
            }
          >
            <Mail className="h-5 w-5 mr-3" />
            İletişim Senaryoları
          </NavLink>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center text-blue-300 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-medium">Hepsipay Yönetim Sistemi</h2>
            
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Çıkış Yap
            </button>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}