import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bookingpop from "../Bookings/Bookingpop"; // import the booking form
import "./ACService.css";
import jet from "../../../assets/jet.jpeg";

export default function ACService() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: "ac-1",
      name: "Jet Clean Service",
      price: 499,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.lYs_VJ7oTZncRda8fal1OAHaEK?pid=Api&P=0&h=180",
      desc: "Deep cleaning of your AC using high-pressure jet technology to remove dust, dirt, and bacteria for improved cooling efficiency.",
    },
    {
      id: "ac-2",
      name: "Foam Jet Clean Service",
      price: 549,
      image: jet,
      desc: "Foam-based jet cleaning that thoroughly cleans internal AC components and enhances airflow and cooling performance.",
    },
    {
      id: "ac-3",
      name: "Less / No Cooling Repair",
      price: 299,
      image:
        "https://tse4.mm.bing.net/th/id/OIP.cvzeYeCg5LyTG3WyopDqjwHaE8?pid=Api&P=0&h=180",
      desc: "Repair service for AC units facing low or no cooling issues due to gas leakage, clogged filters, or faulty components.",
    },
    {
      id: "ac-4",
      name: "Power Issue Repair",
      price: 299,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.mZFOPs0HKx1D8xEtUAHjiwHaE8?pid=Api&P=0&h=180",
      desc: "Complete diagnosis and repair of AC power issues including wiring, PCB faults, and electrical failures.",
    },
    {
      id: "ac-5",
      name: "Noise / Smell Repair",
      price: 499,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.PAWfC6D8H0caWxDEivbG1gHaE7?pid=Api&P=0&h=180",
      desc: "Fix unusual noises and unpleasant odors caused by fan issues, mold buildup, or loose internal parts.",
    },
    {
      id: "ac-6",
      name: "Water Leakage Repair",
      price: 499,
      image:
        "https://tse2.mm.bing.net/th/id/OIP.ioq9g0HqyvfXWH9ClbnSuwHaE8?pid=Api&P=0&h=180",
      desc: "Repair water leakage problems caused by blocked drain pipes, improper installation, or frozen coils.",
    },
    {
      id: "ac-7",
      name: "Gas Refill / Full Checkup",
      price: 2499,
      image:
        "https://tse2.mm.bing.net/th/id/OIP.KXS_daXGvyUAMwqBmwrKEwHaE7?pid=Api&P=0&h=180",
      desc: "Complete AC gas refill along with pressure testing, leak detection, and full system performance check.",
    },
    {
      id: "ac-8",
      name: "AC Installation (Split)",
      price: 1299,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.XMVUp3x43sACkH27m20AaAHaEK?pid=Api&P=0&h=180",
      desc: "Professional split AC installation including mounting, piping, wiring, and proper system setup.",
    },
    {
      id: "ac-9",
      name: "AC Installation (Window)",
      price: 999,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.3VtJ9HnoSgRgUrbvTUAzzAHaE8?pid=Api&P=0&h=180",
      desc: "Secure window AC installation ensuring proper sealing, electrical safety, and optimal cooling output.",
    },
    {
      id: "ac-10",
      name: "AC Uninstallation (Split)",
      price: 899,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.X03N-ggKQc-uKtB6BjmMtAHaEc?pid=Api&P=0&h=180",
      desc: "Safe removal of split AC units including gas recovery, wiring disconnection, and mounting removal.",
    },
    {
      id: "ac-11",
      name: "AC Uninstallation (Window)",
      price: 699,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.7EHNWrXYMYfAXOUT-Vne5QHaFj?pid=Api&P=0&h=180",
      desc: "Professional window AC uninstallation without damage to the unit or window frame.",
    },
  ];

  return (
    <div className="ac-page">
      {/* HERO */}
      <div className="ac-hero">
        <div className="overlay">
          <h1>AC Repair & Service</h1>
          <p>Expert technicians • Transparent pricing • Fast service</p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="ac-container">
        {services.map((s) => (
          <div key={s.id} className="ac-card">
            <div className="card-image">
              <img src={s.image} alt={s.name} />
            </div>
            <div className="card-content">
              <h3>{s.name}</h3>
              <p className="price">₹{s.price}</p>
              <p className="desc">{s.desc}</p>

              <button
                className="book-btn"
                onClick={() => navigate(`/services/${s.id}`, { state: s })}
              >
                View Details
              </button>

              <br /><br />

              <button
                className="book-btn"
                onClick={() => setSelectedService({ service: s.name, price: s.price })}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && (
        <div className="modal-backdrop">
          <Bookingpop
            initialService={selectedService}
            onClose={() => setSelectedService(null)}
          />
        </div>
      )}
    </div>
  );
}