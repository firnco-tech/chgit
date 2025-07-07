import { SEO } from '@/components/SEO';
import { getCurrentLanguage } from '@/lib/i18n';

export default function Terms() {
  const currentLanguage = getCurrentLanguage();

  return (
    <>
      <SEO 
        page="about"
        customTitle="Terms of Service | HolaCupid"
        customDescription="Read HolaCupid's Terms of Service to understand your rights and responsibilities when using our Dominican dating platform."
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-8">
                  By accessing and using HolaCupid, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h2>
                <p className="text-gray-700 mb-8">
                  HolaCupid is a platform that allows users to browse verified profiles and purchase contact information for the purpose of making connections. We are not a dating service but rather an e-commerce platform for contact information.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
                <p className="text-gray-700 mb-6">
                  Users agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Use the service for lawful purposes only</li>
                  <li>Respect the privacy and rights of others</li>
                  <li>Not engage in harassment or inappropriate behavior</li>
                  <li>Not attempt to circumvent our verification processes</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment and Refunds</h2>
                <p className="text-gray-700 mb-8">
                  All purchases are final. Contact information is delivered immediately upon successful payment. Refunds may be considered in cases of technical errors or if contact information is proven to be invalid.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Profile Submission</h2>
                <p className="text-gray-700 mb-8">
                  By submitting a profile, you consent to having your contact information made available for purchase. You must be 18 years or older and have the right to share the information provided.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Prohibited Activities</h2>
                <p className="text-gray-700 mb-6">
                  Users may not:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  <li>Submit false or misleading information</li>
                  <li>Use the service for commercial solicitation</li>
                  <li>Attempt to hack or disrupt the service</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Harass or threaten other users</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-8">
                  HolaCupid is not responsible for the actions of users or the outcomes of connections made through our platform. We provide contact information as-is and make no guarantees about the success of any connections.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-8">
                  We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms of Service, contact us at:
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