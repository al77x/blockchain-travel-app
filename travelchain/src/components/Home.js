import React from "react";

const Home = () => {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Welcome to TravelChain</h1>
          <p>
            Experience the future of travel rewards with our blockchain-based
            loyalty program.
          </p>
          <a href="/loyalty-demo" className="btn">
            Get Started
          </a>
        </div>
      </section>
      <section className="container">
        <div className="features">
          <div className="feature">
            <div className="feature-icon">💼</div>
            <h3>Earn Points</h3>
            <p>Accumulate points from various travel services and partners.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔄</div>
            <h3>Flexible Redemption</h3>
            <p>Redeem points for flights, hotels, car rentals, and more.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure Blockchain</h3>
            <p>Your points are securely stored using blockchain technology.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">☎️</div>
            <h3>24/7 Customer Service</h3>
            <p>
              We have a dedicated team to help you out if you're unable to book
              your travel on time.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
