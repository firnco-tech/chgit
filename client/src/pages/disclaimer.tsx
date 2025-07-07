import { SEO } from '@/components/SEO';
import { getCurrentLanguage } from '@/lib/i18n';

export default function Disclaimer() {
  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <SEO 
        page="about"
        customTitle="Disclaimer | HolaCupid"
        customDescription="Read HolaCupid's disclaimer to understand the limitations of our service and your responsibilities when using our platform."
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">General Disclaimer</h2>
                <p className="text-gray-700 mb-8">
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, HolaCupid excludes all representations, warranties, obligations, and liabilities arising out of or in connection with this website and its contents.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Nature</h2>
                <p className="text-gray-700 mb-8">
                  HolaCupid is an e-commerce platform that facilitates the purchase of contact information. We are not a dating service, matchmaking service, or relationship counseling service. We do not guarantee any outcomes from connections made through our platform.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Responsibility</h2>
                <p className="text-gray-700 mb-6">
                  Users are solely responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Verifying the accuracy of information provided</li>
                  <li>Their interactions with other users</li>
                  <li>Their personal safety when meeting others</li>
                  <li>Compliance with applicable laws and regulations</li>
                  <li>The consequences of their actions on and off the platform</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Guarantees</h2>
                <p className="text-gray-700 mb-6">
                  We make no guarantees regarding:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>The success of any connections or relationships</li>
                  <li>The accuracy of profile information</li>
                  <li>The availability or responsiveness of profile owners</li>
                  <li>The outcome of any interactions</li>
                  <li>Uninterrupted service availability</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Content</h2>
                <p className="text-gray-700 mb-8">
                  Our website may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Age Verification</h2>
                <p className="text-gray-700 mb-8">
                  While we require users to be 18 years or older and implement verification processes, we cannot guarantee the age or identity of all users. Users should exercise caution and verify information independently.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 mb-8">
                  To the maximum extent permitted by law, HolaCupid shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have questions about this disclaimer, please contact us at:
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