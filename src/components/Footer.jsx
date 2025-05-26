import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Social media links
  const socialLinks = [
    { name: 'Twitter', icon: 'X', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'in', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: 'Ig', url: 'https://instagram.com' },
    { name: 'GitHub', icon: 'Gh', url: 'https://github.com' }
  ];
  
  // Navigation links for footer
  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ];
  
  return (
    <footer id="contact" className="bg-white transparent py-4 text-black border-t border-gray-800">
      <div className="container-custom py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <motion.h3 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              afinity
            </motion.h3>
            <motion.p 
              className="text-gray-400 mb-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Pioneering AI solutions for a smarter, more connected world.
            </motion.p>
            
            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-white hover:bg-green-200/80 hover:text-black transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <motion.h4 
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Quick Links
            </motion.h4>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <motion.h4 
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Contact Us
            </motion.h4>
            <motion.address 
              className="text-gray-400 not-italic space-y-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <p>123 AI Boulevard</p>
              <p>San Francisco, CA 94103</p>
              <p className="mt-4">
                <a href="mailto:info@afinity.ai" className="hover:text-white">info@afinity.ai</a>
              </p>
              <p>
                <a href="tel:+1-555-123-4567" className="hover:text-white">+1 (555) 123-4567</a>
              </p>
            </motion.address>
          </div>
          
          {/* Newsletter */}
          <div>
            <motion.h4 
              className="text-xl font-semibold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              Stay Updated
            </motion.h4>
            <motion.p 
              className="text-gray-400 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Subscribe to our newsletter for the latest updates.
            </motion.p>
            <motion.form 
              className="flex flex-col space-y-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onSubmit={(e) => e.preventDefault()}
            >
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-green-100 border border-green-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <motion.button 
                type="submit"
                
                className="bg-green-500 text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
        
        {/* Copyright */}
        <motion.div 
          className="border-t-2 border-green-800 mt-8 pt-6 text-center text-black-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p>&copy; {currentYear} Afinity AI. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;