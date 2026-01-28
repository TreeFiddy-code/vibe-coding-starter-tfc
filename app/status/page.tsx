import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Status() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            System Status
          </h1>

          <p className="mt-6 md:text-xl">
            At OmniCart AI, we prioritize the availability and reliability of
            your e-commerce optimization platform. Our system status page
            provides real-time updates on the operational status of our AI
            agents, integrations, and core services. We maintain a 99.99% uptime
            SLA to ensure your business runs smoothly 24/7.
          </p>

          <p className="mt-6 md:text-xl">
            If you encounter any issues or have questions about our system, our
            support team is here to help. Stay informed with the latest updates
            to ensure your autonomous optimization continues without
            interruption.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
