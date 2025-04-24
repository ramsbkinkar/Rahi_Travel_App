import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and about */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="font-poppins font-bold text-2xl text-primary">
                <span className="text-raahi-orange">R</span>aahi
              </span>
            </Link>
            <p className="text-gray-600 mt-4">
              Your smart travel companion that helps you create, capture, and remember your most beautiful travel memories.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-raahi-orange transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-raahi-orange transition">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-600 hover:text-primary transition">Home</Link></li>
              <li><Link to="/travel-packages" className="text-gray-600 hover:text-primary transition">Travel Packages</Link></li>
              <li><Link to="/explore-india" className="text-gray-600 hover:text-primary transition">Explore India</Link></li>
              <li><Link to="/scrapbook" className="text-gray-600 hover:text-primary transition">Digital Scrapbook</Link></li>
              <li><Link to="/social-feed" className="text-gray-600 hover:text-primary transition">Travelgram</Link></li>
            </ul>
          </div>

          {/* Popular destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-primary transition">Goa</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition">Kerala</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition">Rajasthan</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition">Himachal Pradesh</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition">Andaman & Nicobar</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for travel deals, tips and inspiration.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-l-md"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md transition">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} Raahi Travel Companion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
