import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllTours from "./pages/AllTours";
import TourDetails from "./pages/TourDetails";
import About from "./pages/About";
import MyBookings from "./pages/MyBookings";
import Contact from "./pages/Contact";
import Layout from "./pages/Dashboard/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import AddTour from "./pages/Dashboard/AddTour.jsx";
import ListTour from "./pages/Dashboard/ListTour.jsx";
import { useAppContext } from "./context/AppContext.jsx";

// Nếu bạn vẫn còn value={{value}} trong AppContext, dùng dòng dưới:
const useCtx = () => {
  const ctx = useAppContext();
  return ctx.value ?? ctx; // hỗ trợ cả hai trường hợp
};

// Guard: chỉ admin mới vào /admin
const RequireAdmin = ({ children }) => {
  const { isAdmin } = useCtx();
  return isAdmin ? children : <Navigate to="/" replace />;
};

// "/" → admin chuyển sang /admin, còn lại Home
const RedirectRoot = () => {
  const { isAdmin } = useCtx();
  return isAdmin ? <Navigate to="/admin" replace /> : <Home />;
};

const App = () => {
  const isAdminPath = useLocation().pathname.startsWith("/admin");
  const { isAdmin } = useCtx();

  return (
    <div>
      {!isAdminPath && <Navbar />}

      <div className="min-h-[70vh]">
        <Routes>
          {/* Root auto-redirect theo role */}
          <Route path="/" element={<RedirectRoot />} />

          {/* Routes người dùng (user/guest đều vào được) */}
          <Route path="/tours" element={<AllTours />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/contact" element={<Contact />} />

          {/* Cụm admin (không render Layout bên ngoài nữa) */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Layout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-tour" element={<AddTour />} />
            <Route path="list-tour" element={<ListTour />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminPath && <Footer />}
    </div>
  );
};

export default App;
