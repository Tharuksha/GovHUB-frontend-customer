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
  Container,
  CssBaseline,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSpring, animated, config } from "react-spring";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Home,
  CalendarToday,
  CardMembership,
} from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Logo from "../assets/logo.png";

// Theme setup (unchanged)
const theme = createTheme({
  palette: {
    primary: {
      main: "#9bd7d8",
    },
    background: {
      default: "#e3f2fd",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "black", // Ensure text is visible
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)", // Ensure border is visible
            },
            "&:hover fieldset": {
              borderColor: "#9bd7d8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9bd7d8",
              backgroundColor: "rgba(155, 215, 216, 0.1)", // Light background when focused
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)", // Ensure label is visible
          },
        },
      },
    },
  },
});

const AnimatedBox = animated(Box);
const AnimatedTypography = animated(Typography);
const AnimatedPaper = animated(Paper);

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [customerDetails, setCustomerDetails] = useState({
    NIC: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const slideInForm = useSpring({
    from: { transform: "translateY(50px)", opacity: 0 },
    to: { transform: "translateY(0px)", opacity: 1 },
    config: config.slow,
  });

  const bounceLogo = useSpring({
    from: { transform: "scale(1)", opacity: 0 },
    to: { transform: "scale(1.1)", opacity: 1 },
    config: { tension: 180, friction: 12 },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers"
        );
        setAllCustomers(res.data);
      } catch (error) {
        toast.error("Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "NIC":
        if (!/^[0-9]{9}[Vv]$/.test(value)) {
          const nicExists = allCustomers.some(
            (customer) => customer.NIC === value
          );
          if (nicExists) {
            error = "NIC is already registered";
          } else {
            error = "NIC should be 9 digits followed by 'V' or 'v'.";
          }
        }
        break;
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z]+$/.test(value)) {
          error = "Name should only contain letters.";
        }
        break;
      case "phoneNumber":
        if (!/^\d{10}$/.test(value)) {
          error = "Phone number should be exactly 10 digits.";
        }
        break;
      case "emailAddress":
        const emailExists = allCustomers.some(
          (customer) => customer.emailAddress === value
        );
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          error = "Invalid email format.";
        }
        if (emailExists) {
          error = "Email is already registered";
        }
        break;
      case "address":
        if (value.length < 5) {
          error = "Address should be at least 5 characters long.";
        }
        break;
      case "password":
        if (value.length < 8) {
          error = "Password should be at least 8 characters long.";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const handleDateChange = (date) => {
    setCustomerDetails({ ...customerDetails, dateOfBirth: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const registeredDate = new Date().toISOString();
    const dataToSubmit = { ...customerDetails, registeredDate };

    const formErrors = Object.keys(customerDetails).reduce((acc, key) => {
      const error = validateField(key, customerDetails[key]);
      if (error) acc[key] = error;
      return acc;
    }, {});

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers",
          dataToSubmit
        );
        const email = dataToSubmit.emailAddress;
        const customerRes = await axios.get(
          `https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers/email/${email}`
        );
        const customerData = customerRes.data;
        localStorage.setItem("customer", JSON.stringify(customerData));
        setLoading(false);
        toast.success(
          "Registration successful. Please check your email for confirmation."
        );
        navigate("/login");
      } catch (error) {
        setLoading(false);
        toast.error(
          "Registration failed: " +
            (error.response?.data?.message || "An error occurred")
        );
      }
    } else {
      toast.error("Please correct the errors before submitting.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBox
        style={slideInForm}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #cce6e7, #9bd7d8)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 6s ease infinite",
          "@keyframes gradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <AnimatedPaper
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box
              sx={{
                flex: { xs: "1", md: "0 0 40%" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <animated.img
                src={Logo}
                alt="Gov Hub Logo"
                style={{
                  ...bounceLogo,
                  width: "140px",
                  height: "auto",
                  marginBottom: "24px",
                }}
              />
              <AnimatedTypography
                variant="h3"
                sx={{
                  color: "#313131",
                  fontWeight: "bold",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Gov Hub
              </AnimatedTypography>
              <AnimatedTypography
                variant="h5"
                sx={{
                  color: "#313131",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Appointment Scheduling System
              </AnimatedTypography>
            </Box>
            <Box
              sx={{
                flex: { xs: "1", md: "0 0 60%" },
                backgroundColor: "white",
                p: 4,
              }}
            >
              <AnimatedTypography
                component="h1"
                variant="h4"
                sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}
              >
                Create an Account
              </AnimatedTypography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="NIC"
                      name="NIC"
                      onChange={handleInputChange}
                      required
                      error={!!errors.NIC}
                      helperText={errors.NIC}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CardMembership />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      onChange={handleInputChange}
                      required
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      onChange={handleInputChange}
                      required
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={customerDetails.dateOfBirth}
                        onChange={handleDateChange}
                        maxDate={dayjs()}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarToday />
                                </InputAdornment>
                              ),
                              style: { color: "black" },
                            }}
                            InputLabelProps={{
                              style: { color: "rgba(0, 0, 0, 0.6)" },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">Gender</FormLabel>
                      <RadioGroup
                        row
                        name="gender"
                        value={customerDetails.gender}
                        onChange={handleInputChange}
                      >
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      onChange={handleInputChange}
                      required
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="emailAddress"
                      onChange={handleInputChange}
                      required
                      error={!!errors.emailAddress}
                      helperText={errors.emailAddress}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      onChange={handleInputChange}
                      required
                      error={!!errors.address}
                      helperText={errors.address}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Home />
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleInputChange}
                      required
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        style: { color: "black" },
                      }}
                      InputLabelProps={{
                        style: { color: "rgba(0, 0, 0, 0.6)" },
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Register"
                  )}
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Typography variant="body2">
                      Already have an account?{" "}
                      <Button
                        color="primary"
                        onClick={() => navigate("/login")}
                      >
                        Sign in
                      </Button>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </AnimatedPaper>
        </Container>
      </AnimatedBox>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Register;
