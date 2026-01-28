import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';

export default function Careers() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-between fancy-overlay">
      <Header />

      <div className="w-full flex flex-col items-center my-12">
        <section className="w-full p-6 container-narrow">
          <h1 className="text-4xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-6xl fancy-heading">
            Join the OmniCart AI Team
          </h1>

          <p className="mt-6 md:text-xl">
            At OmniCart AI, we're on a mission to revolutionize e-commerce with
            autonomous AI. We're looking for passionate, innovative individuals
            who want to build the future of intelligent commerce automation. If
            you thrive on solving complex problems and making real impact, we
            want to hear from you.
          </p>

          <p className="mt-6 md:text-xl">
            Explore opportunities to grow your career with a company at the
            intersection of AI, machine learning, and e-commerce. Bring your
            ideas, skills, and enthusiasm — together, we're building technology
            that transforms how businesses operate.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
