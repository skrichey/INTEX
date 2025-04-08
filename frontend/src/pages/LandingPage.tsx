import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Footer from '../components/Footer';
import '../styles/LandingPage.css';
import posterFilenames from '../types/Posters';

const moviePosters = posterFilenames.map((file) => `/posters/${encodeURIComponent(file)}`);

const LandingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const toggleBilling = () => setIsAnnual(!isAnnual);

  const plans = [
    {
      name: 'Essential',
      monthlyPrice: '$7.99/month',
      annualPrice: '$79.99/year',
      features: {
        devices: '1',
        adFree: false,
        downloads: false,
        hd: true,
        ultraHD: false,
      },
    },
    {
      name: 'Premium',
      monthlyPrice: '$12.99/month',
      annualPrice: '$129.99/year',
      mostPopular: true,
      features: {
        devices: '4',
        adFree: true,
        downloads: true,
        hd: true,
        ultraHD: true,
      },
    },
  ];

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    const handleScroll = () => {
      revealElements.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPlans = () => {
    const planSection = document.getElementById('plans');
    if (planSection) {
      planSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">

      {/* ✅ HERO SECTION */}
      <div className="hero-section">
        <div className="carousel-wrapper">
          <Carousel controls={false} indicators={false} fade interval={4000}>
            {moviePosters.map((poster, index) => (
              <Carousel.Item key={index}>
                <div
                  className="carousel-bg"
                  style={{ backgroundImage: `url(${poster})` }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <div className="overlay" />
        </div>

        <header className="landing-header">
          <h2 className="logo">CineNiche</h2>
          <Link to="/login" className="btn btn-outline-light">Sign In</Link>
        </header>

        <div className="hero-content text-center">
          <h1 className="title">Unlimited Movies, Shows & More</h1>
          <p className="subtitle">Watch anywhere. Cancel anytime.</p>
          <button onClick={scrollToPlans} className="btn btn-danger btn-lg mt-3">Start Your Free Trial</button>
        </div>
      </div>

      {/* ✅ Scrollable Content */}
      <div className="scroll-content">

        {/* Top Movies */}
        <section className="featured-section reveal">
          <h2 className="section-title">Top Movies</h2>
          <div className="horizontal-scroll">
            {moviePosters.slice(3, 9).map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`Top Movie ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* TV Shows */}
        <section className="featured-section reveal">
          <h2 className="section-title">Most Popular TV Shows</h2>
          <div className="horizontal-scroll">
            {moviePosters.map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`TV Show ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Exclusives */}
        <section className="featured-section reveal">
          <h2 className="section-title">Exclusives Only on CineNiche</h2>
          <div className="horizontal-scroll">
            {moviePosters.slice().reverse().map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`Exclusive ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Subscription Plans */}
        <section id="plans" className="subscription-container text-center reveal">
          <h2 className="section-title">Choose Your Plan</h2>
          <div className="billing-toggle">
            <span>Monthly</span>
            <label className="switch">
              <input type="checkbox" checked={isAnnual} onChange={toggleBilling} />
              <span className="slider round"></span>
            </label>
            <span>Annual</span>
          </div>

          <table className="plan-table">
            <thead>
              <tr>
                <th>Features</th>
                {plans.map((plan) => (
                  <th key={plan.name}>
                    {plan.name}
                    <br />
                    <span>{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                    {plan.mostPopular && <div className="badge-popular">Most Popular</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Number of Devices</td>
                {plans.map((plan) => <td key={plan.name}>{plan.features.devices}</td>)}
              </tr>
              <tr>
                <td>Ad-Free Streaming</td>
                {plans.map((plan) => (
                  <td key={plan.name}>{plan.features.adFree ? 'Yes' : 'No'}</td>
                ))}
              </tr>
              <tr>
                <td>Offline Downloads</td>
                {plans.map((plan) => (
                  <td key={plan.name}>{plan.features.downloads ? 'Yes' : 'No'}</td>
                ))}
              </tr>
              <tr>
                <td>HD Available</td>
                {plans.map((plan) => (
                  <td key={plan.name}>{plan.features.hd ? 'Yes' : 'No'}</td>
                ))}
              </tr>
              <tr>
                <td>4K + HDR</td>
                {plans.map((plan) => (
                  <td key={plan.name}>{plan.features.ultraHD ? 'Yes' : 'No'}</td>
                ))}
              </tr>
              <tr>
                <td></td>
                {plans.map((plan) => (
                  <td key={plan.name}>
                    <button className="btn btn-primary">Select {plan.name}</button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      {/* Floating Button */}
      <button className="floating-trial-button" onClick={scrollToPlans}>
        Start Free Trial
      </button>

      <Footer />
    </div>
  );
};

export default LandingPage;
