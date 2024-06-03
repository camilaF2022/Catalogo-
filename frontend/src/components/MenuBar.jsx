import React from "react";
import { styled } from "@mui/material/styles";
import { Link , useLocation, useNavigate} from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Typography } from "@mui/material";


const MenuBar = ({ loggedIn, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setToken(null);
  };

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleNewObjectClick = () => {
    navigate('/catalog/new', { state: { from: location.pathname } });
  };

  return (
    <AppBar position="static">
      <CustomToolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => navigate('/')}>
          <img src={`${process.env.PUBLIC_URL}/logo-removebg-preview.svg`} alt="logo" style={{ height: '40px',marginLeft: 24 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/catalog" style={{ textDecoration: 'none', color: 'white', marginLeft: 55 }}>
            <Button color="inherit">Catálogo</Button>
          </Link>
        </Typography>
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

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));




export default MenuBar;
