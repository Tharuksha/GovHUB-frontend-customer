import { Button, Icon } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const NavItem = (props) => {
  const { name, path, icon } = props;
  const location = useLocation();

  return (
    <Button
      component="a"
      href={path}
      sx={{
        width: 180,
        height: "35px",
        backgroundColor: location.pathname === path && "#BF7EFF",
        color: location.pathname === path ? "#ffffff" : "#2d375c",
        boxShadow: location.pathname === path ? "0px 0px 4px #1c1c1c" : "none",
        fontWeight: location.pathname === path ? "bold" : "normal",
        display: "flex",
        textTransform: "none",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        marginTop: "10px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Icon
        sx={{
          width: "24px",
          height: "24px",
          marginRight: "18px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </Icon>
      {name}
    </Button>
  );
};

export default NavItem;
