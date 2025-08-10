import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">RentMate</h3>
            <p className="text-gray-300">
              The most trusted rental marketplace connecting renters with item owners.
            </p>
            <div className="flex space-x-4">
              {/* Replace with actual icons or SVGs if you use a library */}
              <a href="#" className="text-gray-300 hover:text-white text-sm">FB</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">TW</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">IG</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm">LN</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white">Browse Products</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/vehicles" className="text-gray-300 hover:text-white">Vehicles</Link></li>
              <li><Link to="/products/appliances" className="text-gray-300 hover:text-white">Home Appliances</Link></li>
              <li><Link to="/products/furniture" className="text-gray-300 hover:text-white">Furniture</Link></li>
              <li><Link to="/products/electronics" className="text-gray-300 hover:text-white">Electronics</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>Rasulgarh, Bhubaneswar, India</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📧</span>
                <span>info@rentmate.com</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📞</span>
                <span>+91 8993 675 873</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RentMate. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-gray-300 hover:text-white text-sm">Terms of Service</Link>
            <Link to="/privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
