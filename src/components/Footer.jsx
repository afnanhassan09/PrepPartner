import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#09363E] text-teal-foreground py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4 hover:text-primary transition-colors duration-300">PrepPartner</h3>
          <p className="max-w-md hover:text-primary-foreground transition-colors duration-300">Your trusted partner in interview preparation. Join thousands of successful candidates who have achieved their career goals with PrepPartner.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {['About Us', 'Pricing', 'Resources', 'Contact'].map((link) => (
              <li key={link}>
                <a 
                  href="#" 
                  className="hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block transform"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2">
            {[
              'support@preppartner.com',
              '1-800-PREP-NOW',
              '123 Interview Street',
              'Success City, SC 12345'
            ].map((item) => (
              <li 
                key={item}
                className="hover:text-primary-foreground transition-colors duration-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-teal-foreground/20">
        <p className="text-center hover:text-primary-foreground transition-colors duration-300">
          &copy; 2024 PrepPartner. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer