import { SEO } from '@/components/SEO';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, FileText, Bug } from 'lucide-react';

export default function Report() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: '',
    profileId: '',
    description: '',
    email: '',
    anonymous: false,
    evidence: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Report submitted:', formData);
  };

  const reportTypes = [
    { value: 'harassment', label: t.reportTypes.harassment, icon: AlertTriangle },
    { value: 'inappropriate', label: t.reportTypes.inappropriate, icon: FileText },
    { value: 'fake', label: t.reportTypes.fake, icon: Shield },
    { value: 'scam', label: t.reportTypes.scam, icon: AlertTriangle },
    { value: 'safety', label: t.reportTypes.safety, icon: Shield },
    { value: 'technical', label: t.reportTypes.technical, icon: Bug },
    { value: 'payment', label: t.reportTypes.payment, icon: Bug },
    { value: 'other', label: t.reportTypes.other, icon: FileText }
  ];

  return (
    <>
      <SEO 
        page="about"
        customTitle={t.reportPageTitle}
        customDescription={t.reportPageDescription}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.reportAnIssue}</h1>
              <p className="text-gray-600 max-w-2xl">
                {t.reportSubtitle}
              </p>
            </div>

            {/* Report Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {reportTypes.map((type) => (
                <Card key={type.value} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <type.icon className="w-5 h-5 text-pink-500" />
                      <CardTitle className="text-base font-medium">{type.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {t.reportDescriptions[type.value as keyof typeof t.reportDescriptions]}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Report Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t.submitReport}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">
                      {t.typeOfReport}
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectReportType} />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="profileId" className="text-sm font-medium">
                      {t.profileIdOrName}
                    </Label>
                    <Input
                      id="profileId"
                      value={formData.profileId}
                      onChange={(e) => setFormData({...formData, profileId: e.target.value})}
                      placeholder={t.profileIdPlaceholder}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t.profileIdHelp}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      {t.descriptionLabel}
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={t.descriptionPlaceholder}
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="evidence" className="text-sm font-medium">
                      {t.additionalEvidence}
                    </Label>
                    <Input
                      id="evidence"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t.evidenceHelp}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) => setFormData({...formData, anonymous: checked as boolean})}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      {t.submitAnonymously}
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t.yourEmailAddress}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={t.emailPlaceholder}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    {t.submitReportButton}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    {t.falseReportsWarning}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t.whatHappensNext}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {t.processSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-pink-600 font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="mt-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {t.emergencySituations}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  {t.emergencyNotice}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}