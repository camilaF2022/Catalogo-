import React from "react";
import { styled } from "@mui/material/styles";
import { Link , useLocation, useNavigate} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@mui/material";

/**
 * MenuBar Component
 *
 * This component represents the application's navigation bar (menu).
 * It displays different navigation options based on user authentication status.
 *
 * @param {boolean} loggedIn - Indicates whether the user is logged in.
 * @param {function} setToken - Setter function to update authentication token.
 */
const MenuBar = ({ loggedIn, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handles logout by clearing the authentication token.
  const handleLogout = () => {
    setToken(null);
  };

  // Handles login click by navigating to the login page, preserving the current path.
  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  // Handles click on "Agregar objeto" button by navigating to the new object creation page, preserving the current path.
  const handleNewObjectClick = () => {
    navigate('/catalog/new', { state: { from: location.pathname } });
  };

  return (
    <AppBar position="static">
      <CustomToolbar>
        {/* Logo button with navigation to home page */}
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate('/')}>
          <img src={`${process.env.PUBLIC_URL}/logo-removebg-preview.svg`} alt="logo" style={{ height: '40px',marginLeft: 24 }} />
        </IconButton>

        {/* Catalog link */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/catalog" style={{ textDecoration: 'none', color: 'white', marginLeft: 55 }}>
            <Button color="inherit">Catálogo</Button>
          </Link>
        </Typography>

        {/* Conditional rendering based on authentication status: user can add an object with "Agregar objeto" only if they're authenticated. Otherwise, they are redirected to a login page */}
        {loggedIn && (
            <Button onClick={handleNewObjectClick} color="inherit" style={{ marginRight: 55 }}>
              Agregar objeto
            </Button>
          )}
        {!loggedIn ? (      
            <Button color="inherit" onClick={handleLoginClick}>Iniciar sesión</Button>
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        )}
      </CustomToolbar>
    </AppBar>
  );
};

// Styled Toolbar component for custom styling
const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));




export default MenuBar;
