// eslint-disable-next-line no-unused-vars

import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" text-black py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="about">
            <h4 className="font-semibold text-xl mb-4">About Us</h4>
            <p className="text-black text-sm">
              We are a counseling platform committed to providing the best mental health and well-being services to our clients.
              Whether you need individual counseling or relationship guidance, here to help you live a better life.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="quick-links">
            <h4 className="font-semibold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2 text-black">
              <li><Link to="/" className="hover:text-indigo-500">Home</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-500">Profile</Link></li>
              <li><Link to="/appointment" className="hover:text-indigo-500">Book Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-500">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-indigo-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-500">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h4 className="font-semibold text-xl mb-4">Contact Information</h4>
            <p className="text-black text-sm">
              <strong>Email:</strong> support@counselingplatform.com
            </p>
            <p className="text-black text-sm">
              <strong>Phone:</strong> +123-456-7890
            </p>
            <p className="text-black text-sm">
              <strong>Address:</strong> 123 Wellness St, City, Country
            </p>
          </div>

          {/* Social Media Links */}
          <div className="social-media">
            <h4 className="font-semibold text-xl mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500">
                <FaFacebookF size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="newsletter mt-8 text-center">
          <h4 className="font-semibold text-xl mb-4">Subscribe to Our Newsletter</h4>
          <p className="text-black mb-4">
            Stay updated with our latest news and services. Enter your email below to subscribe:
          </p>
          <div className="flex justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="py-2 px-4 rounded-l-lg border border-gray-600  text-gray-900 placeholder-gray-400"
            />
            <button className="py-2 px-6 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-black text-sm">
        <p>&copy; {new Date().getFullYear()} Counseling Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;