import React from 'react';

const StudentFeedbacks: React.FC = () => {
  const feedbacksList = [
    {
      text: 'I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound',
      author: 'Roe Smith',
      role: 'Designer'
    },
    {
      text: 'I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound',
      author: 'Roe Smith',
      role: 'Designer'
    },
    {
      text: 'I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound',
      author: 'Roe Smith',
      role: 'Designer'
    },
    {
      text: 'I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound',
      author: 'Roe Smith',
      role: 'Designer'
    }
  ];

  return (
    <section className="student-feedbacks-section" style={{ padding: '40px 0 60px 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-row" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '50px' }}>
          <div className="section-title-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Student Feedbacks</h2>
            <p>What Students Say About Academy LMS</p>
          </div>
        </div>

        {/* Feedbacks Row */}
        <div className="feedback-cards-row">
          {feedbacksList.map((fb, idx) => (
            <div key={idx} className="feedback-card-home">
              <div className="feedback-quote-icon">“</div>
              <p className="feedback-text-home">{fb.text}</p>
              <div className="feedback-author-info">
                <span className="feedback-author-name">{fb.author}</span>
                <span className="feedback-author-role">{fb.role}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StudentFeedbacks;
