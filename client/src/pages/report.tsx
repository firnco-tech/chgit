import { SEO } from '@/components/SEO';
import { getCurrentLanguage } from '@/lib/i18n';
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
  const currentLanguage = getCurrentLanguage();
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
    { value: 'harassment', label: 'Harassment or Threats', icon: AlertTriangle },
    { value: 'inappropriate', label: 'Inappropriate Content', icon: FileText },
    { value: 'fake', label: 'Fake Profile', icon: Shield },
    { value: 'scam', label: 'Scam or Fraud', icon: AlertTriangle },
    { value: 'safety', label: 'Safety Concern', icon: Shield },
    { value: 'technical', label: 'Technical Issue', icon: Bug },
    { value: 'payment', label: 'Payment Problem', icon: Bug },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  return (
    <>
      <SEO 
        page="about"
        customTitle="Report an Issue | HolaCupid"
        customDescription="Report inappropriate behavior, safety concerns, or technical issues on HolaCupid. Our team reviews all reports within 24 hours."
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Report an Issue</h1>
              <p className="text-gray-600 max-w-2xl">
                Help us maintain a safe and respectful community. Report any inappropriate behavior, safety concerns, or technical issues.
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
                      {type.value === 'harassment' && 'Report harassment, threats, or inappropriate messages'}
                      {type.value === 'inappropriate' && 'Report inappropriate photos or profile content'}
                      {type.value === 'fake' && 'Report fake profiles or stolen photos'}
                      {type.value === 'scam' && 'Report scam attempts or fraudulent behavior'}
                      {type.value === 'safety' && 'Report safety threats or suspicious activity'}
                      {type.value === 'technical' && 'Report website bugs or technical issues'}
                      {type.value === 'payment' && 'Report payment issues or billing problems'}
                      {type.value === 'other' && 'Report other concerns or issues'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Report Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Report</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">
                      Type of Report *
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
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
                      Profile ID or Name (if applicable)
                    </Label>
                    <Input
                      id="profileId"
                      value={formData.profileId}
                      onChange={(e) => setFormData({...formData, profileId: e.target.value})}
                      placeholder="If reporting about a specific profile, provide the profile ID or name"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If reporting about a specific profile, please provide the profile ID or name
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Please provide details about the issue you're reporting..."
                      rows={5}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="evidence" className="text-sm font-medium">
                      Additional Evidence
                    </Label>
                    <Input
                      id="evidence"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={(e) => setFormData({...formData, evidence: e.target.files?.[0] || null})}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload screenshots or documents that support your report
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) => setFormData({...formData, anonymous: checked as boolean})}
                    />
                    <Label htmlFor="anonymous" className="text-sm">
                      Submit this report anonymously
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Your Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="We'll use this to follow up on your report"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Submit Report
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    All reports are reviewed by our team. False reports may result in account restrictions.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>What happens after you report?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-600 font-bold">1</span>
                    </div>
                    <p className="text-sm font-medium mb-1">We receive and review your report within 24 hours</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-600 font-bold">2</span>
                    </div>
                    <p className="text-sm font-medium mb-1">Our team investigates the reported issue or behavior</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-600 font-bold">3</span>
                    </div>
                    <p className="text-sm font-medium mb-1">We take appropriate action based on our findings</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-600 font-bold">4</span>
                    </div>
                    <p className="text-sm font-medium mb-1">You receive a follow-up email about the resolution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="mt-8 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Situations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">
                  If you are in immediate danger or experiencing an emergency, please contact local emergency services (911) immediately. This form is for non-emergency reports only.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}