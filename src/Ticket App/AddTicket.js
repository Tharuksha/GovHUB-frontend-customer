import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  CssBaseline,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover fieldset": {
              borderColor: "#9bd7d8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9bd7d8",
            },
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
        },
      },
    },
  },
});

const AddTicket = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const departmentId = localStorage.getItem("departmentId");
  const [departmentData, setDepartmentData] = useState({});
  const [operatingTime, setOperatingTime] = useState({});
  const [appointmentDetails, setAppointmentDetails] = useState({
    customerID: customer._id,
    issueDescription: "",
    notes: "",
    appointmentDate: null,
    createdDate: new Date().toLocaleDateString(),
    status: "Pending",
    departmentID: departmentId,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartmentDetails = async () => {
      const res = await axios.get(
        "http://localhost:8070/api/departments/" + departmentId
      );
      setDepartmentData(res.data);
    };
    getDepartmentDetails();
  }, [departmentId]);

  useEffect(() => {
    setOperatingTime(getOperatingTimes(departmentData));
  }, [departmentData]);

  const validate = () => {
    let tempErrors = {};
    tempErrors.issueDescription = appointmentDetails.issueDescription
      ? ""
      : "Issue description is required.";
    tempErrors.notes = appointmentDetails.notes ? "" : "Notes are required.";
    tempErrors.appointmentDate = appointmentDetails.appointmentDate
      ? ""
      : "Appointment date is required.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails({ ...appointmentDetails, [name]: value });
  };

  const handleDateChange = (date) => {
    setAppointmentDetails({
      ...appointmentDetails,
      appointmentDate: date.format("YYYY-MM-DD"),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        await axios.post(
          "http://localhost:8070/api/tickets",
          appointmentDetails
        );
        toast.success("Appointment added successfully!");
        navigate("/ticketHistory");
      } catch (error) {
        toast.error("Error adding appointment. Please try again.");
        console.error("Error adding appointment:", error);
      }
    }
  };

  function getOperatingTimes(departmentData) {
    const startTime = moment().set({
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const operatingHours = departmentData.operatingHours;
    const closeTime = startTime.clone().add(operatingHours, "hours");
    const formattedStartTime = startTime.format("h:mm A");
    const formattedCloseTime = closeTime.format("h:mm A");

    return {
      startTime: formattedStartTime,
      closeTime: formattedCloseTime,
    };
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{ bgcolor: "primary.light", p: 4 }}
                >
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
                      component={Link}
                      to="/login"
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
                      Add New Appointment
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                      Please fill out the form below
                    </Typography>
                  </motion.div>

                  <Box
                    sx={{
                      mb: 4,
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AccessTimeIcon sx={{ mr: 1 }} />
                      Department operating hours: {
                        operatingTime.startTime
                      } to {operatingTime.closeTime}
                    </Typography>
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="Issue"
                      name="issueDescription"
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 3 }}
                      error={!!errors.issueDescription}
                      helperText={errors.issueDescription}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      name="notes"
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      sx={{ mb: 3 }}
                      error={!!errors.notes}
                      helperText={errors.notes}
                    />
                    <DatePicker
                      label="Appointment Date"
                      value={
                        appointmentDetails.appointmentDate
                          ? moment(appointmentDetails.appointmentDate)
                          : null
                      }
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          error={!!errors.appointmentDate}
                          helperText={errors.appointmentDate}
                          sx={{ mb: 3 }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <EventIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      disablePast
                      inputFormat="DD/MM/YYYY"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                      }}
                    >
                      <Button
                        color="secondary"
                        variant="outlined"
                        component={Link}
                        to="/"
                        sx={{ mr: 2 }}
                      >
                        Back
                      </Button>
                      <Button color="primary" type="submit" variant="contained">
                        Add Appointment
                      </Button>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
        <ToastContainer />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddTicket;
