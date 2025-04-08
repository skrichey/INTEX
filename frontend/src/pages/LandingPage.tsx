// LandingPage.tsx
import React, { useState } from 'react';
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
    },
    {
      name: 'Premium',
      monthlyPrice: '$12.99/month',
      annualPrice: '$129.99/year',
    },
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="carousel-wrapper">
        <Carousel controls={false} indicators={false} fade interval={4000}>
          {moviePosters.map((poster, index) => (
            <Carousel.Item key={index}>
              <div className="carousel-bg" style={{ backgroundImage: `url(${poster})` }} />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="overlay" />
      </div>

      {/* Header */}
      <header className="landing-header">
        <h2 className="logo">CineNiche</h2>
        <Link to="/login" className="btn btn-outline-light">Sign In</Link>
      </header>

      {/* Hero Content */}
      <div className="hero-content text-center">
        <h1 className="title">Welcome to CineNiche</h1>
        <p className="subtitle">Stream new releases and timeless classics.</p>
        <Link to="/login" className="btn btn-danger btn-lg mt-3">Start Your Free Trial</Link>
      </div>

      {/* Scrollable Sections */}
      <div className="scroll-content">
        {/* Featured Content */}
        <section className="featured-section">
          <h2 className="section-title">Popular on CineNiche</h2>
          <div className="horizontal-scroll">
            {moviePosters.map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`Poster ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Most Popular TV Shows */}
        <section className="featured-section">
          <h2 className="section-title">Most Popular TV Shows</h2>
          <div className="horizontal-scroll">
            {moviePosters.slice(0, 5).map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`TV Show ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Exclusive Movies */}
        <section className="featured-section">
          <h2 className="section-title">Exclusives Only on CineNiche</h2>
          <div className="horizontal-scroll">
            {moviePosters.slice(5, 10).map((poster, idx) => (
              <div className="featured-card" key={idx}>
                <img src={poster} alt={`Exclusive ${idx}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="subscription-container text-center">
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
                <th>Feature</th>
                {plans.map((plan, index) => (
                  <th key={plan.name}>
                    {plan.name}
                    <br />
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    {index === 1 && <div className="badge-popular">Most Popular</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Number of Devices</td>
                <td>1</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Ad-Free Streaming</td>
                <td style={{ color: 'red' }}>❌</td>
                <td style={{ color: 'limegreen' }}>✅</td>
              </tr>
              <tr>
                <td>Offline Downloads</td>
                <td style={{ color: 'red' }}>❌</td>
                <td style={{ color: 'limegreen' }}>✅</td>
              </tr>
              <tr>
                <td>HD Available</td>
                <td style={{ color: 'limegreen' }}>✅</td>
                <td style={{ color: 'limegreen' }}>✅</td>
              </tr>
              <tr>
                <td>4K + HDR</td>
                <td style={{ color: 'red' }}>❌</td>
                <td style={{ color: 'limegreen' }}>✅</td>
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

      <Footer />
    </div>
  );
};

export default LandingPage;
