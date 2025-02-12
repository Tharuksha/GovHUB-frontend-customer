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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Edit as EditIcon,
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

const EditTicket = () => {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer"));
  const ticketID = localStorage.getItem("ticketId");
  const [appointmentDetails, setAppointmentDetails] = useState({
    customerID: customer._id,
    issueDescription: "",
    notes: "",
    appointmentDate: "",
    createdDate: "",
    status: "Pending",
    departmentID: localStorage.getItem("departmentId"),
  });
  const [errors, setErrors] = useState({});
  const [appointmentReasons, setAppointmentReasons] = useState([]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const res = await axios.get(
          `https://govhub-backend.onrender.com/api/tickets/${ticketID}`
        );
        setAppointmentDetails(res.data);

        // Fetch department details to get appointment reasons
        const deptRes = await axios.get(
          `https://govhub-backend.onrender.com/api/departments/${res.data.departmentID}`
        );
        setAppointmentReasons(deptRes.data.appointmentReasons || []);
      } catch (error) {
        toast.error("Error fetching ticket details.");
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [ticketID]);

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
        await axios.put(
          `https://govhub-backend.onrender.com/api/tickets/${ticketID}`,
          appointmentDetails
        );
        toast.success("Appointment updated successfully!");
        navigate("/ticketHistory");
      } catch (error) {
        toast.error("Error updating appointment. Please try again.");
        console.error("Error updating appointment:", error);
      }
    }
  };

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
                      Edit Appointment
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4 }}>
                      Please update the form below
                    </Typography>
                  </motion.div>

                  <form onSubmit={handleSubmit}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel id="issue-description-label">
                        Issue Description
                      </InputLabel>
                      <Select
                        labelId="issue-description-label"
                        id="issueDescription"
                        name="issueDescription"
                        value={appointmentDetails.issueDescription}
                        onChange={handleInputChange}
                        label="Issue Description"
                        required
                        error={!!errors.issueDescription}
                      >
                        {appointmentReasons.map((reason, index) => (
                          <MenuItem key={index} value={reason}>
                            {reason}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.issueDescription && (
                        <Typography color="error" variant="caption">
                          {errors.issueDescription}
                        </Typography>
                      )}
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      onChange={handleInputChange}
                      value={appointmentDetails.notes}
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
                      value={moment(appointmentDetails.appointmentDate)}
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
                        to="/ticketHistory"
                        sx={{ mr: 2 }}
                      >
                        Back
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        startIcon={<EditIcon />}
                      >
                        Update Appointment
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

export default EditTicket;
