import React, { useState, useEffect } from "react";
import API from "../../../config/axiosConfig";

const SERVICES = [
  // Refrigerator Services
  { id: 1, service: "REFRIGERATOR POWER ISSUE", price: 199 },
  { id: 2, service: "REFRIGERATOR NOISE ISSUE", price: 199 },
  { id: 3, service: "REFRIGERATOR NO COOLING", price: 199 },
  { id: 4, service: "REFRIGERATOR EXCESS COOLING", price: 199 },
  { id: 5, service: "REFRIGERATOR WATER LEAKAGE", price: 199 },
  { id: 6, service: "REFRIGERATOR DOOR ISSUE", price: 199 },
  { id: 7, service: "REFRIGERATOR LESS COOLING", price: 199 },

  // AC Services
  { id: 8, service: "JET CLEAN SERVICE", price: 499 },
  { id: 9, service: "FOAM JET CLEAN SERVICE", price: 549 },
  { id: 10, service: "AC LESS / NO COOLING REPAIR", price: 299 },
  { id: 11, service: "AC POWER ISSUE REPAIR", price: 299 },
  { id: 12, service: "AC NOISE / SMELL REPAIR", price: 499 },
  { id: 13, service: "AC WATER LEAKAGE REPAIR", price: 499 },
  { id: 14, service: "AC GAS REFILL / FULL CHECKUP", price: 2499 },
  { id: 15, service: "AC INSTALLATION (SPLIT)", price: 1299 },
  { id: 16, service: "AC INSTALLATION (WINDOW)", price: 999 },
  { id: 17, service: "AC UNINSTALLATION (SPLIT)", price: 899 },
  { id: 18, service: "AC UNINSTALLATION (WINDOW)", price: 699 },

  // Washing Machine Services (Start from 199)
  { id: 19, service: "WASHING MACHINE UNKNOWN ISSUE", price: 199 },
  { id: 20, service: "WASHING MACHINE DRAINING ISSUE", price: 199 },
  { id: 21, service: "WASHING MACHINE NOT SPINNING ISSUE", price: 199 },
  { id: 22, service: "WASHING MACHINE ERROR ON DISPLAY / POWER ISSUE", price: 199 },
  { id: 23, service: "WASHING MACHINE NOISE ISSUE", price: 199 },

  // Washing Machine Installation / Uninstallation
  { id: 24, service: "WASHING MACHINE INSTALLATION / UNINSTALLATION", price: 399 },
];

