import { Link } from "wouter";
import { MessageCircle, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from '@/components/SEO';
import { useTranslation } from '@/hooks/useTranslation';

export default function Help() {
  const { t, currentLanguage } = useTranslation();
  
  return (
    <>
      <SEO 
        page="about"
        customTitle={t.helpPageTitle}
        customDescription={t.helpPageDescription}
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link href={`/${currentLanguage}/contact`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-pink-600 group-hover:text-pink-700" />
                  <CardTitle className="text-xl group-hover:text-pink-700">{t.contactSupport}</CardTitle>
                  <CardDescription>{t.contactSupportDesc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href={`/${currentLanguage}/safety`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <Shield className="h-12 w-12 mx-auto text-green-600 group-hover:text-green-700" />
                  <CardTitle className="text-xl group-hover:text-green-700">{t.safetyTips}</CardTitle>
                  <CardDescription>{t.safetyTipsDesc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href={`/${currentLanguage}/report`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto text-orange-600 group-hover:text-orange-700" />
                  <CardTitle className="text-xl group-hover:text-orange-700">{t.reportIssue}</CardTitle>
                  <CardDescription>{t.reportIssueDesc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

        {/* Browse by Category */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.browseByCategory}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Getting Started */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t.gettingStarted}</CardTitle>
                <CardDescription>{t.gettingStartedDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.gettingStartedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{item}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payments & Billing */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t.paymentsBilling}</CardTitle>
                <CardDescription>{t.paymentsBillingDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.paymentsBillingItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{item}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Safety & Security */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t.safetySecurity}</CardTitle>
                <CardDescription>{t.safetySecurityDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.safetySecurityItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{item}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Profile Management */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{t.profileManagement}</CardTitle>
                <CardDescription>{t.profileManagementDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.profileManagementItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-gray-700">{item}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t.faqSection}</h2>
          
          <div className="space-y-6">
            {t.faqQuestions.map((faq, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.stillNeedHelp}</h3>
          <p className="text-gray-700 mb-6">
            {t.stillNeedHelpDesc}
          </p>
          <Link href={`/${currentLanguage}/contact`}>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-8 rounded-md">
              {t.contactSupport}
            </Button>
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}