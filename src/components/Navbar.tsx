// import { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Menu, X, BookOpen, Phone } from 'lucide-react';
// import logo from '@/assets/logo.png';


// const navLinks = [
//   { href: '/', label: 'Home' },
//   { href: '/order', label: 'Place Order' },
//   { href: '/tracking', label: 'Track Order' },
//   { href: '/history', label: 'Order History' },
// ];

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setIsMenuOpen(false);
//   }, [location]);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? 'bg-secondary shadow-2xl'
//           : 'bg-secondary/95 backdrop-blur-sm'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <img
//               src={logo}
//               alt="BookPrinters.in"
//               className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
//             />
//           </Link>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 to={link.href}
//                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                   location.pathname === link.href
//                     ? 'bg-primary text-primary-foreground'
//                     : 'text-white/80 hover:text-white hover:bg-white/10'
//                 }`}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden md:flex items-center gap-3">
//             <a
//               href="tel:+919999999999"
//               className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors duration-200"
//             >
//               <Phone className="h-4 w-4" />
//               <span>Call Us</span>
//             </a>
//             <Link
//               to="/auth"
//               className="px-4 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
//             >
//               Login
//             </Link>
//             <Link
//               to="/order"
//               className="px-5 py-2.5 text-sm font-semibold font-heading bg-gradient-crimson text-white rounded-lg hover:shadow-crimson transition-all duration-300 hover:scale-105 animate-pulse-glow"
//             >
//               Order Now
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
//           >
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div
//         className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
//           isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
//         }`}
//       >
//         <div className="bg-secondary border-t border-white/10 px-4 py-4 space-y-2">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               to={link.href}
//               className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
//                 location.pathname === link.href
//                   ? 'bg-primary text-primary-foreground'
//                   : 'text-white/80 hover:text-white hover:bg-white/10'
//               }`}
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
//             <Link
//               to="/auth"
//               className="block px-4 py-3 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
//             >
//               Login / Register
//             </Link>
//             <Link
//               to="/order"
//               className="block px-4 py-3 rounded-md text-sm font-bold text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
//             >
//               Order Now
//             </Link>
           

//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import logo from '@/assets/logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/order', label: 'Place Order' },
  { href: '/tracking', label: 'Track Order' },
  { href: '/history', label: 'Order History' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled 
          ? 'shadow-md py-2' 
          : 'shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="BookPrinters.in"
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+919999999999"
              className="flex items-center gap-2 text-slate-600 hover:text-primary text-sm font-medium transition-colors duration-200"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </a>
            <Link
              to="/auth"
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-primary hover:bg-slate-50 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/order"
              className="px-5 py-2 rounded-md text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Order Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                location.pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/auth"
              className="block px-4 py-3 rounded-md text-base font-medium text-slate-600 text-center"
            >
              Login / Register
            </Link>
            <Link
              to="/order"
              className="block px-4 py-3 rounded-md text-base font-bold text-center bg-primary text-primary-foreground"
            >
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}