// @ts-nocheck

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { LandingHeaderMenuItem } from '@/components/landing';
import { LandingPrimaryImageCtaSection } from '@/components/landing';
import { LandingSocialProof } from '@/components/landing';
import { LandingFeatureList } from '@/components/landing';
import { LandingProductSteps } from '@/components/landing';
import { LandingProductFeature } from '@/components/landing';
import { LandingTestimonialReadMoreWrapper } from '@/components/landing';
import { LandingTestimonialGrid } from '@/components/landing';
import { LandingSaleCtaSection } from '@/components/landing';
import { LandingFaqCollapsibleSection } from '@/components/landing';
import { LandingFooter } from '@/components/landing';
import { LandingFooterColumn } from '@/components/landing';
import { LandingFooterLink } from '@/components/landing';
import Image from 'next/image';
import { Button } from '@/components/shared/ui/button';
import Link from 'next/link';
import {
  Bot,
  Brain,
  LineChart,
  Package,
  Shield,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function Page() {
  return (
    <>
      <Header className="mb-4" />

      <LandingPrimaryImageCtaSection
        title="Autonomous AI for E-Commerce Excellence"
        description="Future-proof your online store with OmniCart_AI. Intelligent automation that optimizes inventory, pricing, and customer experience 24/7."
        imageSrc=""
        imageAlt="OmniCart_AI Dashboard"
        imagePosition="right"
        imageShadow="hard"
        textPosition="left"
        withBackground={false}
        variant="primary"
        minHeight={350}
      >
        <Button size="xl" asChild>
          <Link href="/dashboard">Launch Dashboard</Link>
        </Button>
        <Button size="xl" variant="outlinePrimary" asChild>
          <Link href="/pricing">View Pricing</Link>
        </Button>
        <LandingSocialProof
          className="mt-6 w-full"
          avatarItems={[
            {
              imageSrc: '',
              name: 'E-Commerce Director',
            },
            {
              imageSrc: '',
              name: 'Store Owner',
            },
            {
              imageSrc: '',
              name: 'Operations Lead',
            },
          ]}
          numberOfUsers={2500}
          suffixText="stores optimized"
        />
      </LandingPrimaryImageCtaSection>

      <LandingFeatureList
        id="features"
        title="AI-Powered E-Commerce Automation"
        description="Harness the power of autonomous AI agents to transform your online business operations."
        featureItems={[
          {
            title: 'Intelligent Inventory Management',
            description:
              'AI agents predict demand, automate reordering, and optimize stock levels across all channels. Never miss a sale due to stockouts again.',
            icon: <Package className="w-8 h-8" />,
          },
          {
            title: 'Dynamic Pricing Optimization',
            description:
              'Real-time price adjustments based on market conditions, competitor analysis, and demand signals. Maximize margins while staying competitive.',
            icon: <TrendingUp className="w-8 h-8" />,
          },
          {
            title: 'Autonomous Customer Experience',
            description:
              'AI-driven personalization, smart recommendations, and proactive support that delights customers and drives conversions.',
            icon: <Sparkles className="w-8 h-8" />,
          },
          {
            title: 'Predictive Analytics Engine',
            description:
              'Advanced machine learning models forecast trends, identify opportunities, and surface actionable insights before your competitors.',
            icon: <Brain className="w-8 h-8" />,
          },
          {
            title: 'Multi-Channel Orchestration',
            description:
              'Seamlessly manage your presence across marketplaces, social commerce, and your own store from a unified AI command center.',
            icon: <ShoppingCart className="w-8 h-8" />,
          },
          {
            title: 'Enterprise-Grade Security',
            description:
              'SOC 2 compliant infrastructure with end-to-end encryption. Your business data is protected with military-grade security protocols.',
            icon: <Shield className="w-8 h-8" />,
          },
        ]}
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
      />

      <LandingProductSteps
        title="Deploy AI Agents in Minutes"
        description="Get your autonomous e-commerce optimization running with three simple steps. No coding required."
        display="grid"
        withBackground={false}
        variant="primary"
      >
        <LandingProductFeature
          title="1. Connect Your Store"
          description="Integrate with Shopify, WooCommerce, Magento, or any major e-commerce platform. Our secure APIs sync your data instantly."
          imageSrc=""
          imageAlt="Store connection"
          imagePosition="center"
          imageShadow="soft"
          zoomOnHover
          minHeight={350}
          withBackground={false}
          withBackgroundGlow={false}
          variant="primary"
          backgroundGlowVariant="primary"
        />
        <LandingProductFeature
          title="2. Configure AI Agents"
          description="Select which autonomous agents to deploy: inventory, pricing, customer experience, or all of them. Customize rules and guardrails to match your business."
          imageSrc=""
          imageAlt="AI agent configuration"
          imagePosition="center"
          imageShadow="soft"
          zoomOnHover
          minHeight={350}
          withBackground={false}
          withBackgroundGlow={false}
          variant="primary"
          backgroundGlowVariant="primary"
        />
        <LandingProductFeature
          title="3. Watch Revenue Grow"
          description="AI agents work 24/7 optimizing your operations. Monitor performance through real-time dashboards and detailed analytics reports."
          imageSrc=""
          imageAlt="Revenue growth"
          imagePosition="center"
          imageShadow="soft"
          zoomOnHover
          minHeight={350}
          withBackground={false}
          withBackgroundGlow={false}
          variant="primary"
          backgroundGlowVariant="primary"
        />
      </LandingProductSteps>

      <LandingProductFeature
        id="security"
        title="Enterprise Security & Compliance"
        descriptionComponent={
          <>
            <p className="mb-6">
              Built for enterprise requirements from day one. Your data and
              operations are protected by industry-leading security standards.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>SOC 2 Type II Certified: </strong>
                  Audited security controls and processes
                </span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>GDPR & CCPA Compliant: </strong>
                  Full regulatory compliance for global operations
                </span>
              </li>
              <li className="flex items-start">
                <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>99.99% Uptime SLA: </strong>
                  Enterprise reliability you can count on
                </span>
              </li>
            </ul>
          </>
        }
        imageSrc=""
        imageAlt="Security features"
        imagePosition="right"
        imageShadow="hard"
        textPosition="left"
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
        imagePerspective="bottom"
        zoomOnHover
        minHeight={350}
      />

      <LandingTestimonialReadMoreWrapper>
        <LandingTestimonialGrid
          title="Trusted by Leading E-Commerce Brands"
          description="See how businesses are transforming their operations with OmniCart_AI autonomous optimization."
          testimonialItems={[
            {
              name: 'Jennifer Walsh',
              text: 'OmniCart_AI reduced our stockouts by 73% in the first month. The AI inventory agents are incredibly accurate at predicting demand.',
              handle: '@jwalshecom',
              imageSrc: '',
              url: '#',
              verified: true,
            },
            {
              name: 'Marcus Chen',
              text: 'The dynamic pricing engine increased our margins by 18% without losing competitiveness. It adapts faster than any human team could.',
              handle: '@marcuschen',
              imageSrc: '',
              url: '#',
              verified: true,
            },
            {
              name: 'Sofia Rodriguez',
              text: 'We went from spending hours on manual optimization to letting AI agents handle everything. Our team now focuses on strategy instead of operations.',
              handle: '@sofiarodriguez',
              imageSrc: '',
              url: '#',
            },
            {
              name: 'David Park',
              text: 'The multi-channel orchestration is a game changer. Managing inventory across Amazon, Shopify, and our website used to be chaos. Now it runs itself.',
              handle: '@davidpark',
              imageSrc: '',
              url: '#',
              verified: true,
            },
            {
              name: 'Rachel Thompson',
              text: 'Customer satisfaction scores jumped 34% after deploying the AI customer experience agents. Personalization at scale actually works now.',
              handle: '@rachelthompson',
              imageSrc: '',
              url: '#',
            },
            {
              name: 'Alex Kumar',
              text: 'As a CTO, the enterprise security and compliance features gave me confidence to deploy across our entire operation. SOC 2 compliance was critical for us.',
              handle: '@alexkumar',
              imageSrc: '',
              url: '#',
              verified: true,
            },
            {
              name: 'Emily Foster',
              text: 'OmniCart_AI predictive analytics identified a trend shift two weeks before our analysts did. That early warning saved our Q4 planning.',
              handle: '@emilyfoster',
              imageSrc: '',
              url: '#',
            },
            {
              name: 'Michael Santos',
              text: 'ROI was positive within 6 weeks. The autonomous agents pay for themselves many times over through optimization gains.',
              handle: '@michaelsantos',
              imageSrc: '',
              url: '#',
              verified: true,
            },
            {
              name: 'Lisa Chang',
              text: 'Integration was seamless. Connected our Shopify Plus store in under an hour and AI agents were optimizing by end of day. Incredible onboarding.',
              handle: '@lisachang',
              imageSrc: '',
              url: '#',
            },
          ]}
          withBackground={false}
          variant="primary"
        />
      </LandingTestimonialReadMoreWrapper>

      <LandingSaleCtaSection
        id="pricing"
        title="Pricing That Scales With You"
        description="From growing startups to enterprise retailers. Plans designed for every stage of e-commerce growth."
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
      >
        <Button size="xl" asChild>
          <Link href="/pricing">View Plans</Link>
        </Button>
      </LandingSaleCtaSection>

      <LandingFaqCollapsibleSection
        id="faq"
        title="Frequently Asked Questions"
        description="Everything you need to know about deploying autonomous AI for your e-commerce operations."
        faqItems={[
          {
            question: 'What platforms does OmniCart_AI integrate with?',
            answer:
              'OmniCart_AI integrates with all major e-commerce platforms including Shopify, Shopify Plus, WooCommerce, Magento, BigCommerce, and custom solutions via our REST API. We also connect with marketplaces like Amazon, eBay, and Walmart.',
          },
          {
            question: 'How do the AI agents make decisions?',
            answer:
              'Our AI agents use advanced machine learning models trained on e-commerce data. You set the rules and guardrails, and agents operate autonomously within those boundaries. All decisions are logged and explainable, and you can override or adjust at any time.',
          },
          {
            question: 'Is my business data secure?',
            answer:
              'Absolutely. OmniCart_AI is SOC 2 Type II certified with end-to-end encryption. We never sell or share your data. Our infrastructure runs on enterprise-grade cloud providers with 99.99% uptime SLA.',
          },
          {
            question: 'How quickly can I see results?',
            answer:
              'Most customers see measurable improvements within the first two weeks. Inventory optimization and pricing adjustments begin immediately after deployment. Full AI model training for your specific business typically completes within 30 days.',
          },
          {
            question: 'Do I need technical expertise to use OmniCart_AI?',
            answer:
              'No coding or technical expertise required. Our platform is designed for business users with intuitive interfaces and guided setup. For custom integrations, our team provides full implementation support.',
          },
          {
            question: 'What kind of support is available?',
            answer:
              'All plans include email support. Growth and Enterprise plans include dedicated success managers, priority support, and custom onboarding. Enterprise customers get 24/7 phone support and SLA guarantees.',
          },
        ]}
        withBackground={false}
        withBackgroundGlow={false}
        variant="primary"
        backgroundGlowVariant="primary"
      />

      <LandingSaleCtaSection
        title="Ready to Deploy Autonomous AI?"
        description="Join thousands of e-commerce businesses optimizing with OmniCart_AI. Start your free trial today."
        withBackground
        withBackgroundGlow
        variant="primary"
        backgroundGlowVariant="primary"
      >
        <Button size="xl" asChild>
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </LandingSaleCtaSection>

      <Footer className="mt-8" />
    </>
  );
}
