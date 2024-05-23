import React from "react";
import { styled } from "@mui/material/styles";
import { Link , useLocation, useNavigate} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@mui/material";
import logo from '../logo-removebg-preview.svg';

const MenuBar = ({ loggedIn, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setToken(null);
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  return (
    <AppBar position="static">
      <CustomToolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate('/')}>
          <img src={logo} alt="logo" style={{ height: '40px',marginLeft: 24 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/gallery" style={{ textDecoration: 'none', color: 'white', marginLeft: 55 }}>
            <Button color="inherit">Galería</Button>
          </Link>
        </Typography>
        {loggedIn && (
            <Button component={Link} to="/gallery/new" color="inherit" style={{ marginRight: 55 }}>
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

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));




export default MenuBar;
