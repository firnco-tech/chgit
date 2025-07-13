import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEO, { structuredDataSchemas } from "@/components/SEO";
import { useTranslation } from '@/hooks/useTranslation';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const contactSchema = z.object({
    fullName: z.string().min(2, t.formValidationName),
    email: z.string().email(t.formValidationEmail),
    subject: z.string().min(1, t.formValidationSubject),
    message: z.string().min(10, t.formValidationMessage),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t.messageSentTitle,
        description: t.messageSentDescription,
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: t.messageErrorTitle,
        description: t.messageErrorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid md:grid-cols-2 gap-12">
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
                  <h4 className="font-medium text-gray-900 mb-2">{t.howToSubmitProfile}</h4>
                  <p className="text-gray-700">{t.howToSubmitProfileAnswer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.sendUsMessage}</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">{t.fullNameLabel}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t.fullNamePlaceholder}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">{t.emailAddressLabel}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder={t.emailAddressPlaceholder}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">{t.subjectLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder={t.subjectPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">{t.subjectGeneral}</SelectItem>
                          <SelectItem value="technical">{t.subjectTechnical}</SelectItem>
                          <SelectItem value="billing">{t.subjectBilling}</SelectItem>
                          <SelectItem value="profile">{t.subjectProfile}</SelectItem>
                          <SelectItem value="verification">{t.subjectVerification}</SelectItem>
                          <SelectItem value="report">{t.subjectReport}</SelectItem>
                          <SelectItem value="partnership">{t.subjectPartnership}</SelectItem>
                          <SelectItem value="other">{t.subjectOther}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">{t.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={t.messagePlaceholder}
                          className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  {isSubmitting ? t.sendingButton : t.sendMessageButton}
                </Button>
              </form>
            </Form>
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