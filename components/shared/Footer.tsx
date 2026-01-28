import {
  LandingFooter,
  LandingFooterColumn,
  LandingFooterLink,
} from '@/components/landing';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = ({ className }: { className?: string }) => {
  return (
    <LandingFooter
      className={className}
      title="OmniCart AI"
      description="AI-powered autonomous e-commerce optimization"
      withBackground
      withBackgroundGlow={false}
      variant="primary"
      backgroundGlowVariant="primary"
      withBackgroundGradient
      logoComponent={
        <div className="flex items-center">
          <Image
            src="/static/images/omnicart-logo.jpg"
            alt="OmniCart AI logo"
            width={160}
            height={48}
            className="h-10 w-auto rounded-lg object-contain"
          />
        </div>
      }
    >
      <LandingFooterColumn title="Product">
        <LandingFooterLink href="/features">{'Features'}</LandingFooterLink>
        <LandingFooterLink href="/pricing">{'Pricing'}</LandingFooterLink>
        <LandingFooterLink href="/security">{'Security'}</LandingFooterLink>
        <LandingFooterLink href="/faq">{'FAQ'}</LandingFooterLink>
      </LandingFooterColumn>
      <LandingFooterColumn title="Company">
        <LandingFooterLink href="/about">{'About Us'}</LandingFooterLink>
        <LandingFooterLink href="/careers">{'Careers'}</LandingFooterLink>
        <LandingFooterLink href="/press">{'Press'}</LandingFooterLink>
      </LandingFooterColumn>
      <LandingFooterColumn title="Support">
        <LandingFooterLink href="/help">{'Help Center'}</LandingFooterLink>
        <LandingFooterLink href="/contact">{'Contact Us'}</LandingFooterLink>
        <LandingFooterLink href="/status">{'System Status'}</LandingFooterLink>
      </LandingFooterColumn>
      <LandingFooterColumn title="Legal">
        <LandingFooterLink href="/terms">
          {'Terms of Service'}
        </LandingFooterLink>
        <LandingFooterLink href="/privacy">
          {'Privacy Policy'}
        </LandingFooterLink>
        <LandingFooterLink href="/cookies">{'Cookie Policy'}</LandingFooterLink>
      </LandingFooterColumn>
    </LandingFooter>
  );
};

export default Footer;
