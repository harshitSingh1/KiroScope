import React from 'react';
import { 
  FiCpu, 
  FiDatabase, 
  FiCode, 
  FiLayers, 
  FiEye, 
  FiSearch,
  FiLayout,
  FiZap,
  FiGithub,
  FiServer,
  FiCloud,
  FiBox,
  FiCpu as FiAI,
  FiGitBranch,
  FiPieChart,
  FiTrendingUp,
  FiShield,
  FiGlobe,
  FiUsers
} from 'react-icons/fi';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.3}s`,
              '--duration': `${20 + i * 3}s`,
              '--size': `${10 + i * 2}px`,
              '--opacity': `${0.05 + i * 0.01}`
            }} />
          ))}
        </div>
        <div className="grid-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <FiZap className="badge-icon" />
              AI-Powered
            </div>
            <h1>Revolutionize Your Architecture Workflow</h1>
            <p className="hero-subtitle">
              Kiroscope transforms how teams visualize, understand, and collaborate on 
              complex software architectures with AI-driven insights and real-time visualization.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Real-time Updates</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered Analysis</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Scalable Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Powerful Features</h2>
            <p className="section-subtitle">Everything you need for modern architecture management</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiEye />
              </div>
              <h3>Real-time Visualization</h3>
              <p>Interactive architecture diagrams that update instantly as your project evolves</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiSearch />
              </div>
              <h3>Smart Search & Filter</h3>
              <p>Quickly locate components and understand relationships across your entire codebase</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiLayout />
              </div>
              <h3>Multiple Layouts</h3>
              <p>Choose from grid, hierarchical, or radial views for different architectural perspectives</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiZap />
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>Get intelligent suggestions and insights powered by Kiro's advanced AI capabilities</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiDatabase />
              </div>
              <h3>Dependency Mapping</h3>
              <p>Visualize and understand complex dependencies between services and components</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiCode />
              </div>
              <h3>Code Integration</h3>
              <p>Seamlessly connect with your codebase for accurate, up-to-date architecture views</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack - Centered Layout */}
<section className="tech-stack-section">
  <div className="container">
    <div className="section-header">
      <h2>Technology Stack</h2>
      <p className="section-subtitle">Built with cutting-edge technologies for optimal performance</p>
    </div>
    
    <div className="tech-stack-grid">
      {/* Frontend Technologies */}
      <div className="tech-stack-category">
        <div className="tech-category-header">
          <FiLayout className="category-icon" />
          <h3>Frontend</h3>
        </div>
        <div className="tech-stack-items">
          <div className="tech-stack-item">
            <div className="tech-icon react">⚛️</div>
            <span>React.js</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon typescript">🔷</div>
            <span>Tailwind</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon vite">⚡</div>
            <span>Vite</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon css">🎨</div>
            <span>CSS3</span>
          </div>
        </div>
      </div>

      {/* Backend Technologies */}
      <div className="tech-stack-category">
        <div className="tech-category-header">
          <FiServer className="category-icon" />
          <h3>Backend</h3>
        </div>
        <div className="tech-stack-items">
          <div className="tech-stack-item">
            <div className="tech-icon node">🟢</div>
            <span>Node.js</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon express">🚀</div>
            <span>Express.js</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon socket">📡</div>
            <span>Socket.io</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon rest">🔗</div>
            <span>REST API</span>
          </div>
        </div>
      </div>

      {/* AI & Data Technologies */}
      <div className="tech-stack-category">
        <div className="tech-category-header">
          <FiZap className="category-icon" />
          <h3>AI & Tools</h3>
        </div>
        <div className="tech-stack-items">
          <div className="tech-stack-item">
            <div className="tech-icon kiro">🤖</div>
            <span>Kiro AI</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon realtime">⏱️</div>
            <span>Real-time Processing</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon npm">📦</div>
            <span>npm</span>
          </div>
          <div className="tech-stack-item">
            <div className="tech-icon webgl">🎮</div>
            <span>WebGL</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Kiro Integration */}
      <section className="kiro-integration">
        <div className="container">
          <div className="integration-content">
            <div className="integration-text">
              <div className="integration-badge">
                <FiZap />
                Powered by Kiro AI
              </div>
              <h2>Intelligent Architecture Analysis</h2>
              <p>
                Kiroscope leverages Kiro's advanced AI engine to provide real-time architecture insights, 
                automated dependency detection, and intelligent optimization suggestions. Transform your 
                development workflow with AI-powered architecture management.
              </p>
              <div className="ai-features">
                <div className="ai-feature">
                  <FiGitBranch />
                  <span>Automated Dependency Mapping</span>
                </div>
                <div className="ai-feature">
                  <FiPieChart />
                  <span>Performance Analytics</span>
                </div>
                <div className="ai-feature">
                  <FiShield />
                  <span>Security Insights</span>
                </div>
              </div>
            </div>
            <div className="integration-visual">
              <div className="ai-brain">
                <div className="brain-core"></div>
                <div className="brain-connections">
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                </div>
                <div className="brain-particles">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Architecture Workflow?</h2>
            <p>Join thousands of developers who use Kiroscope to visualize and optimize their software architectures.</p>
            <div className="cta-buttons">
              <button className="cta-btn primary">
                <FiCode />
                Start Exploring
              </button>
              <button className="cta-btn secondary">
                <FiGlobe />
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <FiCpu className="footer-logo" />
              <span>Kiroscope</span>
            </div>
            <p>Built with ❤️ for the developer community</p>
            <div className="footer-links">
              <a href="#">Documentation</a>
              <a href="#">GitHub</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;