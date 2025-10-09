import Link from 'next/link';
import { Shield, LogIn, UserPlus, Building, ArrowRight, Users, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ZassPass</h1>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full p-1 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="bg-white rounded-full p-8">
                  <Shield className="h-20 w-20 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Bienvenido a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                ZassPass
              </span>
            </h1>
            
            <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto mb-10">
              La plataforma unificada de autenticación que conecta usuarios con servicios de calidad 
              y facilita a los partners la gestión de su negocio.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
              >
                <LogIn className="h-5 w-5" />
                Acceder Ahora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Acceso Unificado</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Una plataforma, múltiples posibilidades
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                ZassPass simplifica el acceso y conecta a usuarios y partners en un ecosistema integrado.
              </p>
            </div>
            
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
                    <Users className="h-8 w-8 text-indigo-600" />
                  </dt>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 mb-4">
                    Para Usuarios
                  </dt>
                  <dd className="text-base leading-7 text-gray-600">
                    Accede a servicios de calidad, gestiona tus reservas y disfruta de una experiencia personalizada con nuestro sistema de membresías.
                  </dd>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                    <Building className="h-8 w-8 text-purple-600" />
                  </dt>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 mb-4">
                    Para Partners
                  </dt>
                  <dd className="text-base leading-7 text-gray-600">
                    Gestiona tu negocio, ofrece servicios, administra horarios y haz crecer tu empresa con nuestras herramientas profesionales.
                  </dd>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <dt className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <Zap className="h-8 w-8 text-green-600" />
                  </dt>
                  <dt className="text-xl font-semibold leading-7 text-gray-900 mb-4">
                    Acceso Rápido
                  </dt>
                  <dd className="text-base leading-7 text-gray-600">
                    Un solo login te da acceso a todo. Nuestra tecnología te redirige automáticamente a tu panel correspondiente.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl mx-4 sm:mx-8 lg:mx-16">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Listo para comenzar?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
                Únete a nuestra plataforma y descubre todas las posibilidades que ZassPass tiene para ofrecerte.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register/user"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                  Registro de Usuario
                </Link>
                
                <Link
                  href="/register/partner"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border-2 border-white px-6 py-3 text-base font-semibold text-white hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
                >
                  <Building className="h-5 w-5" />
                  Registro de Partner
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-indigo-200">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="font-semibold text-white hover:text-indigo-100">
                  Inicia sesión aquí →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-indigo-600 mr-2" />
              <span className="text-sm text-gray-600">Seguro y confiable</span>
            </div>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 ZassPass. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
