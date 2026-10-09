import { useState } from 'react'

interface OnboardingPageProps {
  onGetStarted: () => void
}

// Inline SVGs (No emojis)
function ActivityIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  )
}

const steps = [
  {
    title: "SYSTEM INITIALIZATION",
    subtitle: "Real-time coastal flood prediction",
    content: "Flood Intelligence leverages advanced machine learning models to forecast flood risks across coastal India. Our system processes live weather and environmental data to keep you informed with high-fidelity analytics.",
    icon: <ActivityIcon />
  },
  {
    title: "LOCATION ANALYSIS",
    subtitle: "Targeted prediction metrics",
    content: "Select any location on the interactive map to retrieve proximal prediction points. Each data point provides detailed probability scores, estimated water levels, and AI-driven risk factor analysis to aid decision-making.",
    icon: <MapPinIcon />
  },
  {
    title: "EMERGENCY PROTOCOLS",
    subtitle: "When to monitor the system",
    content: "Engage the system during monsoon seasons (June-September), ahead of forecasted heavy rainfall, or if situated in low-lying coastal regions. Ensure readiness by reviewing local emergency protocols.",
    icon: <ShieldIcon />,
    showEmergency: true
  }
]

function OnboardingPage({ onGetStarted }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onGetStarted()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="onboarding-wizard">
      <div className="onboarding-header">
        <div className="brand-mark onboarding-logo-mark" aria-hidden="true">FI</div>
        <div className="onboarding-brand-text">FLOOD_INTELLIGENCE // V1.0</div>
      </div>

      <div className="onboarding-container">
        <div className="onboarding-progress">
          {steps.map((_, idx) => (
            <div key={idx} className={`progress-node ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`} />
          ))}
        </div>

        <div className="onboarding-card">
          <div className="onboarding-card-icon">
            {step.icon}
          </div>
          <div className="onboarding-card-content">
            <h1 className="onboarding-title">{step.title}</h1>
            <h2 className="onboarding-subtitle">{step.subtitle}</h2>
            <p className="onboarding-text">{step.content}</p>
            
            {step.showEmergency && (
              <div className="onboarding-emergency-box">
                <h3 className="emergency-heading">VERIFIED EMERGENCY CHANNELS</h3>
                <div className="emergency-grid">
                  <a href="tel:112" className="btn-3d secondary emergency-btn"><PhoneIcon /> 112 - NAT'L EMERGENCY</a>
                  <a href="tel:108" className="btn-3d secondary emergency-btn"><PhoneIcon /> 108 - AMBULANCE</a>
                  <a href="tel:1078" className="btn-3d secondary emergency-btn"><PhoneIcon /> 1078 - DISASTER MGMT</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="onboarding-controls">
          <button 
            className="btn-3d secondary" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            style={{ visibility: currentStep === 0 ? 'hidden' : 'visible' }}
          >
            &lt; BACK
          </button>
          <button className="btn-3d primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'INITIALIZE SYSTEM >' : 'NEXT STEP >'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
