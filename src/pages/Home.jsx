import React from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import hospitalImage from '../assets/images/francisco-javier-valerio-trujillo-WLMjiAu2V00-unsplash.jpg';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '15K+', label: 'Patients Treated', icon: '👥' },
    { number: '50+', label: 'Expert Doctors', icon: '👨‍⚕️' },
    { number: '25+', label: 'Years Experience', icon: '🏆' },
    { number: '24/7', label: 'Emergency Care', icon: '🚑' }
  ];

  const services = [
    { 
      icon: '👨‍⚕️', 
      title: 'Expert Doctors', 
      desc: '24/7 medical care from certified professionals',
      color: '#3498db'
    },
    { 
      icon: '🔬', 
      title: 'Lab Services', 
      desc: 'Advanced diagnostic and testing facilities',
      color: '#9b59b6'
    },
    { 
      icon: '💊', 
      title: 'Pharmacy', 
      desc: 'Complete medication and prescription services',
      color: '#2ecc71'
    },
    { 
      icon: '🚑', 
      title: 'Emergency Care', 
      desc: 'Round-the-clock emergency medical services',
      color: '#e74c3c'
    },
    { 
      icon: '🏥', 
      title: 'In-Patient Care', 
      desc: 'Comfortable rooms with modern amenities',
      color: '#f39c12'
    },
    { 
      icon: '📋', 
      title: 'Health Checkups', 
      desc: 'Comprehensive preventive health packages',
      color: '#1abc9c'
    }
  ];

  const whyChooseUs = [
    { title: 'State-of-the-Art Equipment', desc: 'Latest medical technology' },
    { title: 'Experienced Team', desc: '50+ certified professionals' },
    { title: 'Patient-Centered Care', desc: 'Your health is our priority' },
    { title: 'Affordable Pricing', desc: 'Quality healthcare for everyone' }
  ];

  return (
    <div style={{ 
      backgroundColor: theme.colors.background.page,
      minHeight: '100vh'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: theme.colors.background.paper,
        borderBottom: `1px solid ${theme.colors.border.main}`,
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: theme.colors.primary.main
            }}>
              🏥
            </div>
            <h1 style={{ 
              fontSize: '1.5rem',
              fontWeight: 600,
              color: theme.colors.text.primary,
              margin: 0
            }}>
              Trinity Hospital
            </h1>
          </div>
          <button 
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = theme.colors.primary.dark}
            onMouseOut={(e) => e.target.style.backgroundColor = theme.colors.primary.main}
          >
            Staff Login
          </button>
        </div>
      </nav>

      {/* Hero Section with Hospital Image */}
      <div style={{
        position: 'relative',
        height: '600px',
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${hospitalImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)',
          zIndex: 0
        }}></div>
        
        {/* Overlay Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '900px' }}>
            <h2 style={{
              fontSize: '4rem',
              fontWeight: 700,
              color: 'white',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              Your Health, Our Priority
            </h2>
            <p style={{
              fontSize: '1.5rem',
              color: 'white',
              marginBottom: '3rem',
              lineHeight: 1.6,
              textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
            }}>
              Providing compassionate, quality healthcare services with state-of-the-art facilities
            </p>
            {/* Only Emergency Contact Button */}
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  backgroundColor: 'white',
                  color: theme.colors.primary.main,
                  padding: '1.25rem 3rem',
                  borderRadius: '0.5rem',
                  border: '2px solid white',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                }}
              >
                📞 Emergency Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        padding: '4rem 2rem',
        backgroundColor: theme.colors.background.paper
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: theme.colors.primary.main,
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: theme.colors.text.secondary,
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div style={{
        padding: '5rem 2rem',
        backgroundColor: theme.colors.background.default
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: theme.colors.text.primary,
              marginBottom: '1rem'
            }}>
              Our Services
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: theme.colors.text.secondary,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {services.map((service, idx) => (
              <div key={idx} style={{
                backgroundColor: theme.colors.background.paper,
                padding: '2.5rem',
                borderRadius: '1rem',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: `1px solid ${theme.colors.border.main}`,
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = service.color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = theme.colors.border.main;
              }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{service.icon}</div>
                <h4 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  marginBottom: '0.75rem'
                }}>
                  {service.title}
                </h4>
                <p style={{ 
                  color: theme.colors.text.secondary, 
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{
        padding: '5rem 2rem',
        backgroundColor: theme.colors.background.paper
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: theme.colors.text.primary,
              marginBottom: '1rem'
            }}>
              Why Choose Us
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: theme.colors.text.secondary
            }}>
              Excellence in healthcare with a personal touch
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {whyChooseUs.map((item, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: `${theme.colors.primary.main}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: theme.colors.primary.main
                }}>
                  ✓
                </div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  {item.title}
                </h4>
                <p style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.95rem'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div style={{
        padding: '4rem 2rem',
        backgroundColor: theme.colors.primary.main,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '1rem'
          }}>
            Need Medical Assistance?
          </h3>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2rem'
          }}>
            Our team is available 24/7 for emergency consultations
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📞</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>Call Us</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: theme.colors.text.primary }}>
                  +91 1800-HOSPITAL
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>Email Us</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: theme.colors.text.primary }}>
                  care@trinityhospital.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: theme.colors.gray?.[900] || '#212121',
        color: 'white',
        padding: '3rem 2rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Trinity Hospital</h4>
              <p style={{ opacity: 0.8, lineHeight: 1.6, fontSize: '0.95rem' }}>
                Dedicated to providing exceptional healthcare services with compassion and excellence since 2000.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>About Us</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>Services</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>Doctors</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'white', opacity: 0.8, textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Hours</h4>
              <p style={{ opacity: 0.8, lineHeight: 1.8, fontSize: '0.95rem' }}>
                Mon - Fri: 8:00 AM - 10:00 PM<br />
                Sat - Sun: 9:00 AM - 8:00 PM<br />
                <strong>Emergency: 24/7</strong>
              </p>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, opacity: 0.8 }}>© 2025 Trinity Hospital. All rights reserved.</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', opacity: 0.6 }}>
              Excellence in Healthcare Since 2000
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
