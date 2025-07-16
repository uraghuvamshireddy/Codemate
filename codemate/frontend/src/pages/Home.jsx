import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <>

      <header className="hero-section">
        <div className="hero-content">
          <h1>Codemate</h1>
          <p>Unite, compete, and grow—track your coding journey with friends</p>
          <button className="btn-primary" onClick={handleLogin}>
            🚀 Get Started
          </button>
        </div>
        <div className="hero-logo">
          <img
            src="https://bing.com/th/id/BCO.7ef588d9-3b8f-4e0e-b545-4d162899726a.png"
            alt="Codemate Logo"
          />
        </div>
      </header>

      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
 <div className="feature-card">
            <div className="icon">📊</div>
            <h3>Live Stats</h3>
            <p>Real‑time coding stats from Codeforces & LeetCode.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🤝</div>
            <h3>Friend Dashboard</h3>
            <p>Compare performance and challenge your peers.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📅</div>
            <h3>Contest Alerts</h3>
            <p>Never miss an upcoming contest—stay notified.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔥</div>
            <h3>Heatmaps</h3>
            <p>Visualize your daily problem‑solving streak.</p>      
              </div>
              </div>
      </section>

      <section className="howitworks-section">
        <h2>How It Works</h2>
        <div className="steps">
<div className="step">
            <span className="step-num">1</span>
            <h4>Connect</h4>
            <p>Login with Google to sync your coding profiles.</p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <h4>Track</h4>
            <p>Automatically pull in your submissions & ratings.</p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <h4>Compare</h4>
            <p>See where you stand against friends & rivals.</p>
          </div>        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-links">
          <a href="mailto:uraghuvamshireddy@gmail.com">uraghuvamshireddy@gmail.com</a>
        </div>
        <div className="footer-logo-wrapper">
          <img
            className="footer-logo"
            src="https://bing.com/th/id/BCO.7ef588d9-3b8f-4e0e-b545-4d162899726a.png"
            alt="Codemate Logo"
          />
        </div>
        <p>© {new Date().getFullYear()} Codemate. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
