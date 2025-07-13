import { SEO } from '@/components/SEO';
import { useTranslation } from '@/hooks/useTranslation';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        page="about"
        customTitle={t.termsPageTitle}
        customDescription={t.termsPageDescription}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.termsOfServiceTitle}</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.acceptanceOfTerms}</h2>
                <p className="text-gray-700 mb-8">
                  {t.acceptanceOfTermsText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.serviceDescription}</h2>
                <p className="text-gray-700 mb-8">
                  {t.serviceDescriptionText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.userResponsibilities}</h2>
                <p className="text-gray-700 mb-6">
                  {t.userResponsibilitiesText}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  {t.userResponsibilitiesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.paymentAndRefunds}</h2>
                <p className="text-gray-700 mb-8">
                  {t.paymentAndRefundsText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.profileSubmission}</h2>
                <p className="text-gray-700 mb-8">
                  {t.profileSubmissionText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.prohibitedActivities}</h2>
                <p className="text-gray-700 mb-6">
                  {t.prohibitedActivitiesText}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  {t.prohibitedActivitiesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.limitationOfLiability}</h2>
                <p className="text-gray-700 mb-8">
                  {t.limitationOfLiabilityText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.termination}</h2>
                <p className="text-gray-700 mb-8">
                  {t.terminationText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.termsContactInformation}</h2>
                <p className="text-gray-700 mb-4">
                  {t.termsContactInformationText}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>{t.emailLabel}</strong> admin@holacupid.com
                  </p>
                  <p className="text-gray-700">
                    <strong>{t.addressLabel}</strong> {t.companyAddress}
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