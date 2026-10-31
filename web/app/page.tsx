import React from 'react';
import { LandingNavbar } from '@/components/landing/navbar';
import { LandingHero } from '@/components/landing/hero';
import { LandingFeatures } from '@/components/landing/features';
import { LandingHowItWorks } from '@/components/landing/how-it-works';
import { LandingBenefits } from '@/components/landing/benefits';
import { LandingAbout } from '@/components/landing/about';
import { LandingCTA } from '@/components/landing/cta';
import { LandingFooter } from '@/components/landing/footer';

export const metadata = {
  title: 'Brightloop — Subscription Management System',
  description:
    'Manage your subscriptions, recurring billing, invoices, customers, and payments in one clear platform.',
};

export default function HomePage() {
  return (
    <div
      id="top"
      className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans selection:bg-[#C8E63C] selection:text-[#0F172A] scroll-smooth"
    >
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingBenefits />
        <LandingAbout />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
