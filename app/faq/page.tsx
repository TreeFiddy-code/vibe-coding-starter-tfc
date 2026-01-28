import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function FAQ() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Frequently Asked Questions
          </h1>

          <p className="mt-6 md:text-xl">
            Welcome to the OmniCart AI FAQ. Here you'll find answers to the most
            common questions about autonomous e-commerce optimization.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>How do I get started with OmniCart AI?</strong> Getting
            started is simple. Connect your e-commerce platform, configure your
            AI agents, and watch as they begin optimizing your operations
            automatically.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>Is my business data secure?</strong> Absolutely. We're SOC 2
            Type II certified with enterprise-grade encryption and strict data
            protection protocols.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>Which platforms does OmniCart AI support?</strong> We
            integrate with Shopify, WooCommerce, Magento, BigCommerce, and major
            marketplaces including Amazon, eBay, and Walmart.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>What AI agents are available?</strong> Our platform includes
            agents for inventory optimization, dynamic pricing, customer
            experience personalization, and predictive analytics.
          </p>

          <p className="mt-6 md:text-xl">
            <strong>How do I contact support?</strong> All plans include email
            support. Growth and Enterprise plans include dedicated success
            managers and priority support channels.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
