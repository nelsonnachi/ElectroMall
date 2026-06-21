import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebook, FaYoutube, FaTwitter } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const SOCIAL_LINKS = [
  { icon: <FaFacebook size={18} />, label: 'Facebook', href: '#' },
  { icon: <FaInstagram size={18} />, label: 'Instagram', href: '#' },
  { icon: <FaTwitter size={18} />, label: 'Twitter', href: '#' },
  { icon: <FaYoutube size={18} />, label: 'Youtube', href: '#' },
];

const FOOTER_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/shop' },
      { name: 'New Arrivals', href: '/categories' },
      { name: 'Featured Deals', href: '/deals' },
      { name: 'Clearance', href: '/sale' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Shipping & Returns', href: '/shipping' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Track Order', href: '/track' },
    ],
  },
];

const PAYMENT_METHODS = ['VISA', 'MASTERCARD', 'VERVE', 'PAYPAL'];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail('');
  };

  return (
    <footer className="border-t border-neutral-100 bg-white pt-16 pb-8 text-neutral-600 font-sans">
      <div className="container mx-auto px-6">
        
        {/* Top Section: Grid Content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 pb-14">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <div className="text-xl font-bold tracking-[0.15em] text-neutral-900 uppercase">
              Shop<span className="font-light text-neutral-500">Ease</span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-500 max-w-xs">
              Crafting premium shopping experiences with curated collections tailored to your lifestyle.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {SOCIAL_LINKS.map((social) => (
                <NavLink 
                  key={social.label} 
                  to={social.href} 
                  className="text-neutral-400 transition-colors duration-200 hover:text-neutral-900" 
                  aria-label={social.label}
                >
                  {social.icon}
                </NavLink>
              ))}
            </div>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wider text-neutral-900 uppercase mb-5">{section.title}</h3>
              <ul className="flex flex-col gap-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <NavLink 
                      to={link.href} 
                      className={({ isActive }) =>
                        `transition-colors duration-200 ${
                          isActive 
                            ? 'text-neutral-900 underline underline-offset-4' 
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-neutral-900 uppercase mb-5">Newsletter</h3>
            <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
              Subscribe to unlock early access, seasonal sales, and custom updates.
            </p>
            <form 
              onSubmit={handleSubscribe} 
              className="relative flex items-center border-b border-neutral-300 py-2 focus-within:border-neutral-900 transition-colors duration-300"
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent pr-8 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
              />
              <button 
                type="submit" 
                className="absolute right-0 text-neutral-400 hover:text-neutral-900 transition-colors duration-200" 
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Legal & Payment */}
        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <NavLink 
              to="/privacy" 
              className={({ isActive }) =>
                isActive 
                  ? "text-neutral-600 underline underline-offset-4" 
                  : "hover:text-neutral-600 transition-colors"
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink 
              to="/terms" 
              className={({ isActive }) =>
                isActive 
                  ? "text-neutral-600 underline underline-offset-4" 
                  : "hover:text-neutral-600 transition-colors"
              }
            >
              Terms of Service
            </NavLink>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2 opacity-50 tracking-widest font-mono text-[10px]">
            {PAYMENT_METHODS.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
