import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Press() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            OmniCart_AI in the News
          </h1>

          <p className="mt-6 md:text-xl">
            At OmniCart_AI, we're redefining how e-commerce businesses operate
            with autonomous AI agents. Our innovative platform automates
            inventory management, pricing optimization, and customer experience
            personalization—delivering measurable results for businesses of all
            sizes.
          </p>

          <p className="mt-6 md:text-xl">
            Our commitment is to empower e-commerce businesses with intelligent
            automation that drives growth. As we continue to innovate, we're
            proud to be recognized as a leader in the AI-powered commerce
            revolution.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
