import { SEO } from '@/components/SEO';
import { useTranslation } from '@/hooks/useTranslation';

export default function Cookies() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        page="about"
        customTitle={t.cookiePageTitle}
        customDescription={t.cookiePageDescription}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.cookiePolicyTitle}</h1>
              
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.whatAreCookies}</h2>
                <p className="text-gray-700 mb-8">
                  {t.whatAreCookiesText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.howWeUseCookies}</h2>
                <p className="text-gray-700 mb-6">
                  {t.howWeUseCookiesText}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
                  {t.howWeUseCookiesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.typesOfCookies}</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">{t.sessionCookies}</h3>
                <p className="text-gray-700 mb-6">
                  {t.sessionCookiesText}
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">{t.persistentCookies}</h3>
                <p className="text-gray-700 mb-6">
                  {t.persistentCookiesText}
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mb-3">{t.thirdPartyCookies}</h3>
                <p className="text-gray-700 mb-8">
                  {t.thirdPartyCookiesText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.managingCookies}</h2>
                <p className="text-gray-700 mb-6">
                  {t.managingCookiesText}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {t.managingCookiesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mb-8">
                  {t.managingCookiesNote}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.thirdPartyServices}</h2>
                <p className="text-gray-700 mb-6">
                  {t.thirdPartyServicesText}
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  {t.thirdPartyServicesList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 mb-8">
                  {t.thirdPartyServicesNote}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.updatesToPolicy}</h2>
                <p className="text-gray-700 mb-8">
                  {t.updatesToPolicyText}
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t.cookieContactUs}</h2>
                <p className="text-gray-700 mb-4">
                  {t.cookieContactUsText}
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