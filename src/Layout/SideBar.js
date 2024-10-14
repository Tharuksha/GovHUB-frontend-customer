import * as React from "react";
import { Button, Box, Icon } from "@mui/material";
import NavItem from "../Components/NavItem";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Logo from "../assets/logo.png";
import theme from "../theme/Theme";
const SideBar = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        width: 200,
        height: "100vh",
        backgroundColor: theme.palette.primary.light,
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: 200,
          height: "71px",
          marginBottom: "10px",
          backgroundColor: "#fcf7ff",
          color: "#ffffff",
        }}
      >
        <img src={Logo} height={"50px"} width={"50px"} />
      </div>
      <NavItem name="Dashboard" path="/" icon={<DashboardIcon />} />
      <NavItem name="Department" path="/department" icon={<BusinessIcon />} />
      <NavItem name="Staff" path="/staff" icon={<GroupsIcon />} />
      <NavItem name="Ticket" path="/ticket" icon={<ConfirmationNumberIcon />} />
      <Button
        variant="text"
        sx={{
          width: 180,
          height: "35px",
          color: "#ff0053",
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          fontWeight: "normal",
          alignItems: "center",
          textTransform: "none",
          boxShadow: "none",
          marginTop: "10px",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Icon
          sx={{
            width: "25px",
            height: "25px",
            marginRight: "18px",
            marginBottom: "10px",
          }}
        >
          <ExitToAppIcon />
        </Icon>
        Logout
      </Button>
    </Box>
  );
};

export default SideBar;
