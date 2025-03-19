import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users } from 'lucide-react';
import hepsipayLogo from '../assets/hepsipay-logo.png';

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (selectedRole === 'merchant') {
      navigate('/merchant/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img src={hepsipayLogo} alt="Hepsipay Logo" className="h-16" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Hepsipay Yönetim Sistemi
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Devam etmek için rolünüzü seçin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'admin' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleRoleSelect('admin')}
              >
                <div className="flex flex-col items-center">
                  <Building2 className="h-12 w-12 text-blue-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Yönetici Paneli</h3>
                  <p className="mt-1 text-sm text-gray-500 text-center">
                    Operasyon ve finans ekipleri için
                  </p>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedRole === 'merchant' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => handleRoleSelect('merchant')}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-12 w-12 text-green-600 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Üye İş Yeri Paneli</h3>
                  <p className="mt-1 text-sm text-gray-500 text-center">
                    Üye işyeri yetkilileri için
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleContinue}
                disabled={!selectedRole}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedRole 
                    ? selectedRole === 'admin' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 