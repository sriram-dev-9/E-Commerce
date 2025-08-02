"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline text-primary mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our products or need support? We're here to help! 
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-headline mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-muted-foreground mb-2">Send us an email and we'll respond within 24 hours</p>
                  <a 
                    href="mailto:support@andramrut.in" 
                    className="text-primary hover:underline font-medium"
                  >
                    support@andramrut.in
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-muted-foreground mb-2">Speak directly with our customer support team</p>
                  <a 
                    href="tel:+916300427273" 
                    className="text-primary hover:underline font-medium"
                  >
                    +91 6300 427 273
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    AndrAmrut Naturals<br/>
                    Food Processing Unit<br/>
                    Andhra Pradesh, India
                  </p>
                </div>
              </div>
            </div>

            {/* FSSAI License Info */}
            <div className="mt-8 p-4 bg-card rounded-lg border">
              <h3 className="font-semibold mb-2">Food Safety Certification</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We are FSSAI licensed and certified for food safety standards
              </p>
              <p className="text-sm font-medium">
                FSSAI License No: 20125091000421
              </p>
            </div>
          </div>

          {/* Additional Contact Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>More Ways to Reach Us</CardTitle>
                <CardDescription>
                  Contact us directly through phone or email for immediate assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-muted-foreground mb-3">
                      Send us your queries and we'll respond within 24 hours
                    </p>
                    <a 
                      href="mailto:support@andramrut.in" 
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Email Us
                    </a>
                  </div>
                  
                  <div className="text-center p-6 bg-primary/5 rounded-lg">
                    <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Phone Support</h3>
                    <p className="text-muted-foreground mb-3">
                      Call us directly during business hours for immediate help
                    </p>
                    <a 
                      href="tel:+916300427273" 
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-headline text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I get order updates?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You'll receive order updates directly on your email or phone number 
                  that you provided during checkout.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What are your shipping charges?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer free shipping on orders above ₹500. For orders below ₹500, 
                  shipping charges apply based on your location.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you ship internationally?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Currently, we only ship within India. We're working on expanding 
                  our international shipping soon.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is your return policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Currently, we do not have a return policy in place. Please contact us 
                  if you have any issues with your order.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
