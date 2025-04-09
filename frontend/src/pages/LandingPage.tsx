import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Footer from '../components/Footer';
import Header from '../components/Header';
import '../styles/LandingPage.css';

import { POSTER_BASE_URL } from '../api/movieService';

// Real show IDs pulled from your SQLite database
const movieIds = ['s8382', 's3467', 's3128', 's293', 's7739', 's2917', 's5896', 's2321', 's493', 's7368', 's1267', 's7845'];
const tvIds = ['s2471', 's4410', 's1707', 's8294', 's3749', 's6', 's7541', 's7484', 's3131', 's821', 's1989', 's2923'];

const moviePosters = movieIds.map((id) => `${POSTER_BASE_URL}${id}.jpg`);
const tvShowPosters = tvIds.map((id) => `${POSTER_BASE_URL}${id}.jpg`);

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
      <Header />

      <div className="hero-section">
        <div className="carousel-wrapper">
          <Carousel controls={false} indicators={false} fade interval={4000} pause="hover">
            {moviePosters.map((poster, index) => (
              <Carousel.Item key={index}>
                <div
                  className="carousel-bg"
                  style={{ backgroundImage: `url(${poster})` }}
                />
              </Carousel.Item>
            ))}
          </Carousel>

          <div className="hero-content">
            <h1 className="hero-title">Unlimited Movies, TV Shows, and More.</h1>
            <p className="hero-subtitle">Personalized entertainment at your fingertips.</p>
            <div className="email-form">
              <Link to="/login" className="btn btn-danger">Get Started</Link>
            </div>
          </div>

          <div className="overlay" />
        </div>
      </div>

      <div className="scroll-content">
        <section className="featured-section reveal">
          <h2 className="section-title">Top Movies</h2>
          <div className="horizontal-scroll">
            {moviePosters.map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`Top Movie ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        <section className="featured-section reveal">
          <h2 className="section-title">Most Popular TV Shows</h2>
          <div className="horizontal-scroll">
            {tvShowPosters.map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`TV Show ${idx}`} />
              </div>
            ))}
          </div>
        </section>

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
                  <th key={plan.name} className={`plan-header ${plan.mostPopular ? 'most-popular' : ''}`}>
                    {plan.mostPopular && (
                      <div className="ribbon"><span>Most Popular</span></div>
                    )}
                    {plan.name}
                    <br />
                    <span>{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
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
                    <Link to="/login" className="btn btn-danger">
                      Select {plan.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <button className="floating-trial-button" onClick={scrollToPlans}>
        Start Free Trial
      </button>

      <Footer />
    </div>
  );
};

export default LandingPage;