const BookingPop = ({ initialService = null, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState(() => {
    if (initialService) {
      return [
        { service: initialService.service, price: initialService.price, quantity: 1 },
        { service: "", price: 0, quantity: 1 },
      ];
    }
    return [{ service: "", price: 0, quantity: 1 }];
  });

  const [form, setForm] = useState({ username: "", phone: "", address: "", lat: null, lng: null });
  const [booking, setBooking] = useState(null);
  const [errors, setErrors] = useState({});

// Fetch user profile
  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          // Auto-fill username
          setForm((prev) => ({ ...prev, username: res.data.user.name || "" }));
        }
      })
      .catch(() => {});
  }, []);

  const addServiceRow = () => {
    setServices((prev) => [...prev, { service: "", price: 0, quantity: 1 }]);
  };

  const updateService = (index, value) => {
    const selected = SERVICES.find((s) => s.service === value);
    const updated = [...services];
    updated[index] = { ...updated[index], service: selected.service, price: selected.price };
    setServices(updated);
    if (index === services.length - 1) addServiceRow();
  };

  const changeQty = (index, delta) => {
    const updated = [...services];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    setServices(updated);
  };

  const totalAmount = services.reduce((sum, s) => sum + s.price * s.quantity, 0);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((p) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username?.trim()) newErrors.username = "Username required";
    if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Valid 10-digit phone required";
    if (!form.address?.trim()) newErrors.address = "Address required";
    if (!services.some((s) => s.service)) newErrors.service = "Select at least one service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createBooking = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await API.post("/booking", {
        username: user?._id || form.username,
        phone: form.phone,
        services: services.filter((s) => s.service),
        location: { address: form.address, lat: form.lat, lng: form.lng },
        payment: { amount: totalAmount, status: "pending" },
      });
      setBooking(res.data.booking);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Booking failed");
    }
  };

  const payNow = async () => {
    const orderRes = await API.post("/payment/order", { amount: booking.payment.amount });
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: orderRes.data.order.amount,
      currency: "INR",
      order_id: orderRes.data.order.id,
      name: "Service Booking",
      handler: async (res) => {
        await API.post("/payment/verify", res);
        alert("Payment Successful");
      },
    });
    rzp.open();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          width: "90%",
          maxWidth: 420,
          position: "relative",
          boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h2>Service Booking</h2>

        {!booking && (
          <div>
            {/* Highlight pre-selected service */}
            {initialService && (
              <div
                style={{
                  background: "#f1f3f9",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 16,
                  fontWeight: "600",
                  color: "#1e3c72",
                }}
              >
                Selected Service: {initialService.service} – ₹{initialService.price}
              </div>
            )}

            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, border: "1px solid #d6d9df" }}
            />
            {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}

            {services.map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <select
                  value={s.service}
                  onChange={(e) => updateService(i, e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d6d9df" }}
                >
                  <option value="">Select Service</option>
                  {SERVICES.map((o) => (
                    <option key={o.id} value={o.service}>
                      {o.service} – ₹{o.price}
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                  <button onClick={() => changeQty(i, -1)} style={{ padding: 6, marginRight: 6 }}>-</button>
                  <span>{s.quantity}</span>
                  <button onClick={() => changeQty(i, 1)} style={{ padding: 6, marginLeft: 6 }}>+</button>
                </div>
              </div>
            ))}
            {errors.service && <p style={{ color: "red" }}>{errors.service}</p>}

            <input disabled value={`Total ₹${totalAmount}`} style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, border: "1px solid #d6d9df", background: "#f3f4f7" }} />

            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, border: "1px solid #d6d9df" }}
            />
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              style={{ width: "100%", padding: 12, marginBottom: 8, borderRadius: 10, border: "1px solid #d6d9df" }}
            />
            {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}

            <button onClick={getLocation} style={{ padding: 12, marginRight: 8, marginTop: 8 , borderRadius:"7px" ,  background:"#d3d3d3ff" , border:"1px solid #707070ff "  }}>Get Location</button>
            <button onClick={createBooking} disabled={loading} style={{ padding: 12, marginTop: 8 , borderRadius:"7px" , background:"#bdbdbdff" , border:"1px solid #707070ff "}}>
              {loading ? "Creating..." : "Confirm Booking"}
            </button>
          </div>
        )}

        {booking && (
          <div>
            <h3>Booking Summary</h3>
            {Array.isArray(booking.services) &&
              booking.services.map((s, i) => (
                <p key={i}>
                  {s.service} × {s.quantity} = ₹{s.price * s.quantity}
                </p>
              ))}
            <b>Total: ₹{booking.payment.amount}</b>
            <button onClick={payNow} style={{ padding: 12, marginTop: 12, width: "100%", background: "#1e3c72", color: "#fff", border: "none", borderRadius: 10 }}>
              Pay Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPop;

























// // BookingPop.jsx
// import React, { useState, useEffect } from "react";
// import API from "../../../config/axiosConfig";

// const SERVICES = [
//   { id: 1, service: "REFRIGERATOR POWER ISSUE", price: 199 },
//   { id: 2, service: "JET CLEAN SERVICE", price: 450 },
//   { id: 3, service: "AC GAS REFILL", price: 2499 },
//   { id: 4, service: "WASHING MACHINE ISSUE", price: 199 },
// ];

// export default function Bookingpop({ initialService = null, onClose }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [services, setServices] = useState(() => {
//     if (initialService) {
//       return [
//         { service: initialService.service, price: initialService.price, quantity: 1 },
//         { service: "", price: 0, quantity: 1 },
//       ];
//     }
//     return [{ service: "", price: 0, quantity: 1 }];
//   });
//   const [form, setForm] = useState({
//     username: "",
//     phone: "",
//     address: "",
//     lat: null,
//     lng: null,
//   });
//   const [booking, setBooking] = useState(null);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     API.get("/auth/profile")
//       .then((res) => setUser(res.data.user))
//       .catch(() => {});
//   }, []);

//   const addServiceRow = () => {
//     setServices((prev) => [...prev, { service: "", price: 0, quantity: 1 }]);
//   };

//   const updateService = (index, value) => {
//     const selected = SERVICES.find((s) => s.service === value);
//     const updated = [...services];
//     updated[index] = {
//       ...updated[index],
//       service: selected.service,
//       price: selected.price,
//     };
//     setServices(updated);
//     if (index === services.length - 1) addServiceRow();
//   };

//   const changeQty = (index, delta) => {
//     const updated = [...services];
//     updated[index].quantity = Math.max(1, updated[index].quantity + delta);
//     setServices(updated);
//   };

//   const totalAmount = services.reduce((sum, s) => sum + s.price * s.quantity, 0);

//   const getLocation = () => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setForm((p) => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.username?.trim()) newErrors.username = "Username required";
//     if (!form.phone || !/^\d{10}$/.test(form.phone)) newErrors.phone = "Valid 10-digit phone required";
//     if (!form.address?.trim()) newErrors.address = "Address required";
//     if (!services.some((s) => s.service)) newErrors.service = "Select at least one service";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const createBooking = async () => {
//     if (!validateForm()) return;
//     try {
//       setLoading(true);
//       const res = await API.post("/booking", {
//         username: user?._id || form.username,
//         phone: form.phone,
//         services: services.filter((s) => s.service),
//         location: { address: form.address, lat: form.lat, lng: form.lng },
//         payment: { amount: totalAmount, status: "pending" },
//       });
//       setBooking(res.data.booking);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       alert("Booking failed");
//     }
//   };

//   const payNow = async () => {
//     const orderRes = await API.post("/payment/order", {
//       amount: booking.payment.amount,
//     });

//     const rzp = new window.Razorpay({
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: orderRes.data.order.amount,
//       currency: "INR",
//       order_id: orderRes.data.order.id,
//       name: "Service Booking",
//       handler: async (res) => {
//         await API.post("/payment/verify", res);
//         alert("Payment Successful");
//       },
//     });

//     rzp.open();
//   };

//   const modalStyle = {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: "rgba(0,0,0,0.4)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//     padding: 10,
//     overflowY: "auto",
//   };

//   const containerStyle = {
//     background: "#fff",
//     borderRadius: 18,
//     padding: 28,
//     maxWidth: 450,
//     width: "100%",
//     boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
//     fontFamily: "Segoe UI, Tahoma, sans-serif",
//   };

//   const buttonStyle = {
//     padding: "12px 16px",
//     borderRadius: 10,
//     border: "none",
//     cursor: "pointer",
//     marginTop: 10,
//     background: "#1e3c72",
//     color: "#fff",
//     fontWeight: 600,
//   };

//   const closeButtonStyle = {
//     ...buttonStyle,
//     background: "#d32f2f",
//     float: "right",
//     marginTop: 0,
//   };

//   const errorStyle = { color: "#d32f2f", fontSize: 12, marginTop: 4 };

//   const qtyButtonStyle = {
//     padding: "4px 10px",
//     margin: "0 4px",
//     borderRadius: 6,
//     border: "1px solid #ccc",
//     cursor: "pointer",
//     background: "#f1f1f1",
//   };

//   const qtySpanStyle = { minWidth: 20, display: "inline-block", textAlign: "center" };

//   return (
//     <div style={modalStyle}>
//       <div style={containerStyle}>
//         <button style={closeButtonStyle} onClick={onClose}>
//           Close
//         </button>
//         <h2>Service Booking</h2>

//         {!booking && (
//           <div>
//             <input
//               placeholder="Username"
//               value={form.username}
//               onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
//               style={{ width: "100%", padding: 10, marginBottom: 6, borderRadius: 8, border: "1px solid #ccc" }}
//             />
//             {errors.username && <div style={errorStyle}>{errors.username}</div>}

//             {services.map((s, i) => (
//               <div key={i} style={{ marginBottom: 10 }}>
//                 <select
//                   onChange={(e) => updateService(i, e.target.value)}
//                   value={s.service}
//                   style={{ width: "70%", padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
//                 >
//                   <option value="">Select Service</option>
//                   {SERVICES.map((o) => (
//                     <option key={o.id} value={o.service}>
//                       {o.service} – ₹{o.price}
//                     </option>
//                   ))}
//                 </select>
//                 <div style={{ display: "inline-block", marginLeft: 10 }}>
//                   <button style={qtyButtonStyle} onClick={() => changeQty(i, -1)}>
//                     -
//                   </button>
//                   <span style={qtySpanStyle}>{s.quantity}</span>
//                   <button style={qtyButtonStyle} onClick={() => changeQty(i, 1)}>
//                     +
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {errors.service && <div style={errorStyle}>{errors.service}</div>}

//             <input
//               disabled
//               value={`Total ₹${totalAmount}`}
//               style={{ width: "100%", padding: 10, marginBottom: 6, borderRadius: 8, border: "1px solid #ccc", background: "#f3f4f7" }}
//             />

//             <input
//               placeholder="Address"
//               value={form.address}
//               onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
//               style={{ width: "100%", padding: 10, marginBottom: 6, borderRadius: 8, border: "1px solid #ccc" }}
//             />
//             {errors.address && <div style={errorStyle}>{errors.address}</div>}

//             <input
//               placeholder="Phone"
//               value={form.phone}
//               onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
//               style={{ width: "100%", padding: 10, marginBottom: 6, borderRadius: 8, border: "1px solid #ccc" }}
//             />
//             {errors.phone && <div style={errorStyle}>{errors.phone}</div>}

//             <div style={{ marginTop: 6 }}>
//               <button style={buttonStyle} onClick={getLocation}>
//                 Get Location
//               </button>
//               <button style={buttonStyle} onClick={createBooking} disabled={loading}>
//                 {loading ? "Creating..." : "Confirm Booking"}
//               </button>
//             </div>
//           </div>
//         )}

//         {booking && (
//           <div>
//             <h3>Booking Summary</h3>
//             {Array.isArray(booking.services) &&
//               booking.services.map((s, i) => (
//                 <p key={i}>
//                   {s.service} × {s.quantity} = ₹{s.price * s.quantity}
//                 </p>
//               ))}
//             <b>Total: ₹{booking.payment.amount}</b>
//             <div>
//               <button style={buttonStyle} onClick={payNow}>
//                 Pay Now
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











// import React, { useEffect, useState } from "react";
// import API from "../../../config/axiosConfig";
// import "./BookingSystem.css";

// const SERVICES = [
//   // Refrigerator Services
//   { id: 1, service: "REFRIGERATOR POWER ISSUE", price: 199 },
//   { id: 2, service: "REFRIGERATOR NOISE ISSUE", price: 199 },
//   { id: 3, service: "REFRIGERATOR NO COOLING", price: 199 },
//   { id: 4, service: "REFRIGERATOR EXCESS COOLING", price: 199 },
//   { id: 5, service: "REFRIGERATOR WATER LEAKAGE", price: 199 },
//   { id: 6, service: "REFRIGERATOR DOOR ISSUE", price: 199 },
//   { id: 7, service: "REFRIGERATOR LESS COOLING", price: 199 },

//   // AC Services
//   { id: 8, service: "JET CLEAN SERVICE", price: 450 },
//   { id: 9, service: "FOAM JET CLEAN SERVICE", price: 499 },
//   { id: 10, service: "AC LESS / NO COOLING REPAIR", price: 299 },
//   { id: 11, service: "AC POWER ISSUE REPAIR", price: 299 },
//   { id: 12, service: "AC NOISE / SMELL REPAIR", price: 499 },
//   { id: 13, service: "AC WATER LEAKAGE REPAIR", price: 499 },
//   { id: 14, service: "AC GAS REFILL / FULL CHECKUP", price: 2499 },
//   { id: 15, service: "AC INSTALLATION (SPLIT)", price: 1299 },
//   { id: 16, service: "AC INSTALLATION (WINDOW)", price: 999 },
//   { id: 17, service: "AC UNINSTALLATION (SPLIT)", price: 899 },
//   { id: 18, service: "AC UNINSTALLATION (WINDOW)", price: 699 },

//   // Washing Machine Services (Start from 199)
//   { id: 19, service: "WASHING MACHINE UNKNOWN ISSUE", price: 199 },
//   { id: 20, service: "WASHING MACHINE DRAINING ISSUE", price: 199 },
//   { id: 21, service: "WASHING MACHINE NOT SPINNING ISSUE", price: 199 },
//   { id: 22, service: "WASHING MACHINE ERROR ON DISPLAY / POWER ISSUE", price: 199 },
//   { id: 23, service: "WASHING MACHINE NOISE ISSUE", price: 199 },

//   // Washing Machine Installation / Uninstallation
//   { id: 24, service: "WASHING MACHINE INSTALLATION / UNINSTALLATION", price: 399 },
// ];

// const BookingSystem = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});


//   const [services, setServices] = useState([
//     { service: "", price: 0, quantity: 1 },
//   ]);

//   const [form, setForm] = useState({
//     username: "",
//     phone: "",
//     address: "",
//     lat: null,
//     lng: null,
//   });

//   const [booking, setBooking] = useState(null);

//   /* ---------------- USER PROFILE ---------------- */
//   useEffect(() => {
//     API.get("/auth/profile")
//       .then((res) => setUser(res.data.user))
//       .catch(() => {});
//   }, []);

//   /* ---------------- SERVICE HANDLERS ---------------- */
//   const addServiceRow = () => {
//     setServices((prev) => [...prev, { service: "", price: 0, quantity: 1 }]);
//   };

//   const updateService = (index, value) => {
//     const selected = SERVICES.find((s) => s.service === value);
//     const updated = [...services];
//     updated[index] = {
//       ...updated[index],
//       service: selected.service,
//       price: selected.price,
//     };
//     setServices(updated);

//     if (index === services.length - 1) addServiceRow();
//   };

//   const changeQty = (index, delta) => {
//     const updated = [...services];
//     updated[index].quantity = Math.max(1, updated[index].quantity + delta);
//     setServices(updated);
//   };

//   /* ---------------- TOTAL ---------------- */
//   const totalAmount = services.reduce(
//     (sum, s) => sum + s.price * s.quantity,
//     0
//   );

//   /* ---------------- LOCATION ---------------- */
//   const getLocation = () => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setForm((p) => ({
//         ...p,
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude,
//       }));
//     });
//   };





//   const validateForm = () => {
//   const newErrors = {};

//   // Username
//   if (!user?._id && !form.username.trim()) {
//     newErrors.username = "Username is required";
//   }

//   // Phone
//   if (!/^[0-9]{10}$/.test(form.phone)) {
//     newErrors.phone = "Enter a valid 10-digit phone number";
//   }

//   // Address
//   if (!form.address.trim()) {
//     newErrors.address = "Address is required";
//   }

//   // Services
//   const selectedServices = services.filter(s => s.service);
//   if (selectedServices.length === 0) {
//     newErrors.services = "Select at least one service";
//   }

//   // Quantity
//   selectedServices.forEach((s, i) => {
//     if (s.quantity < 1) {
//       newErrors[`qty_${i}`] = "Quantity must be at least 1";
//     }
//   });

//   // Total
//   if (totalAmount <= 0) {
//     newErrors.total = "Total amount must be greater than 0";
//   }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };




//   /* ---------------- CREATE BOOKING ---------------- */
// const createBooking = async () => {
//   if (!validateForm()) return;

//   try {
//     setLoading(true);

//     const res = await API.post("/booking", {
//       username: user?._id || form.username,
//       phone: form.phone,
//       service: services
//         .filter(s => s.service)
//         .map(s => `${s.service} × ${s.quantity}`),
//       location: {
//         address: form.address,
//         lat: form.lat,
//         lng: form.lng,
//       },
//       payment: {
//         amount: totalAmount,
//         status: "pending",
//       },
//     });

//     setBooking(res.data.booking);
//   } catch (err) {
//     alert("Booking failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   /* ---------------- PAYMENT ---------------- */
//   const payNow = async () => {
//     const orderRes = await API.post("/payment/order", {
//       amount: booking.payment.amount,
//     });

//     const rzp = new window.Razorpay({
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: orderRes.data.order.amount,
//       currency: "INR",
//       order_id: orderRes.data.order.id,
//       name: "Service Booking",
//       handler: async (res) => {
//         await API.post("/payment/verify", res);
//         alert("Payment Successful");
//       },
//     });

//     rzp.open();
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="booking-container">
//       <h2>Service Booking</h2>

//       {!booking && (
//         <div className="booking-form">
//           <input
//             placeholder="Username"
//             value={form.username}
//             onChange={(e) =>
//               setForm((p) => ({ ...p, username: e.target.value }))
//             }
//           />
//           {errors.username && <p className="error">{errors.username}</p>}


//           {services.map((s, i) => (
//             <div key={i} className="service-row">
//               <select onChange={(e) => updateService(i, e.target.value)}>
//                 <option value="">Select Service</option>
//                 {SERVICES.map((o) => (
//                   <option key={o.id} value={o.service}>
//                     {o.service} – ₹{o.price}
//                   </option>
//                 ))}
//               </select>

//               <div className="qty-control">
//                 <button onClick={() => changeQty(i, -1)}>-</button>
//                 <span>{s.quantity}</span>
//                 <button onClick={() => changeQty(i, 1)}>+</button>
//               </div>
//             </div>
//           ))}
//           {errors.services && <p className="error">{errors.services}</p>}


//           <input disabled value={`Total ₹${totalAmount}`} />

//           <input
//             placeholder="Address"
//             onChange={(e) =>
//               setForm((p) => ({ ...p, address: e.target.value }))
//             }
//           />
//            {errors.address && <p className="error">{errors.address}</p>}

//           <input
//             placeholder="Phone"
//             onChange={(e) =>
//               setForm((p) => ({ ...p, phone: e.target.value }))
//             }
//           />
//           {errors.phone && <p className="error">{errors.phone}</p>}


//           <button onClick={getLocation}>Get Location</button>
//           <button onClick={createBooking} disabled={loading}>
//             Confirm Booking
//           </button>
//           {errors.total && <p className="error">{errors.total}</p>}

//         </div>
//       )}

//       {booking && (
//         <div className="booking-summary">
//           <h3>Booking Summary</h3>

//           {Array.isArray(booking?.services) &&
//             booking.services.map((s, i) => (
//             <p key={i}>
//               {s.service} × {s.quantity} = ₹{s.price * s.quantity}
//             </p>
//           ))}

//           <b>Total: ₹{booking.payment.amount}</b>

//           <button className="pay-btn" onClick={payNow}>
//             Pay Now
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingSystem;