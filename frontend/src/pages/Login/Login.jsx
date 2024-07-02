import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { useToken } from "../../hooks/useToken";
import { API_URLS } from "../../api";
import { useSnackBars } from "../../hooks/useSnackbars";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useSnackBars();
  const { setToken } = useToken();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URLS.AUTH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response
        addAlert(data.detail);
        return;
      }
      setToken(data.token.replace(/"/g, ""));
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (error) {
      // Handle any errors that occurred during fetch
      addAlert("Ha ocurrido un error durante la autenticación");
    }
  };

  return (
    <CustomStack>
      <CustomTypography variant="h1">Inicio de sesión</CustomTypography>
      <CustomBox
        component="form"
        autoComplete="off"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        <TextField
          required
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          margin="normal"
          value={formValues.email}
        />
        <TextField
          required
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          margin="normal"
          value={formValues.password}
        />
        <CustomButton variant="contained" color="primary" type="submit">
          Iniciar sesión
        </CustomButton>
      </CustomBox>
    </CustomStack>
  );
};

const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  rowGap: theme.spacing(1),
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(3),
}));

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
}));

export default Login;
