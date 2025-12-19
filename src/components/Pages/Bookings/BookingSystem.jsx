import React, { useEffect, useState } from "react";
import API from "../../../config/axiosConfig";
import "./BookingSystem.css";

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

const BookingSystem = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const [services, setServices] = useState([
    { service: "", price: 0, quantity: 1 },
  ]);

  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
    lat: null,
    lng: null,
  });

  const [booking, setBooking] = useState(null);

  /* ---------------- USER PROFILE ---------------- */
  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => setUser(res.data.user))
      .catch(() => {});
  }, []);

  /* ---------------- SERVICE HANDLERS ---------------- */
  const addServiceRow = () => {
    setServices((prev) => [...prev, { service: "", price: 0, quantity: 1 }]);
  };

  const updateService = (index, value) => {
    const selected = SERVICES.find((s) => s.service === value);
    const updated = [...services];
    updated[index] = {
      ...updated[index],
      service: selected.service,
      price: selected.price,
    };
    setServices(updated);

    if (index === services.length - 1) addServiceRow();
  };

  const changeQty = (index, delta) => {
    const updated = [...services];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    setServices(updated);
  };

  /* ---------------- TOTAL ---------------- */
  const totalAmount = services.reduce(
    (sum, s) => sum + s.price * s.quantity,
    0
  );

  /* ---------------- LOCATION ---------------- */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((p) => ({
        ...p,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  };





  const validateForm = () => {
  const newErrors = {};

  // Username
  if (!user?._id && !form.username.trim()) {
    newErrors.username = "Username is required";
  }

  // Phone
  if (!/^[0-9]{10}$/.test(form.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  // Address
  if (!form.address.trim()) {
    newErrors.address = "Address is required";
  }

  // Services
  const selectedServices = services.filter(s => s.service);
  if (selectedServices.length === 0) {
    newErrors.services = "Select at least one service";
  }

  // Quantity
  selectedServices.forEach((s, i) => {
    if (s.quantity < 1) {
      newErrors[`qty_${i}`] = "Quantity must be at least 1";
    }
  });

  // Total
  if (totalAmount <= 0) {
    newErrors.total = "Total amount must be greater than 0";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};




  /* ---------------- CREATE BOOKING ---------------- */
const createBooking = async () => {
  if (!validateForm()) return;

  try {
    setLoading(true);

    const res = await API.post("/booking", {
      username: user?._id || form.username,
      phone: form.phone,
      service: services
        .filter(s => s.service)
        .map(s => `${s.service} × ${s.quantity}`),
      location: {
        address: form.address,
        lat: form.lat,
        lng: form.lng,
      },
      payment: {
        amount: totalAmount,
        status: "pending",
      },
    });

    setBooking(res.data.booking);
  } catch (err) {
    alert("Booking failed");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- PAYMENT ---------------- */
  const payNow = async () => {
    const orderRes = await API.post("/payment/order", {
      amount: booking.payment.amount,
    });

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

  /* ---------------- UI ---------------- */
  return (
    <div className="booking-container">
      <h2>Service Booking</h2>

      {!booking && (
        <div className="booking-form">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm((p) => ({ ...p, username: e.target.value }))
            }
          />
          {errors.username && <p className="error">{errors.username}</p>}


          {services.map((s, i) => (
            <div key={i} className="service-row">
              <select onChange={(e) => updateService(i, e.target.value)}>
                <option value="">Select Service</option>
                {SERVICES.map((o) => (
                  <option key={o.id} value={o.service}>
                    {o.service} – ₹{o.price}
                  </option>
                ))}
              </select>

              <div className="qty-control">
                <button onClick={() => changeQty(i, -1)}>-</button>
                <span>{s.quantity}</span>
                <button onClick={() => changeQty(i, 1)}>+</button>
              </div>
            </div>
          ))}
          {errors.services && <p className="error">{errors.services}</p>}


          <input disabled value={`Total ₹${totalAmount}`} />

          <input
            placeholder="Address"
            onChange={(e) =>
              setForm((p) => ({ ...p, address: e.target.value }))
            }
          />
           {errors.address && <p className="error">{errors.address}</p>}

          <input
            placeholder="Phone"
            onChange={(e) =>
              setForm((p) => ({ ...p, phone: e.target.value }))
            }
          />
          {errors.phone && <p className="error">{errors.phone}</p>}


          <button onClick={getLocation}>Get Location</button>
          <button onClick={createBooking} disabled={loading}>
            Confirm Booking
          </button>
          {errors.total && <p className="error">{errors.total}</p>}

        </div>
      )}

      {booking && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>

          {Array.isArray(booking?.services) &&
            booking.services.map((s, i) => (
            <p key={i}>
              {s.service} × {s.quantity} = ₹{s.price * s.quantity}
            </p>
          ))}

          <b>Total: ₹{booking.payment.amount}</b>

          <button className="pay-btn" onClick={payNow}>
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;




















// import React, { useState , useEffect} from "react";
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
//   const [errors, setErrors] = useState({});
//    const [user, setUser] = useState(null);
  
    
  
//     useEffect(() => {
//       const fetchProfile = async () => {
//         try {
//           const res = await API.get("/auth/profile");
//           setUser(res.data.user);
//           console.log(res.data.user);
//         } catch (err) {
//           setMsg(err.response?.data?.message || "Failed to load profile");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProfile();
//     }, []);
  

//   const [form, setForm] = useState({
//   username:"" ,
//   phone: "",
//   service: "",
//   price: 0,
//   quantity: 1,
//   address: "",
//   lat: null,
//   lng: null,
// });

// const getCurrentDateTime = () => {
//   const now = new Date();
//   return {
//     date: now.toISOString().split("T")[0],
//     time: now.toTimeString().slice(0, 5),
//   };
// };

// // React.useEffect(() => {
// //   if (user?.username) {
// //     setForm(prev => ({ ...prev, username: user.username }));
// //   }
// // }, []);


//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(false);

//  const handleChange = (e) => {
//   setForm({ ...form, [e.target.name]: e.target.value });
//   setErrors(prev => ({ ...prev, [e.target.name]: null }));
// };

//  const handleServiceChange = (e) => {
//   const selected = SERVICES.find(s => s.service === e.target.value);

//   setForm(prev => ({
//     ...prev,
//     service: selected.service,
//     price: selected.price * prev.quantity,
//   }));
// };

// const handleQuantityChange = (e) => {
//   const qty = Number(e.target.value);

//   const servicePrice =
//     SERVICES.find(s => s.service === form.service)?.price || 0;

//   setForm(prev => ({
//     ...prev,
//     quantity: qty,
//     price: servicePrice * qty,
//   }));
// };


//   const getLocation = () => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setForm((prev) => ({
//         ...prev,
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude,
//       }));
//     });
//   };

//   const createBooking = async () => {
//      if (!validateForm()) return;
//     try {
//       setLoading(true);

//       const { date, time } = getCurrentDateTime();

// const res = await API.post("/booking", {
//   username: user ? user._id.toString() : form.username,
//   phone: form.phone,
//   service: `${form.service} × ${form.quantity}`,
//   scheduledDate: date,
//   scheduledTime: time,
//   location: {
//     address: form.address,
//     lat: form.lat,
//     lng: form.lng,
//   },
//   payment: {
//     amount: form.price,
//     status: "pending",
//   },
//       });

//       setBooking(res.data.booking);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       alert("Booking failed");
//     }
//   };



// const payNow = async () => {
//   try {
//     if (!window.Razorpay) {
//       alert("Razorpay SDK not loaded");
//       return;
//     }

//     if (!booking?.payment?.amount) {
//       alert("Invalid booking payment");
//       return;
//     }

//     console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY);

    
//     const orderRes = await API.post("/payment/order", {
//       amount: booking.payment.amount,
//     });

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: orderRes.data.order.amount,
//       currency: "INR",
//       order_id: orderRes.data.order.id,
//       name: "AC Service Booking",
//       description: booking.service,

//       handler: async (response) => {
//         await API.post("/payment/verify", response);
//         await API.put("/booking/payment/update", {
//           bookingId: booking._id,
//           transactionId: response.razorpay_payment_id,
//         });
//         alert("Payment Successful");
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (err) {
//     console.error(err);
//     alert("Payment failed");
//   }
// };

// const validateForm = () => {
//   const newErrors = {};

//   if (!form.username?.trim()) {
//     newErrors.username = "Username is required";
//   }

//   if (!form.phone || !/^\d{10}$/.test(form.phone)) {
//     newErrors.phone = "Valid 10-digit phone number required";
//   }

//   if (!form.service) {
//     newErrors.service = "Please select a service";
//   }

//   if (!form.quantity || form.quantity < 1) {
//     newErrors.quantity = "Quantity must be at least 1";
//   }

//   if (!form.address?.trim()) {
//     newErrors.address = "Service address is required";
//   }

//   // if (!form.lat || !form.lng) {
//   //   newErrors.location = "Please fetch location";
//   // }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };


// const isFormValid =
//   form.username.trim() &&
//   /^\d{10}$/.test(form.phone) &&
//   form.service &&
//   form.quantity >= 1 &&
//   form.address.trim();






//   return (
//     <div className="booking-container">
//       <h2>Book AC Service</h2>

//       {!booking && (
//         <div className="booking-form">
//           <input
//             name="username"
//             placeholder="Username"
//             onChange={handleChange}
//             value={form.username}
//           />
//           {errors.username && <p className="error">{errors.username}</p>}

//           <select onChange={handleServiceChange}>
//             <option value="">Select Service</option>
//             {SERVICES.map((s) => (
//               <option key={s.id} value={s.service}>
//                 {s.service} – ₹{s.price}
//               </option>
//             ))}
//           </select>
//           {errors.service && <p className="error">{errors.service}</p>}

//           <input value={`₹${form.price}`} disabled />

//           <input
//             name="address"
//             placeholder="Service Address"
//             onChange={handleChange}
//              value={form.address}
//           />
//           {errors.address && <p className="error">{errors.address}</p>}
//           <input
//   name="phone"
//   placeholder="Contact Number"
//   required
//    value={form.phone}
//   onChange={handleChange}
// />
// {errors.phone && <p className="error">{errors.phone}</p>}

// Number Of Services: 
// <input
//   type="number"
//   min="1"
//   value={form.quantity}
//   onChange={handleQuantityChange}
//   placeholder="Number of services"
// />
// {errors.quantity && <p className="error">{errors.quantity}</p>}

         
//           <button onClick={getLocation}>Get Location</button>
//           <button onClick={createBooking}   disabled={loading || !isFormValid}>
//             {loading ? "Creating..." : "Confirm Booking"}
//           </button>
//         </div>
//       )}

//       {booking && (
//         <div className="booking-summary">
//           <h3>Booking Summary</h3>
//           <p><b>Service:</b> {booking.service}</p>
//           <p><b>Amount:</b> ₹{booking.payment.amount}</p>
//           <p><b>Status:</b> {booking.taskStatus}</p>

//           {booking.payment.status !== "success" && (
//             <button className="pay-btn" onClick={payNow}>
//               Pay ₹{booking.payment.amount}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingSystem;




























































// import React, { useState , useEffect} from "react";
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
//   const [errors, setErrors] = useState({});
//    const [user, setUser] = useState(null);
  
    
  
//     useEffect(() => {
//       const fetchProfile = async () => {
//         try {
//           const res = await API.get("/auth/profile");
//           setUser(res.data.user);
//           console.log(res.data.user);
//         } catch (err) {
//           setMsg(err.response?.data?.message || "Failed to load profile");
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProfile();
//     }, []);
  

//   const [form, setForm] = useState({
//   username:"" ,
//   phone: "",
//   service: "",
//   price: 0,
//   quantity: 1,
//   address: "",
//   lat: null,
//   lng: null,
// });

// const getCurrentDateTime = () => {
//   const now = new Date();
//   return {
//     date: now.toISOString().split("T")[0],
//     time: now.toTimeString().slice(0, 5),
//   };
// };

// // React.useEffect(() => {
// //   if (user?.username) {
// //     setForm(prev => ({ ...prev, username: user.username }));
// //   }
// // }, []);


//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(false);

//  const handleChange = (e) => {
//   setForm({ ...form, [e.target.name]: e.target.value });
//   setErrors(prev => ({ ...prev, [e.target.name]: null }));
// };

//  const handleServiceChange = (e) => {
//   const selected = SERVICES.find(s => s.service === e.target.value);

//   setForm(prev => ({
//     ...prev,
//     service: selected.service,
//     price: selected.price * prev.quantity,
//   }));
// };

// const handleQuantityChange = (e) => {
//   const qty = Number(e.target.value);

//   const servicePrice =
//     SERVICES.find(s => s.service === form.service)?.price || 0;

//   setForm(prev => ({
//     ...prev,
//     quantity: qty,
//     price: servicePrice * qty,
//   }));
// };


//   const getLocation = () => {
//     navigator.geolocation.getCurrentPosition((pos) => {
//       setForm((prev) => ({
//         ...prev,
//         lat: pos.coords.latitude,
//         lng: pos.coords.longitude,
//       }));
//     });
//   };

//   const createBooking = async () => {
//      if (!validateForm()) return;
//     try {
//       setLoading(true);

//       const { date, time } = getCurrentDateTime();

// const res = await API.post("/booking", {
//   username: user ? user._id.toString() : form.username,
//   phone: form.phone,
//   service: `${form.service} × ${form.quantity}`,
//   scheduledDate: date,
//   scheduledTime: time,
//   location: {
//     address: form.address,
//     lat: form.lat,
//     lng: form.lng,
//   },
//   payment: {
//     amount: form.price,
//     status: "pending",
//   },
//       });

//       setBooking(res.data.booking);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       alert("Booking failed");
//     }
//   };



// const payNow = async () => {
//   try {
//     if (!window.Razorpay) {
//       alert("Razorpay SDK not loaded");
//       return;
//     }

//     if (!booking?.payment?.amount) {
//       alert("Invalid booking payment");
//       return;
//     }

//     console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY);

    
//     const orderRes = await API.post("/payment/order", {
//       amount: booking.payment.amount,
//     });

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY,
//       amount: orderRes.data.order.amount,
//       currency: "INR",
//       order_id: orderRes.data.order.id,
//       name: "AC Service Booking",
//       description: booking.service,

//       handler: async (response) => {
//         await API.post("/payment/verify", response);
//         await API.put("/booking/payment/update", {
//           bookingId: booking._id,
//           transactionId: response.razorpay_payment_id,
//         });
//         alert("Payment Successful");
//       },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (err) {
//     console.error(err);
//     alert("Payment failed");
//   }
// };

// const validateForm = () => {
//   const newErrors = {};

//   if (!form.username?.trim()) {
//     newErrors.username = "Username is required";
//   }

//   if (!form.phone || !/^\d{10}$/.test(form.phone)) {
//     newErrors.phone = "Valid 10-digit phone number required";
//   }

//   if (!form.service) {
//     newErrors.service = "Please select a service";
//   }

//   if (!form.quantity || form.quantity < 1) {
//     newErrors.quantity = "Quantity must be at least 1";
//   }

//   if (!form.address?.trim()) {
//     newErrors.address = "Service address is required";
//   }

//   // if (!form.lat || !form.lng) {
//   //   newErrors.location = "Please fetch location";
//   // }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };


// const isFormValid =
//   form.username.trim() &&
//   /^\d{10}$/.test(form.phone) &&
//   form.service &&
//   form.quantity >= 1 &&
//   form.address.trim();






//   return (
//     <div className="booking-container">
//       <h2>Book AC Service</h2>

//       {!booking && (
//         <div className="booking-form">
//           <input
//             name="username"
//             placeholder="Username"
//             onChange={handleChange}
//             value={form.username}
//           />
//           {errors.username && <p className="error">{errors.username}</p>}

//           <select onChange={handleServiceChange}>
//             <option value="">Select Service</option>
//             {SERVICES.map((s) => (
//               <option key={s.id} value={s.service}>
//                 {s.service} – ₹{s.price}
//               </option>
//             ))}
//           </select>
//           {errors.service && <p className="error">{errors.service}</p>}

//           <input value={`₹${form.price}`} disabled />

//           <input
//             name="address"
//             placeholder="Service Address"
//             onChange={handleChange}
//              value={form.address}
//           />
//           {errors.address && <p className="error">{errors.address}</p>}
//           <input
//   name="phone"
//   placeholder="Contact Number"
//   required
//    value={form.phone}
//   onChange={handleChange}
// />
// {errors.phone && <p className="error">{errors.phone}</p>}

// Number Of Services: 
// <input
//   type="number"
//   min="1"
//   value={form.quantity}
//   onChange={handleQuantityChange}
//   placeholder="Number of services"
// />
// {errors.quantity && <p className="error">{errors.quantity}</p>}

         
//           <button onClick={getLocation}>Get Location</button>
//           <button onClick={createBooking}   disabled={loading || !isFormValid}>
//             {loading ? "Creating..." : "Confirm Booking"}
//           </button>
//         </div>
//       )}

//       {booking && (
//         <div className="booking-summary">
//           <h3>Booking Summary</h3>
//           <p><b>Service:</b> {booking.service}</p>
//           <p><b>Amount:</b> ₹{booking.payment.amount}</p>
//           <p><b>Status:</b> {booking.taskStatus}</p>

//           {booking.payment.status !== "success" && (
//             <button className="pay-btn" onClick={payNow}>
//               Pay ₹{booking.payment.amount}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingSystem;
