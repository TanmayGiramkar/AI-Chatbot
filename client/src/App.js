import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Main Landing Page */}
      <div className="landing-page">
        <header className="header">
          <div className="container">
            <h1>🏠 Premium Real Estate</h1>
            <nav>
              <a href="#home">Home</a>
              <a href="#properties">Properties</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main className="hero">
          <div className="container">
            <h2>Find Your Dream Home</h2>
            <p>Discover the perfect property in Pune's most sought-after locations</p>
            <div className="cta-buttons">
              <button className="btn-primary">Browse Properties</button>
              <button className="btn-secondary">Schedule a Visit</button>
            </div>
          </div>
        </main>

        <section className="features">
          <div className="container">
            <div className="feature-card">
              <div className="icon">🏢</div>
              <h3>Premium Apartments</h3>
              <p>Luxury 2BHK & 3BHK apartments in prime locations</p>
            </div>
            <div className="feature-card">
              <div className="icon">🏡</div>
              <h3>Villas & Houses</h3>
              <p>Spacious independent houses and villas</p>
            </div>
            <div className="feature-card">
              <div className="icon">💼</div>
              <h3>Commercial Spaces</h3>
              <p>Office spaces and commercial properties</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2026 Premium Real Estate. All rights reserved.</p>
        </footer>
      </div>

      {/* Chat Widget - Always visible */}
      <ChatWidget />
    </div>
  );
}

export default App;