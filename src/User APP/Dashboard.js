import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  Grid,
  Paper,
  InputAdornment,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Search,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [navigate]);

  useEffect(() => {
    const filtered = data.filter((department) =>
      department.departmentName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, data]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/departments");
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to fetch departments. Please try again.");
    }
  };

  const gotoAddTicket = (id) => {
    localStorage.setItem("departmentId", id);
    navigate("/addTicket");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
                    onClick={() => navigate("/ticketHistory")}
                  >
                    Appointment History
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    sx={{ mt: "auto" }}
                    onClick={handleLogout}
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
                    Select Your Department
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4 }}>
                    Choose a department to schedule your appointment
                  </Typography>
                </motion.div>

                <TextField
                  fullWidth
                  placeholder="Search departments"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 30,
                      backgroundColor: alpha(theme.palette.common.white, 0.9),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 1),
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid container spacing={3}>
                  {filteredData.map((department, index) => (
                    <Grid item xs={12} sm={6} md={4} key={department._id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Paper
                          sx={{
                            p: 3,
                            textAlign: "center",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                            },
                          }}
                        >
                          <Typography variant="h6" sx={{ mb: 2, flexGrow: 1 }}>
                            {department.departmentName}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => gotoAddTicket(department._id)}
                            fullWidth
                          >
                            Select
                          </Button>
                        </Paper>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Dashboard;
