import React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const MenuBar = ({ loggedIn, setToken }) => {
  const handleLogout = () => {
    setToken(null);
  };

  return (
    <CustomGrid container>
      <Grid item textAlign="left">
        <Link to="/gallery">
          <Button variant="text" color="secondary">
            Galería
          </Button>
        </Link>
      </Grid>
      <Grid item textAlign="right">
        {!loggedIn ? (
          <Link to="/login">
            <Button variant="text" color="secondary">
              Iniciar sesión
            </Button>
          </Link>
        ) : (
          <Button variant="text" color="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        )}
      </Grid>
    </CustomGrid>
  );
};

const CustomGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.menu.main,
  color: "white",
  height: theme.spacing(7),
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
  justifyContent: "space-between",
  display: "flex",
  alignItems: "center",
}));

export default MenuBar;
