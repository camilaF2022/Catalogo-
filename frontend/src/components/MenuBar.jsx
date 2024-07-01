import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Box } from "@mui/material";
import { useToken } from "../hooks/useToken";

const MenuBar = () => {
  const { token, setToken } = useToken();
  const loggedIn = !!token;
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToCatalog = () => {
    // If we are already in the catalog page, do nothing
    if (location.pathname === "/catalog") {
      return;
    }
    navigate("/catalog");
  };

  const handleNewObjectClick = () => {
    // If we are already in the new object page, do nothing
    if (location.pathname === "/catalog/new") {
      return;
    }
    navigate("/catalog/new", {
      state: { from: location },
    });
  };

  const handleLoginClick = () => {
    navigate("/login", {
      state: { from: location },
    });
  };

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={() => navigate("/")}
          >
            <img
              src={`${process.env.PUBLIC_URL}/logo.svg`}
              alt="logo"
              style={{ height: "40px" }}
            />
          </IconButton>
          <Button
            onClick={handleGoToCatalog}
            color="inherit"
            style={{ marginLeft: 55 }}
          >
            Catálogo
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexGrow: 1, justifyContent:"flex-end" }}>
          {loggedIn && (
            <Button
              onClick={handleNewObjectClick}
              color="inherit"
              style={{ marginRight: 55 }}
            >
              Agregar pieza
            </Button>
          )}
          {!loggedIn ? (
            <Button color="inherit" onClick={handleLoginClick}>
              Iniciar sesión
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;
