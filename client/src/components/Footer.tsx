import { useTranslation } from '@/hooks/useTranslation';
import { getCurrentLanguage } from '@/lib/i18n';
import { Link } from 'wouter';

export function Footer() {
  const { t } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  return (
    <footer className="bg-slate-800 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="text-xl font-bold">HolaCupid</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connect with amazing people from the Dominican Republic. Safe, secure, and authentic connections.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href={`/${currentLanguage}/browse`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Browse Profiles
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}#how-it-works`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/submit-profile`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Submit Profile
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/help#faq`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href={`/${currentLanguage}/contact`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/help`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/safety`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/report`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Report Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href={`/${currentLanguage}/privacy`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/terms`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/cookies`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${currentLanguage}/disclaimer`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section with Contact Support Button */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-gray-400 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link 
              href={`/${currentLanguage}/contact`}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-400 text-sm">
            © 2024 HolaCupid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}