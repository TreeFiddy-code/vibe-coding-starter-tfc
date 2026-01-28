import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Security() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Enterprise-Grade Security
          </h1>

          <p className="mt-6 md:text-xl">
            At OmniCart AI, we understand that your e-commerce data is critical
            to your business. That's why we employ industry-leading security
            measures to protect your information. From encrypted API connections
            to secure data processing, your security is our top priority.
          </p>

          <p className="mt-6 md:text-xl">
            Our platform is SOC 2 Type II certified and GDPR compliant, ensuring
            your business meets global compliance requirements. Focus on growing
            your revenue with AI-powered optimization—knowing that security is
            built into every layer of our infrastructure.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
