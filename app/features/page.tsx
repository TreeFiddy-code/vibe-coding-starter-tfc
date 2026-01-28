import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Features() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            AI-Powered Features for E-Commerce Excellence
          </h1>

          <p className="mt-6 md:text-xl">
            Discover how OmniCart AI transforms your e-commerce operations with
            autonomous AI agents. From intelligent inventory management to
            dynamic pricing optimization, our features are designed to maximize
            your revenue while minimizing manual work.
          </p>

          <p className="mt-6 md:text-xl">
            Whether you're scaling a growing store or optimizing enterprise
            operations, our platform delivers measurable results. Start your
            free trial today and experience the future of e-commerce automation.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
