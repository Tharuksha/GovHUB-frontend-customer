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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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
    error: {
      main: "#f44336",
      light: "#e57373",
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
    caption: {
      fontSize: "0.75rem",
      color: "#f44336",
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
            "&.Mui-error fieldset": {
              borderColor: "#f44336",
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
  const [appointmentReasons, setAppointmentReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [timeSlotAvailable, setTimeSlotAvailable] = useState(true);
  const [touchedFields, setTouchedFields] = useState({
    issueDescription: false,
    notes: false,
    appointmentDate: false,
    appointmentTime: false,
  });

  const [appointmentDetails, setAppointmentDetails] = useState({
    customerID: customer._id,
    issueDescription: "",
    notes: "",
    appointmentDate: null,
    appointmentTime: null,
    createdDate: new Date().toLocaleDateString(),
    status: "Pending",
    departmentID: departmentId,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartmentDetails = async () => {
      try {
        const res = await axios.get(
          `https://govhub-backend.onrender.com/api/departments/${departmentId}`
        );
        setDepartmentData(res.data);
        setAppointmentReasons(res.data.appointmentReasons || []);
      } catch (error) {
        console.error("Error fetching department details:", error);
        toast.error("Failed to fetch department details");
      }
    };
    getDepartmentDetails();
  }, [departmentId]);

  const checkTimeSlotAvailability = async (date, time) => {
    if (!date || !time) return true;

    setIsCheckingAvailability(true);
    try {
      const dateStr = moment(date).format("YYYY-MM-DD");
      const timeStr = moment(time).format("HH:mm");

      const response = await axios.post(
        "https://govhub-backend.onrender.com/api/tickets/check-availability",
        {
          date: dateStr,
          time: timeStr,
        }
      );

      setTimeSlotAvailable(response.data.available);
      if (!response.data.available) {
        toast.warning("This slot is already booked");
      }
      return response.data.available;
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error checking time slot availability");
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "issueDescription":
        return !value ? "Issue description is required" : "";

      case "notes":
        if (!value) return "Notes are required";
        if (value.length < 10) return "Notes must be at least 10 characters";
        if (value.length > 500) return "Notes cannot exceed 500 characters";
        return "";

      case "appointmentDate":
        if (!value) return "Appointment date is required";
        return "";

      case "appointmentTime":
        if (!value) return "Appointment time is required";
        return "";

      default:
        return "";
    }
  };

  const handleFieldBlur = (name, value) => {
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touchedFields[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleDateChange = async (date) => {
    setAppointmentDetails((prev) => ({
      ...prev,
      appointmentDate: date,
    }));

    if (date && appointmentDetails.appointmentTime) {
      await checkTimeSlotAvailability(date, appointmentDetails.appointmentTime);
    }

    if (touchedFields.appointmentDate) {
      setErrors((prev) => ({
        ...prev,
        appointmentDate: validateField("appointmentDate", date),
      }));
    }
  };

  const handleTimeChange = async (time) => {
    if (!time) {
      setAppointmentDetails((prev) => ({
        ...prev,
        appointmentTime: null,
      }));
      return;
    }

    setAppointmentDetails((prev) => ({
      ...prev,
      appointmentTime: time,
    }));

    if (time && appointmentDetails.appointmentDate) {
      await checkTimeSlotAvailability(appointmentDetails.appointmentDate, time);
    }

    if (touchedFields.appointmentTime) {
      setErrors((prev) => ({
        ...prev,
        appointmentTime: validateField("appointmentTime", time),
      }));
    }
  };

  const validate = () => {
    const newErrors = {
      issueDescription: validateField(
        "issueDescription",
        appointmentDetails.issueDescription
      ),
      notes: validateField("notes", appointmentDetails.notes),
      appointmentDate: validateField(
        "appointmentDate",
        appointmentDetails.appointmentDate
      ),
      appointmentTime: validateField(
        "appointmentTime",
        appointmentDetails.appointmentTime
      ),
    };

    setErrors(newErrors);
    setTouchedFields({
      issueDescription: true,
      notes: true,
      appointmentDate: true,
      appointmentTime: true,
    });

    return (
      Object.values(newErrors).every((error) => !error) && timeSlotAvailable
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      try {
        const combinedDateTime = moment(appointmentDetails.appointmentDate).set(
          {
            hour: appointmentDetails.appointmentTime.get("hour"),
            minute: appointmentDetails.appointmentTime.get("minute"),
            second: 0,
            millisecond: 0,
          }
        );

        // Final availability check before submission
        const isAvailable = await checkTimeSlotAvailability(
          appointmentDetails.appointmentDate,
          appointmentDetails.appointmentTime
        );

        if (!isAvailable) {
          toast.error(
            "This slot is already booked. Please select another time."
          );
          return;
        }

        const appointmentToSubmit = {
          ...appointmentDetails,
          appointmentDate: combinedDateTime.format("YYYY-MM-DD"),
          appointmentTime: combinedDateTime.format("HH:mm:ss"),
          appointmentDateTime: combinedDateTime.toISOString(),
        };

        const response = await axios.post(
          "https://govhub-backend.onrender.com/api/tickets",
          appointmentToSubmit
        );

        const emailDetails = {
          to: customer.emailAddress,
          appointmentDetails: {
            date: combinedDateTime.format("MMMM D, YYYY"),
            time: combinedDateTime.format("h:mm A"),
            department: departmentData.departmentName,
            purpose: appointmentDetails.issueDescription,
          },
        };

        try {
          await axios.post(
            "https://govhub-backend.onrender.com/api/email/appointment-confirmation",
            emailDetails
          );
          toast.success(
            "Appointment added successfully and confirmation email sent!"
          );
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          toast.warning(
            "Appointment added but confirmation email could not be sent."
          );
        }

        navigate("/ticketHistory");
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error adding appointment. Please try again.");
        }
        console.error("Error adding appointment:", error);
      } finally {
        setIsLoading(false);
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 4,
                      }}
                    >
                      <motion.img
                        src={Logo}
                        alt="Gov Hub Logo"
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 16,
                        }}
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

                  <form onSubmit={handleSubmit}>
                    <FormControl
                      fullWidth
                      sx={{ mb: 3 }}
                      error={
                        touchedFields.issueDescription &&
                        !!errors.issueDescription
                      }
                    >
                      <InputLabel id="issue-description-label">
                        Issue Description
                      </InputLabel>
                      <Select
                        labelId="issue-description-label"
                        id="issueDescription"
                        name="issueDescription"
                        value={appointmentDetails.issueDescription}
                        onChange={handleInputChange}
                        onBlur={() =>
                          handleFieldBlur(
                            "issueDescription",
                            appointmentDetails.issueDescription
                          )
                        }
                        label="Issue Description"
                        required
                      >
                        {appointmentReasons.map((reason, index) => (
                          <MenuItem key={index} value={reason}>
                            {reason}
                          </MenuItem>
                        ))}
                      </Select>
                      {touchedFields.issueDescription &&
                        errors.issueDescription && (
                          <FormHelperText error>
                            {errors.issueDescription}
                          </FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={appointmentDetails.notes}
                      onChange={handleInputChange}
                      onBlur={() =>
                        handleFieldBlur("notes", appointmentDetails.notes)
                      }
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      sx={{ mb: 3 }}
                      error={touchedFields.notes && !!errors.notes}
                      helperText={touchedFields.notes && errors.notes}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="textSecondary">
                              {appointmentDetails.notes.length}/500
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <DatePicker
                      label="Appointment Date"
                      value={appointmentDetails.appointmentDate}
                      onChange={handleDateChange}
                      onClose={() =>
                        handleFieldBlur(
                          "appointmentDate",
                          appointmentDetails.appointmentDate
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          error={
                            touchedFields.appointmentDate &&
                            !!errors.appointmentDate
                          }
                          helperText={
                            touchedFields.appointmentDate &&
                            errors.appointmentDate
                          }
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
                    />

                    <TimePicker
                      label="Appointment Time"
                      value={appointmentDetails.appointmentTime}
                      onChange={handleTimeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          required
                          error={
                            (touchedFields.appointmentTime &&
                              !!errors.appointmentTime) ||
                            !timeSlotAvailable
                          }
                          helperText={
                            (touchedFields.appointmentTime &&
                              errors.appointmentTime) ||
                            (!timeSlotAvailable &&
                              "This time slot is not available")
                          }
                          sx={{ mb: 3 }}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                {isCheckingAvailability ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <AccessTimeIcon />
                                )}
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      ampm={true}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                        gap: 2,
                      }}
                    >
                      <Button
                        color="secondary"
                        variant="outlined"
                        component={Link}
                        to="/"
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        disabled={
                          isLoading ||
                          Object.values(errors).some((error) => error) ||
                          !timeSlotAvailable ||
                          isCheckingAvailability
                        }
                        sx={{
                          position: "relative",
                          minWidth: 120,
                        }}
                      >
                        {isLoading ? (
                          <>
                            <CircularProgress
                              size={24}
                              sx={{
                                position: "absolute",
                                left: "50%",
                                marginLeft: "-12px",
                              }}
                            />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          "Add Appointment"
                        )}
                      </Button>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default AddTicket;
