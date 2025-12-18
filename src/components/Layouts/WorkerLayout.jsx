import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Worker/worker.css";

export default function WorkerLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="wl-wrapper">
      {/* Sidebar */}
      <aside className={`wl-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="wl-sidebar-header">
          <h3>Worker Panel</h3>
          <button
            className="wl-close-btn"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="wl-nav">
          <NavLink to="register" className="wl-link">
            Register
          </NavLink>
          <NavLink to="loggin" className="wl-link">
            Login
          </NavLink>
          <NavLink to="profile" className="wl-link">
            Profile
          </NavLink>
          <NavLink to="tasks" className="wl-link">
            Tasks
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="wl-main">
        <header className="wl-header">
          <button
            className="wl-menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
          <h2>Dashboard</h2>
        </header>

        <section className="wl-content fade-in">
          <Outlet />
        </section>
      </main>
    </div>
  );
}



















// import { Outlet, NavLink, useNavigate } from "react-router-dom";
// import "./Worker/worker.css";

// export default function WorkerLayout() {
//   const navigate = useNavigate();

//   // const logout = () => {
//   //   localStorage.removeItem("WORKER_AUTH");
//   //   navigate("/worker/login");
//   // };   //  if protected

//   return (
//     <div className="worker-wrapper">
//       {/* Sidebar */}
//       <aside className="worker-sidebar">
//         <h3>Worker Panel</h3>

//         <NavLink to="register">Register</NavLink>
//         <NavLink to="loggin">Login</NavLink>
//         <NavLink to="profile">Profile</NavLink>
//         <NavLink to="tasks">Tasks</NavLink>

//         {/* <button className="logout" onClick={logout}>
//           Logout
//         </button> */}
//       </aside>

//       {/* Main */}
//       <main className="worker-main">
//         <header className="worker-header">
//           <h2>Dashboard</h2>
//         </header>

//         <section className="worker-content">
//           <Outlet />
//         </section>
//       </main>
//     </div>
//   );
// }










// import { useState } from "react";
// import WorkerRegister from "../Pages/Worker/WorkerRegister";
// import WorkerLogin from "../Pages/Worker/WorkerLogin";
// import WorkerProfile from "../Pages/Worker/WorkerProfile";
// import "./Layout.css"; // <-- added CSS file
// import WorkerTasks from "../Pages/Worker/WorkerTasks";

// const WorkerLayout = () => {
//   const [activeTab, setActiveTab] = useState("register");

//   return (
//     <div className="worker-container">
//       <h1 className="worker-header">Worker Zone</h1>

//       <div className="worker-dashboard">

//         {/* Sidebar */}
//         <div className="worker-sidebar">
//           <button
//             className={activeTab === "register" ? "active-btn" : "side-btn"}
//             onClick={() => setActiveTab("register")}
//           >
//             Register Worker
//           </button>

//           <button
//             className={activeTab === "login" ? "active-btn" : "side-btn"}
//             onClick={() => setActiveTab("login")}
//           >
//             Worker Login
//           </button>

//           <button
//             className={activeTab === "profile" ? "active-btn" : "side-btn"}
//             onClick={() => setActiveTab("profile")}
//           >
//             Worker Profile
//           </button>

//           <button
//             className={activeTab === "control" ? "active-btn" : "side-btn"}
//             onClick={() => setActiveTab("control")}
//           >
//             Control Panel
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="worker-main">
//           {activeTab === "register" && <WorkerRegister />}
//           {activeTab === "login" && <WorkerLogin />}
//           {activeTab === "profile" && <WorkerProfile />}
//           {activeTab === "control" && <WorkerTasks/>}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default WorkerLayout;
