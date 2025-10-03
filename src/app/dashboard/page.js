'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Horizontal Place
                </h1>
                <p className="text-gray-600">
                  Sistema de Gestión de Residentes
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.username || user?.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role?.name || 'Usuario'}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Bienvenido al Dashboard!
                </h2>
                <p className="text-gray-600 mb-8">
                  Has iniciado sesión correctamente. Aquí puedes acceder a todas las funcionalidades del sistema.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Navigation Cards */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Gestión de Residentes
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Administra la información de los residentes y sus preferencias.
                    </p>
                    <Link
                      href="/room"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Ir a Residentes
                    </Link>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Servicio de Comidas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Gestiona el servicio de desayunos, almuerzos y cenas.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Ir a Comidas
                    </Link>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Resumen
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Revisa reportes y estadísticas del sistema.
                    </p>
                    <Link
                      href="/summary"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Ver Resumen
                    </Link>
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del Usuario
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-gray-500">ID:</p>
                      <p className="font-medium text-gray-900">{user?.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Usuario:</p>
                      <p className="font-medium text-gray-900">{user?.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rol:</p>
                      <p className="font-medium text-gray-900">
                        {user?.role?.name || 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
