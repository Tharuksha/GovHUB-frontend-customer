import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSpring, animated, config } from "react-spring";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Phone,
} from "@mui/icons-material";
import Logo from "../assets/logo.png";

// Theme setup
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
            color: "black",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "#9bd7d8",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9bd7d8",
              backgroundColor: "rgba(155, 215, 216, 0.1)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(0, 0, 0, 0.6)",
          },
        },
      },
    },
  },
});

const AnimatedBox = animated(Box);
const AnimatedTextField = animated(TextField);
const AnimatedButton = animated(Button);
const AnimatedTypography = animated(Typography);
const AnimatedContainer = animated(Container);

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    if (name === "email") {
      setEmailError("");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers/login",
        { email, password }
      );
      const { token } = res.data;
      const customerRes = await axios.get(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/customers/email/${email}`
      );
      localStorage.setItem("token", token);
      localStorage.setItem("customer", JSON.stringify(customerRes.data));
      toast.success("Login successful");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(
        "Login failed! " +
          (error.response?.data?.message || "Invalid credentials")
      );
    }
  };

  const handleCallInquiries = () => {
    setShowPhoneNumber(true);
    toast.info("Call for inquiries 0776505185");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBox
        style={slideInForm}
        sx={{
          height: "100vh",
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
        }}
      >
        <AnimatedContainer component="main" maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AnimatedBox
                style={bounceLogo}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <animated.img
                  src={Logo}
                  alt="Gov Hub Logo"
                  style={{
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
                    marginBottom: "16px",
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
              </AnimatedBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <AnimatedBox
                style={slideInForm}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  padding: 4,
                  borderRadius: 3,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <AnimatedTypography
                  component="h1"
                  variant="h5"
                  sx={{ mb: 3, fontWeight: 600 }}
                >
                  Welcome to GOV HUB
                </AnimatedTypography>
                <AnimatedTypography variant="subtitle1" sx={{ mb: 3 }}>
                  Login to your account
                </AnimatedTypography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1, width: "100%" }}
                >
                  <AnimatedTextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoFocus
                    onChange={handleInputChange}
                    error={!!emailError}
                    helperText={emailError}
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
                  <AnimatedTextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    onChange={handleInputChange}
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
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: "black" },
                    }}
                    InputLabelProps={{
                      style: { color: "rgba(0, 0, 0, 0.6)" },
                    }}
                  />
                  <AnimatedTypography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account?{" "}
                    <Button
                      color="primary"
                      onClick={() => navigate("/register")}
                    >
                      Register
                    </Button>
                  </AnimatedTypography>
                  <AnimatedButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Sign In"
                    )}
                  </AnimatedButton>
                </Box>
              </AnimatedBox>
            </Grid>
          </Grid>
          {/* Call For Inquiries Button */}
          <Box sx={{ position: "fixed", right: 50, bottom: 20 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Phone />}
              onClick={handleCallInquiries}
              sx={{
                borderRadius: "20px",
                padding: "10px 20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                },
                transition: "all 0.3s ease",
                minWidth: showPhoneNumber ? "240px" : "auto",
              }}
            >
              {showPhoneNumber ? "0776505185" : "Call For Inquiries"}
            </Button>
          </Box>
        </AnimatedContainer>
      </AnimatedBox>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default LoginPage;
