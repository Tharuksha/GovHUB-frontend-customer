import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  CssBaseline,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  CalendarMonth,
  Person,
  Info,
  Business,
  AccessTime,
  Download,
  Check,
} from "@mui/icons-material";
import Logo from "../assets/logo.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9bd7d8",
      light: "#cce6e7",
    },
    secondary: {
      main: "#ff9a8b",
    },
    background: {
      default: "#e3f2fd",
      paper: "#ffffff",
    },
    text: {
      primary: "#313131",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      color: "#313131",
    },
    h5: {
      fontWeight: 500,
      color: "#666666",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1rem",
          padding: "10px 20px",
          borderRadius: 30,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

const ViewAppointment = () => {
  const [ticket, setTicket] = useState(null);
  const [departmentName, setDepartmentName] = useState(null);
  const [staff, setStaff] = useState({});
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem(`ticketId`);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://govhub-backend.onrender.com/api/tickets/${id}`)
      .then((response) => {
        setTicket(response.data);
        setLoading(false);
        fetchDepartmentName(response.data.departmentID);
        if (response.data.status === "Approved") {
          fetchStaff(response.data.staffID);
        }
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error);
        setLoading(false);
      });
  }, [id]);

  const fetchDepartmentName = async (id) => {
    try {
      const departmentResponse = await axios.get(
        `https://govhub-backend.onrender.com/api/departments/${id}`
      );
      setDepartmentName(departmentResponse.data.departmentName);
    } catch (error) {
      console.error("Error fetching department name:", error);
    }
  };

  const fetchStaff = async (id) => {
    try {
      const staffResponse = await axios.get(
        `https://govhub-backend.onrender.com/api/staff/${id}`
      );
      setStaff(staffResponse.data);
    } catch (error) {
      console.error("Error fetching staff name:", error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    if (!ticket) return;

    // Add logo
    const logo = new Image();
    logo.src = Logo;
    logo.onload = function () {
      doc.addImage(logo, "PNG", 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text("Gov Hub", 40, 25);
      doc.setFontSize(12);
      doc.text("Appointment Scheduling System", 40, 30);
      doc.setFontSize(16);
      doc.text(`Appointment Details :   #${ticket._id}`, 10, 50);
      doc.setFontSize(12);
      doc.text(`Ticket ID: ${ticket._id}`, 10, 60);
      doc.text(`Appointment Date: ${ticket.appointmentDate}`, 10, 70);
      doc.text(`Issue Description: ${ticket.issueDescription}`, 10, 80);
      doc.text(`Department: ${departmentName}`, 10, 90);
      doc.text(`Status: ${ticket.status}`, 10, 100);
      doc.text(`Staff Member: ${staff.firstName} ${staff.lastName}`, 10, 110);
      doc.text(`Notes: ${ticket.notes}`, 10, 120);
      doc.save("ticket-details.pdf");
    };
  };

  if (loading) {
    return <Typography variant="h6">Loading ticket details...</Typography>;
  }

  if (!ticket) {
    return <Typography variant="h6">Ticket details not available.</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          background: "linear-gradient(135deg, #cce6e7 0%, #9bd7d8 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
            <Grid container>
              {/* Sidebar */}
              <Grid item xs={12} md={3} sx={{ bgcolor: "primary.light", p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <motion.img
                      src={Logo}
                      alt="Gov Hub Logo"
                      style={{ width: 50, height: 50, marginRight: 16 }}
                      initial={{ scale: 0 }}
                      animate={{ rotate: 360, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    />
                    <Typography variant="h3" sx={{ color: "text.primary" }}>
                      Gov Hub
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: "text.secondary", mb: 4 }}
                  >
                    Appointment Scheduling System
                  </Typography>
                  <Button
                    variant="text"
                    startIcon={<DashboardIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      mb: 2,
                      color: "text.primary",
                    }}
                    component={Link}
                    to="/"
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="text"
                    startIcon={<HistoryIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      mb: 2,
                      color: "text.primary",
                    }}
                    component={Link}
                    to="/ticketHistory"
                  >
                    Appointment History
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    sx={{ mt: "auto" }}
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    Log out
                  </Button>
                </Box>
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={9} sx={{ p: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    Ticket Details
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4 }}>
                    Viewing details of ticket #{ticket._id}
                  </Typography>
                </motion.div>

                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarMonth />
                      </ListItemIcon>
                      <ListItemText
                        primary="Appointment Date"
                        secondary={ticket.appointmentDate}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        primary="Department"
                        secondary={departmentName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText
                        primary="Status"
                        secondary={ticket.status}
                      />
                    </ListItem>
                    {ticket.status === "Approved" && (
                      <ListItem>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        <ListItemText
                          primary="Staff Member"
                          secondary={`${staff.firstName} ${staff.lastName}`}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText
                        primary="Issue"
                        secondary={ticket.issueDescription}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText
                        primary="Description"
                        secondary={ticket.notes}
                      />
                    </ListItem>
                    {ticket.feedback && (
                      <ListItem>
                        <ListItemIcon>
                          <Check />
                        </ListItemIcon>
                        <ListItemText
                          primary="Feedback"
                          secondary={ticket.feedback}
                        />
                      </ListItem>
                    )}
                  </List>
                </Paper>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Button
                    color="secondary"
                    variant="outlined"
                    component={Link}
                    to="/ticketHistory"
                    sx={{ mr: 2 }}
                  >
                    Back
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    startIcon={<Download />}
                    onClick={downloadPDF}
                  >
                    Download Ticket
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default ViewAppointment;
