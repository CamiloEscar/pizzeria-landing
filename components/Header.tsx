// components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/">
            <a>
              <Image src="/logo.png" alt="Logo" width={120} height={40} />
            </a>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/">
            <a className="text-gray-800 hover:text-red-600">Inicio</a>
          </Link>
          <Link href="/productos">
            <a className="text-gray-800 hover:text-red-600">Productos</a>
          </Link>
          <Link href="/contacto">
            <a className="text-gray-800 hover:text-red-600">Contacto</a>
          </Link>
          <Link href="/calidad">
            <a className="text-gray-800 hover:text-red-600">Nuestra Calidad</a>
          </Link>
          <Link href="/tips">
            <a className="text-gray-800 hover:text-red-600">Tips</a>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800 hover:text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
