import React from 'react';
import { useNavigate } from 'react-router-dom';

const PharmacistHeader = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: 'white', 
      borderBottom: '1px solid #e5e7eb', 
      padding: '16px 30px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left Side - Back Arrow + Clickable Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/pharmacist/dashboard')}
            style={{
              background: '#eff6ff',
              border: '1px solid #dbeafe',
              cursor: 'pointer',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dbeafe';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            title="Back to Dashboard"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div 
            onClick={() => navigate('/pharmacist/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: '0 0 4px 0', 
              color: '#1e293b',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = '#1e293b'}
            >
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side - Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PharmacistHeader;
