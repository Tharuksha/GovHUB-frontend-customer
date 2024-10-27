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

const roundToNearest15 = (time) => {
  const minutes = time.minutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  return time.clone().minutes(roundedMinutes).seconds(0).milliseconds(0);
};

const AddTicket = () => {
  const customer = JSON.parse(localStorage.getItem("customer"));
  const departmentId = localStorage.getItem("departmentId");
  const [departmentData, setDepartmentData] = useState({});
  const [operatingTime, setOperatingTime] = useState({});
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
          `https://govhub-backend-6375764a4f5c.herokuapp.com/api/departments/${departmentId}`
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

  useEffect(() => {
    setOperatingTime(getOperatingTimes(departmentData));
  }, [departmentData]);

  const checkTimeSlotAvailability = async (date, time) => {
    if (!date || !time) return true;

    setIsCheckingAvailability(true);
    try {
      const dateStr = moment(date).format("YYYY-MM-DD");
      const timeStr = moment(time).format("HH:mm");

      const response = await axios.post(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/check-availability",
        {
          date: dateStr,
          time: timeStr,
        }
      );

      setTimeSlotAvailable(response.data.available);
      if (!response.data.available) {
        toast.warning(
          response.data.message || "This time slot is not available"
        );
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
        const selectedDate = moment(value);
        const today = moment().startOf("day");

        if (selectedDate.isBefore(today)) {
          return "Cannot select past dates";
        }

        const threeMonthsFromNow = moment().add(3, "months");
        if (selectedDate.isAfter(threeMonthsFromNow)) {
          return "Cannot book appointments more than 3 months in advance";
        }

        if (selectedDate.day() === 0 || selectedDate.day() === 6) {
          return "Appointments cannot be scheduled on weekends";
        }

        return "";

      case "appointmentTime": {
        if (!value) return "Appointment time is required";

        const selectedTime = moment(value);
        const startTime = moment().set({
          hour: 8,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        const endTime = startTime
          .clone()
          .add(departmentData.operatingHours || 8, "hours");

        // Check operating hours
        if (
          selectedTime.hour() < startTime.hour() ||
          selectedTime.hour() >= endTime.hour()
        ) {
          return `Appointments must be between ${startTime.format(
            "h:mm A"
          )} and ${endTime.format("h:mm A")}`;
        }

        // Check if booking is at least 15 minutes from now
        const currentTime = moment();
        const minimumBookingTime = currentTime.clone().add(15, "minutes");

        if (
          moment(appointmentDetails.appointmentDate).isSame(
            currentTime,
            "day"
          ) &&
          selectedTime.isBefore(minimumBookingTime)
        ) {
          return "Appointments must be booked at least 15 minutes in advance";
        }

        // Validate that time is exactly on a 15-minute interval
        const minutes = selectedTime.minutes();
        if (![0, 15, 30, 45].includes(minutes)) {
          return "Appointments must be scheduled at 15-minute intervals (00, 15, 30, 45)";
        }

        return "";
      }

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

    // Round the selected time to the nearest 15-minute interval
    const roundedTime = roundToNearest15(time);

    setAppointmentDetails((prev) => ({
      ...prev,
      appointmentTime: roundedTime,
    }));

    if (roundedTime && appointmentDetails.appointmentDate) {
      await checkTimeSlotAvailability(
        appointmentDetails.appointmentDate,
        roundedTime
      );
    }

    if (touchedFields.appointmentTime) {
      setErrors((prev) => ({
        ...prev,
        appointmentTime: validateField("appointmentTime", roundedTime),
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
            "This time slot is no longer available. Please select another time."
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
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets",
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
            "https://govhub-backend-6375764a4f5c.herokuapp.com/api/email/appointment-confirmation",
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
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
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

  function getOperatingTimes(departmentData) {
    const startTime = moment().set({
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const operatingHours = departmentData.operatingHours || 8;
    const closeTime = startTime
      .clone()
      .add(operatingHours, "hours")
      .subtract(15, "minutes");
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
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ ml: 2 }}
                      >
                        (Appointments available in 15-minute intervals)
                      </Typography>
                    </Typography>
                  </Box>

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
                      disablePast
                      shouldDisableDate={(date) => {
                        return date.day() === 0 || date.day() === 6;
                      }}
                    />

                    <TimePicker
                      label="Appointment Time"
                      value={appointmentDetails.appointmentTime}
                      onChange={handleTimeChange}
                      onAccept={(time) => {
                        if (time) {
                          const roundedTime = roundToNearest15(time);
                          handleTimeChange(roundedTime);
                        }
                      }}
                      onClose={() =>
                        handleFieldBlur(
                          "appointmentTime",
                          appointmentDetails.appointmentTime
                        )
                      }
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
                      minTime={moment().set({ hour: 8, minute: 0 })}
                      maxTime={moment().set({
                        hour: 8 + (departmentData.operatingHours || 8) - 1,
                        minute: 45,
                      })}
                      views={["hours", "minutes"]}
                      ampm={false}
                      minutesStep={15}
                      shouldDisableTime={(timeValue, view) => {
                        if (view === "minutes") {
                          const minutes = timeValue.minutes();
                          return ![0, 15, 30, 45].includes(minutes);
                        }
                        return false;
                      }}
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
