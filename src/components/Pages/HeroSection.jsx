import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingSystem from "./Bookings/BookingSystem"
import "./HeroSection.css";
import BookServicePopup from "./BookServicePopup";


// function BookServicePopup({ onClose }) {
//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>Book a Service</h2>
//         <p>This is a dummy popup for booking a service.</p>
//         <button className="close-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }


export default function HeroSection() {
  const [showBookPopup, setShowBookPopup] = useState(false);

  return (
    <section className="hero-section">
      <div className="hero-content animate-left">
        {/* <div>
          <img src="https://tse1.mm.bing.net/th/id/OIP.U8cNv1_PENi8PbZIbhF1bAHaDN?pid=Api&P=0&h=180"  style={{height:"10rem" , width:"100%" , borderRadius:"10px" , boxShadow:"0 6px 20px #5382b4ff"}}/> <br />
        </div> */}
        <h1 className="hero-title">
          Fixonindia — Your Home’s Best Buddy!
        </h1>
        <p className="hero-subtitle">
          Fast, professional, and trusted electricians at your doorstep. We
          handle all types of electrical installations, repairs, and maintenance.
        </p>
        <ul className="hero-points" style={{listStyle:"none"}}>
            <li style={{color:"black" , textAlign:"left"}}>✔ Same Day Service</li>
            <li style={{color:"black" , textAlign:"left"}}>✔ 100% Verified Technicians</li>
            <li style={{color:"black" , textAlign:"left"}}>✔ Lowest Prices Guaranteed</li>
        </ul>
        <br />
        <div className="hero-buttons">
          <Link to="/service" className="cta-btn primary-btn">
            Visit Services
          </Link>

          <button
            className="cta-btn secondary-btn" style={{backgroundColor:"#37c732ff"}}
            onClick={() => setShowBookPopup(true)}
          >
            Book on WhatsApp
          </button>

         
        </div>
      </div>

      <div className="hero-image animate-right">

       <BookingSystem/>

      </div>

       {/* Popups */}
          {showBookPopup && (
            <BookServicePopup onClose={() => setShowBookPopup(false)} />
          )}

    </section>
  );
}

























// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./HeroSection.css";

// // Dummy Popups (replace with real components later)
// function BookServicePopup({ onClose }) {
//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>Book a Service</h2>
//         <p>This is a dummy popup for booking a service.</p>
//         <button className="close-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

// function ContactUsPopup({ onClose }) {
//   return (
//     <div className="popup-overlay">
//       <div className="popup-content">
//         <h2>Contact Us</h2>
//         <p>This is a dummy popup for contacting us.</p>
//         <button className="close-btn" onClick={onClose}>Close</button>
//       </div>
//     </div>
//   );
// }

// export default function HeroSection() {
//   const [showBookPopup, setShowBookPopup] = useState(false);
//   const [showContactPopup, setShowContactPopup] = useState(false);

//   return (
//     <section className="hero-section">
//       <div className="hero-content">
//         <h1 className="hero-title">
//           Reliable Electrical Services <br /> For Your Home & Office
//         </h1>
//         <p className="hero-subtitle">
//           Fast, professional, and trusted electricians at your doorstep. We
//           handle all types of electrical installations, repairs, and maintenance.
//         </p>

//         <div className="hero-buttons">
//           <Link to="/services" className="cta-btn primary-btn">
//             Visit Services
//           </Link>
//           <button
//             className="cta-btn secondary-btn"
//             onClick={() => setShowBookPopup(true)}
//           >
//             Book a Service
//           </button>
//           <button
//             className="cta-btn tertiary-btn"
//             onClick={() => setShowContactPopup(true)}
//           >
//             Contact Us
//           </button>
//         </div>
//       </div>

//       <div className="hero-image">
//         <img
//           src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
//           alt="Electrician working"
//         />
//       </div>

      // {/* Popups */}
      // {showBookPopup && (
      //   <BookServicePopup onClose={() => setShowBookPopup(false)} />
      // )}
//       {showContactPopup && (
//         <ContactUsPopup onClose={() => setShowContactPopup(false)} />
//       )}
//     </section>
//   );
// }