import { SEO } from '@/components/SEO';
import { getCurrentLanguage } from '@/lib/i18n';

export default function Cookies() {
  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <SEO 
        page="about"
        customTitle="Cookie Policy | HolaCupid"
        customDescription="Learn about how HolaCupid uses cookies to enhance your browsing experience and provide personalized services."
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies?</h2>
                <p className="text-gray-700 mb-8">
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help websites remember information about your visit, which can make your next visit easier and the site more useful to you.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
                <p className="text-gray-700 mb-6">
                  We use cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Types of Cookies We Use</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Session Cookies</h3>
                <p className="text-gray-700 mb-6">
                  These are temporary cookies that expire when you close your browser. They help us maintain your session while you browse our site.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">Persistent Cookies</h3>
                <p className="text-gray-700 mb-6">
                  These cookies remain on your device for a set period or until you delete them. They help us remember your preferences for future visits.
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">Third-Party Cookies</h3>
                <p className="text-gray-700 mb-8">
                  Some cookies are placed by third-party services that appear on our pages, such as analytics providers.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
                <p className="text-gray-700 mb-6">
                  You can control and manage cookies in several ways:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Most browsers allow you to refuse cookies or delete existing cookies</li>
                  <li>You can set your browser to notify you when cookies are being used</li>
                  <li>You can disable cookies entirely, though this may affect website functionality</li>
                </ul>
                <p className="text-gray-700 mb-8">
                  Please note that disabling cookies may impact your experience on our website and limit certain features.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Services</h2>
                <p className="text-gray-700 mb-6">
                  We may use third-party services that also use cookies, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Google Analytics for website analytics</li>
                  <li>Payment processors for secure transactions</li>
                  <li>Social media platforms for sharing features</li>
                </ul>
                <p className="text-gray-700 mb-8">
                  These services have their own cookie policies, which we encourage you to review.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
                <p className="text-gray-700 mb-8">
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about our use of cookies, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> admin@holacupid.com
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> HolaCupid LLC, 30 N GOULD ST STE R, SHERIDAN, WY 82801
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}