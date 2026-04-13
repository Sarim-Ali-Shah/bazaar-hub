import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} BazaarHub. All rights reserved. | Built with React & Tailwind CSS.
      </div>
    </footer>
  );
};

export default Footer;