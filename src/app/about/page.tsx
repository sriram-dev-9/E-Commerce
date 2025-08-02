"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Heart, Award, Users, Truck, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-headline text-primary mb-6">About AndrAmrut Naturals</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Every Taste Has A Story - We're passionate about bringing authentic Indian regional flavors 
          to your kitchen, preserving traditional recipes while ensuring the highest quality standards.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-headline mb-6 text-primary">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              AndrAmrut Naturals was born from a deep love for authentic Indian cuisine and 
              a desire to share the rich culinary heritage of Andhra Pradesh with food lovers everywhere.
            </p>
            <p>
              Our journey began in traditional kitchens where age-old recipes were passed down 
              through generations. We recognized that in today's fast-paced world, many people 
              were losing touch with these authentic flavors and traditional cooking methods.
            </p>
            <p>
              Today, we carefully source the finest ingredients from local farmers and artisans, 
              ensuring that every product carries the essence of traditional Indian cooking 
              while meeting modern quality and safety standards.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="bg-primary/10 rounded-lg p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
              <p className="text-muted-foreground">
                Every product is crafted with passion and attention to detail, 
                just like it would be made in a traditional Indian home.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-headline text-center mb-12 text-primary">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Authenticity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                We preserve traditional recipes and cooking methods, ensuring every bite 
                delivers the authentic taste of regional Indian cuisine.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                FSSAI licensed and certified, we maintain the highest standards of 
                food safety and quality in all our products.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                We support local farmers and artisans, creating a sustainable 
                ecosystem that benefits everyone in our supply chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What We Offer */}
      <div className="mb-20">
        <h2 className="text-3xl font-headline text-center mb-12 text-primary">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  🥒
                </div>
                Traditional Pickles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Handcrafted pickles made with traditional recipes, using the finest 
                vegetables and authentic spice blends from Andhra Pradesh.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  🌶️
                </div>
                Authentic Spices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Premium quality spices sourced directly from farmers, ground fresh 
                to preserve their natural aroma and flavor.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  🏺
                </div>
                Pantry Essentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Essential ingredients for Indian cooking, from traditional oils 
                to specialty flours and grains.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  🎁
                </div>
                Gift Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Curated gift sets perfect for sharing the joy of authentic 
                Indian flavors with friends and family.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Commitment */}
      <div className="bg-primary/5 rounded-lg p-8 mb-20">
        <div className="text-center">
          <h2 className="text-3xl font-headline mb-6 text-primary">Our Commitment</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">FSSAI Certified</h3>
              <p className="text-sm text-muted-foreground">
                License No: 20125091000421
              </p>
            </div>
            <div className="text-center">
              <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Fresh Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Quick and careful packaging to preserve freshness
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customer First</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated support for all your culinary needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-headline mb-4 text-primary">Get in Touch</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have questions about our products or want to learn more about our story? 
          We'd love to hear from you!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@andramrut.in"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Email Us
          </a>
          <a
            href="tel:+916300427273"
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
