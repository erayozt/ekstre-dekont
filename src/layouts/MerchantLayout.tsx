import { Outlet, NavLink } from 'react-router-dom';
import { Users, LogOut, CreditCard, Wallet, Calendar, BarChart3, FileText, Home, Settings, HelpCircle, Menu, X, FileBarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hepsipayLogo from '../assets/hepsipay-logo.png';

const navigation = [
  { name: 'Ana Sayfa', href: '/merchant', icon: Home },
  { name: 'İşlemler', href: '/merchant/transactions', icon: CreditCard },
  { name: 'Ekstreler', href: '/merchant/statements', icon: FileBarChart },
  { name: 'Dekontlar', href: '/merchant/receipts', icon: FileText },
  { name: 'Ayarlar', href: '/merchant/settings', icon: Settings },
  { name: 'Yardım', href: '/merchant/help', icon: HelpCircle },
];

export default function MerchantLayout() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4 flex flex-col items-center">
          <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-10" />
          <span className="text-xl font-bold mt-2">Üye İş Yeri Paneli</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-2 text-xs font-semibold text-green-300 uppercase">
            Ana Menü
          </div>
          <NavLink 
            to="/merchant/dashboard" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
            }
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-green-300 uppercase">
            Hakediş ve Mutabakat Yönetimi
          </div>
          <NavLink 
            to="/merchant/wallet-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
            }
          >
            <Wallet className="h-5 w-5 mr-3" />
            Cüzdan Hakediş Tablosu
          </NavLink>
          <NavLink 
            to="/merchant/wallet-daily" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
            }
          >
            <Calendar className="h-5 w-5 mr-3" />
            Cüzdan Günsonu Tablosu
          </NavLink>
          <NavLink 
            to="/merchant/stored-card-settlement" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
            }
          >
            <CreditCard className="h-5 w-5 mr-3" />
            Saklı Kart Hakediş Tablosu
          </NavLink>
          <NavLink 
            to="/merchant/stored-card-monthly" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 ${isActive ? 'bg-green-900' : 'hover:bg-green-700'}`
            }
          >
            <Calendar className="h-5 w-5 mr-3" />
            Saklı Kart Aysonu Tablosu
          </NavLink>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-green-300 uppercase">
            Finansal Yönetim
          </div>
          <NavLink 
            to="/merchant/statements" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 mt-2 text-sm ${
                isActive 
                  ? "text-white bg-green-700" 
                  : "text-green-100 hover:bg-green-700"
              }`
            }
          >
            <FileBarChart className="w-5 h-5 mr-2" />
            Ekstreler
          </NavLink>
          
          <NavLink 
            to="/merchant/receipts" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 mt-2 text-sm ${
                isActive 
                  ? "text-white bg-green-700" 
                  : "text-green-100 hover:bg-green-700"
              }`
            }
          >
            <FileText className="w-5 h-5 mr-2" />
            Dekontlar
          </NavLink>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center text-green-300 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {/* Main Content */}
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