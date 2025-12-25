import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import Footer from '../components/layout/Footer';
import GoogleAdSense from '../components/common/GoogleAdSense';
import SEO from '../components/common/SEO';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <SEO />
      <Header />
      <Hero />
      <Stats />
      <GoogleAdSense />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
