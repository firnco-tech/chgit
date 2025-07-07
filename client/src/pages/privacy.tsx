import { SEO } from '@/components/SEO';
import { getCurrentLanguage } from '@/lib/i18n';

export default function Privacy() {
  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <SEO 
        page="about"
        customTitle="Privacy Policy | HolaCupid"
        customDescription="Learn about how HolaCupid protects your privacy and handles your personal information. Our comprehensive privacy policy explains data collection, usage, and protection measures."
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-6">
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Create an account or submit a profile</li>
                  <li>Make a purchase or transaction</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our communications</li>
                </ul>
                <p className="text-gray-700 mb-8">
                  This may include your name, email address, phone number, photos, and other profile information.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-6">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-6">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>With your consent or at your direction</li>
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
                <p className="text-gray-700 mb-8">
                  We do not sell your personal information to third parties.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-8">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
                <p className="text-gray-700 mb-6">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy, please contact us at:
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