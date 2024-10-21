import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Typography,
  CssBaseline,
  Grid,
  Paper,
  InputAdornment,
  TextField,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  useMediaQuery,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  createTheme,
  ThemeProvider,
  alpha,
  styled,
} from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Search,
  Dashboard as DashboardIcon,
  History as HistoryIcon,
  ExitToApp as LogoutIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
        head: {
          fontWeight: "bold",
          backgroundColor: alpha("#9bd7d8", 0.1),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
  },
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
}));

const WarningIconStyled = styled(WarningIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.warning.main,
  marginBottom: theme.spacing(2),
}));

const DeleteConfirmationModal = ({ open, onClose, onConfirm, ticketId }) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Box display="flex" flexDirection="column" alignItems="center">
          <WarningIconStyled />
          <Typography variant="h5" component="div" align="center">
            Confirm Deletion
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" align="center">
          Are you sure you want to delete the ticket with ID: {ticketId}? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{
            minWidth: 100,
            borderRadius: 20,
            mr: 1,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: 20,
            ml: 1,
          }}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

const TicketHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const customer = JSON.parse(localStorage.getItem("customer"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          value && value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [search, data]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets"
      );
      const customerTickets = response.data.filter(
        (item) => item.customerID === customer._id
      );
      setData(customerTickets);
      setFilteredData(customerTickets);
    } catch (error) {
      toast.error("Error fetching tickets.");
    }
  }, [customer._id]);

  useEffect(() => {
    fetchData(); // Initial fetch

    // Set up interval for periodic fetches
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000); // Fetch every 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const gotoViewTicket = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/viewTicket");
  };

  const gotoEditTicket = (id) => {
    localStorage.setItem("ticketId", id);
    navigate("/editTicket");
  };

  const deleteTicket = async (id) => {
    try {
      await axios.delete(
        `https://govhub-backend-6375764a4f5c.herokuapp.com/api/tickets/${id}`
      );
      toast.success("Ticket deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Error deleting ticket.");
    }
  };

  const openDeleteModal = (id) => {
    setTicketToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setTicketToDelete(null);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      deleteTicket(ticketToDelete);
      closeDeleteModal();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#ffa726";
      case "completed":
        return "#66bb6a";
      case "cancelled":
        return "#ef5350";
      default:
        return "#9e9e9e";
    }
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{row._id.slice(-6)}</TableCell>
                <TableCell>{row.departmentID}</TableCell>
                <TableCell>
                  {new Date(row.appointmentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{row.issueDescription}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    style={{
                      backgroundColor: getStatusColor(row.status),
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => gotoViewTicket(row._id)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {row.status === "Pending" && (
                    <>
                      <IconButton
                        onClick={() => gotoEditTicket(row._id)}
                        color="secondary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteModal(row._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Box>
      {filteredData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) => (
          <Card key={row._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ticket ID: {row._id.slice(-6)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Department: {row.departmentID}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(row.appointmentDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Issue: {row.issueDescription}
              </Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Chip
                  label={row.status}
                  style={{
                    backgroundColor: getStatusColor(row.status),
                    color: "white",
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <IconButton
                  onClick={() => gotoViewTicket(row._id)}
                  color="primary"
                >
                  <VisibilityIcon />
                </IconButton>
                {row.status === "Pending" && (
                  <>
                    <IconButton
                      onClick={() => gotoEditTicket(row._id)}
                      color="secondary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteModal(row._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );

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
                    Appointment History
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4 }}>
                    History of previous tickets
                  </Typography>
                </motion.div>

                <TextField
                  fullWidth
                  placeholder="Search tickets"
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

                {isMobile ? renderMobileCards() : renderDesktopTable()}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        ticketId={ticketToDelete}
      />

      <ToastContainer />
    </ThemeProvider>
  );
};

export default TicketHistory;
