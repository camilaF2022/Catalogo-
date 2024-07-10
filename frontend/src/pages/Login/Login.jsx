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

/**
 * Component for user login functionality.
 * Displays a form for users to input their email and password to authenticate.
 * Upon successful login, redirects users to the previous location or homepage.
 */
const Login = () => {
  const navigate = useNavigate(); // Hook from react-router-dom for navigation
  const location = useLocation(); // Hook from react-router-dom to get current location
  const { addAlert } = useSnackBars(); // Custom hook for displaying snackbars
  const { setToken } = useToken(); // Custom hook for managing authentication token

  // State to manage form input values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // Handle change in form input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login credentials to the server
      const response = await fetch(API_URLS.AUTH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      // Parse the response
      const data = await response.json();

      // Handle error response
      if (!response.ok) {
        addAlert(data.detail); // Display error message using snackbars
        return;
      }

      // Set authentication token and redirect user
      setToken(data.token.replace(/"/g, ""));
      const from = location.state?.from || "/"; // Redirect user to previous location or homepage
      navigate(from, { replace: true });
    } catch (error) {
      addAlert("Ha ocurrido un error durante la autenticación"); // Handle fetch errors
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
        {/* Email input field */}
        <TextField
          required
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
          margin="normal"
          value={formValues.email}
        />
        {/* Password input field */}
        <TextField
          required
          id="password"
          name="password"
          label="Contraseña"
          type="password"
          margin="normal"
          value={formValues.password}
        />
        {/* Submit button */}
        <CustomButton variant="contained" color="primary" type="submit">
          Iniciar sesión
        </CustomButton>
      </CustomBox>
    </CustomStack>
  );
};

// Styled components for customizing the layout and appearance

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
