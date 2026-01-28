import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Help() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            How Can We Help You Optimize?
          </h1>

          <p className="mt-6 md:text-xl">
            Welcome to OmniCart AI's Help Center! We're here to assist you in
            getting the most out of your autonomous e-commerce optimization.
            Whether you're new to our platform or looking to unlock advanced
            features, you've come to the right place.
          </p>

          <p className="mt-6 md:text-xl">
            Transforming your e-commerce operations has never been easier. With
            OmniCart AI, you can deploy intelligent AI agents that manage
            inventory, optimize pricing, and personalize customer
            experiences—all working 24/7 so you can focus on growing your
            business.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
