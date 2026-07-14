import React from 'react';
import { GraduationCap } from 'lucide-react';

interface CallToActionProps {
  onJoinAsStudent: () => void;
  onJoinAsInstructor: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onJoinAsStudent, onJoinAsInstructor }) => {
  return (
    <section className="cta-banner-section-wrapper" style={{ padding: '20px 0' }}>
      <div className="container">
        <div className="cta-banner-section">
          <div className="cta-banner-container">
            {/* Left side: Icon & Title */}
            <div className="cta-left">
              <div className="cta-icon-circle">
                <GraduationCap size={28} />
              </div>
              <h3 className="cta-title">Let's Start With Academy LMS</h3>
            </div>

            {/* Right side: Action buttons */}
            <div className="cta-right-btns">
              <button className="cta-student-btn" onClick={onJoinAsStudent}>
                I'm A Student
              </button>
              <button className="cta-instructor-btn" onClick={onJoinAsInstructor}>
                Become An Instructor
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
