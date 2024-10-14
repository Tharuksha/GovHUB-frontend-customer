import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import Dashboard from "./User APP/Dashboard";
import Login from "./User APP/Login";
import Register from "./User APP/Register";
import theme from "./theme/Theme";
import AddTicket from "./Ticket App/AddTicket";
import EditTicket from "./Ticket App/EditTicket";
import TicketHistory from "./Ticket App/TicketHistory";
import ViewAppointment from "./Ticket App/ViewAppointment";
import Preloader from "./Components/Preloader";

/**
 * main application function
 * @returns App
 */
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to clear local storage and set the flag
    const clearLocalStorageOnFirstLoad = () => {
      const hasLoaded = sessionStorage.getItem("hasLoadedBefore");

      if (!hasLoaded) {
        localStorage.clear();
        console.log("Local storage cleared on first load");
        sessionStorage.setItem("hasLoadedBefore", "true");
      }
    };

    // Call the function
    clearLocalStorageOnFirstLoad();

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <main className="App">
          <ToastContainer />
          <div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addTicket" element={<AddTicket />} />
              <Route path="/editTicket" element={<EditTicket />} />
              <Route path="/ticketHistory" element={<TicketHistory />} />
              <Route path="/viewTicket" element={<ViewAppointment />} />
            </Routes>
          </div>
        </main>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
