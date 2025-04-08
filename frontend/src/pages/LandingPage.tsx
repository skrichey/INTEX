// LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Footer from '../components/Footer';
import '../styles/LandingPage.css';
import posterFilenames from '../types/Posters'; // or wherever you put it

const moviePosters = posterFilenames.map((file) => `/posters/${encodeURIComponent(file)}`);

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container text-center text-light">
      <header className="landing-header d-flex justify-content-between align-items-center px-4 py-3">
        <h2 className="m-0 fw-bold">CineNiche</h2>
        <Link to="/login" className="btn btn-outline-light">Login</Link>
      </header>

      <div className="carousel-wrapper">
        <Carousel controls={false} indicators={false} fade interval={5000}>
          {moviePosters.map((poster, index) => (
            <Carousel.Item key={index}>
              <div
                className="carousel-bg"
                style={{ backgroundImage: `url(${poster})` }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <div className="overlay-content">
        <h1 className="display-3 fw-bold">CineNiche</h1>
        <p className="lead">Personalized entertainment at your fingertips</p>
        <Link to="/login" className="btn btn-danger btn-lg mt-3">
          Get Started
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
