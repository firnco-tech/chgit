import { Mail, MapPin, Clock } from "lucide-react";
import SEO, { structuredDataSchemas } from "@/components/SEO";
import { useTranslation } from '@/hooks/useTranslation';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <SEO 
        page="contact" 
        customTitle={t.contactPageTitle}
        customDescription={t.contactPageDescription}
        structuredData={structuredDataSchemas.website}
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.contactPageTitle}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.contactPageDescription}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 text-pink-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{t.contactAddress}</h3>
              </div>
              <div className="text-gray-700">
                <p className="font-medium">HolaCupid LLC.</p>
                <p>30 N GOULD ST STE R</p>
                <p>SHERIDAN, WY 82801</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-pink-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{t.contactEmail}</h3>
              </div>
              <a href="mailto:admin@holacupid.com" className="text-pink-600 hover:text-pink-700 font-medium">
                admin@holacupid.com
              </a>
            </div>

            {/* Response Time */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-pink-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">{t.contactResponseTime}</h3>
              </div>
              <p className="text-gray-700">{t.responseTimeText}</p>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.commonQuestions}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t.howToPurchase}</h4>
                  <p className="text-gray-700">{t.howToPurchaseAnswer}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t.areProfilesVerified}</h4>
                  <p className="text-gray-700">{t.areProfilesVerifiedAnswer}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t.replacementContactInfo}</h4>
                  <p className="text-gray-700">{t.replacementContactInfoAnswer}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t.refundIncorrectInfo}</h4>
                  <p className="text-gray-700">{t.refundIncorrectInfoAnswer}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{t.currentContactInfo}</h4>
                  <p className="text-gray-700">{t.currentContactInfoAnswer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            {t.copyrightText}
          </p>
          <p className="text-gray-600 mt-1">
            {t.allRightsReserved}
          </p>
        </div>
      </div>
    </div>
  );
}