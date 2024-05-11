import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

const Login = ({ setToken, navigateTo = "" }) => {
  const navigate = useNavigate();
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
    console.log(formValues); // Send credentials to the server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Emulate POST delay
    const token = "testToken"; // Get token from the server
    setToken(token);
    navigate(navigateTo); // Redirect
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
