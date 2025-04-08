import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container text-light py-5">
      <h2 className="display-5 fw-bold mb-3">Privacy Statement</h2>
      <p className="text-muted small mb-4">Effective Date: 4/7/2025</p>

      <p className="mb-4 small">
        At CineNiche, your privacy is a top priority. This Privacy Statement outlines how we collect, use, and protect your personal data when you use our services.
      </p>

      <h3 className="h5 fw-semibold mt-4">1. Information We Collect</h3>
      <ul className="mb-4 small">
        <li><strong>Personal Information:</strong> Name, email address, date of birth, and other identifying information you provide when creating an account.</li>
        <li><strong>Usage Data:</strong> Information on how you interact with our platform, such as movie views, search queries, and recommendation activity.</li>
        <li><strong>Technical Data:</strong> Device information, browser type, IP address, and cookies.</li>
      </ul>

      <h3 className="h5 fw-semibold mt-4">2. How We Use Your Information</h3>
      <ul className="mb-4 small">
        <li>Provide access to the CineNiche platform and its features</li>
        <li>Personalize your experience with tailored movie recommendations</li>
        <li>Improve our services and develop new features</li>
        <li>Communicate with you about your account or updates to our policies</li>
        <li>Comply with legal obligations and enforce our terms</li>
      </ul>

      <h3 className="h5 fw-semibold mt-4">3. Data Sharing and Third Parties</h3>
      <p className="mb-4 small">
        We do not sell your personal information. We may share data with trusted service providers who assist us in operating the platform (e.g., cloud hosting, analytics), provided they comply with data protection laws.
      </p>

      <h3 className="h5 fw-semibold mt-4">4. Your Rights</h3>
      <ul className="mb-3 small">
        <li>Access and update your personal information</li>
        <li>Request deletion of your data</li>
        <li>Object to data processing or request data portability</li>
        <li>Withdraw consent at any time</li>
      </ul>
      <p className="small mb-4">
        To exercise these rights, please contact us at [Insert Contact Email].
      </p>

      <h3 className="h5 fw-semibold mt-4">5. Data Security</h3>
      <p className="mb-4 small">
        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse.
      </p>

      <h3 className="h5 fw-semibold mt-4">6. Cookies</h3>
      <p className="mb-4 small">
        CineNiche uses cookies to enhance user experience, analyze traffic, and personalize content. You can control cookie settings through your browser.
      </p>

      <h3 className="h5 fw-semibold mt-4">7. Changes to This Statement</h3>
      <p className="mb-4 small">
        We may update this Privacy Statement from time to time. We will notify you of any significant changes through the platform or via email.
      </p>

      <h3 className="h5 fw-semibold mt-4">Contact Us</h3>
      <p className="small">
        If you have any questions or concerns about our privacy practices, please contact us at:<br />
        📧 cineniche@cineniche.com<br />
        🌐 CineNiche, 12345 E Movie Lane

        </p>
        <Link to="/" className="btn btn-outline-light">
        ⬅ Back to Home
        </Link>
        <p className="small mt-4 text-muted">
      </p>
    </div>
  );
};

export default PrivacyPage;
