import React from 'react';

interface HomePageProps {
  onNavigateToBuilder?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToBuilder }) => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">Create Forms with Your Personal Touch</h1>
          <p className="hero-subtitle">
            Stop using generic forms. Build custom forms that reflect your brand identity
            and connect with your audience in meaningful ways.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-large btn-primary" onClick={onNavigateToBuilder}>
              Start Building
            </button>
            <button className="btn btn-large btn-outline">View Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="form-preview">
            <div className="form-header">
              <h3>Your Custom Form</h3>
            </div>
            <div className="form-fields">
              <div className="field"></div>
              <div className="field"></div>
              <div className="field"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose FormCraft?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Custom Themes</h3>
              <p>Choose from templates or create your own unique design with your colors, fonts, and branding.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖱️</div>
              <h3>Drag & Drop Builder</h3>
              <p>Intuitive visual form builder. No coding required. Just drag, drop, and customize.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Analytics</h3>
              <p>Track responses, analyze data, and get insights about your form performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>Team Collaboration</h3>
              <p>Work together with your team. Perfect for companies and organizations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Build Your First Custom Form?</h2>
          <p>Join thousands of companies who've already switched from generic forms.</p>
          <button className="btn btn-large btn-primary" onClick={onNavigateToBuilder}>
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default React.memo(HomePage);