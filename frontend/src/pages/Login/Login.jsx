import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

/**
 * Login Component
 *
 * Component for user authentication with email and password.
 * Handles form submission and redirects user after successful login.
 *
 * @param {function} setToken - Function to set authentication token in parent component.
 */
const Login = ({ setToken }) => {

  // State to manage form input values
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  // React Router hooks for navigation and location tracking
  const navigate = useNavigate();
  const location = useLocation();

  // Function to update form values on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues); // Send credentials to the server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Emulate POST delay
    // Emulated token generation (replace with actual server logic)
    const token = "testToken"; // Get token from the server
    setToken(token);// Set token in parent component state

    // Determine the redirect destination after login
    const from = location.state?.from || "/";
    navigate(from, { replace: true });
  };

  return (
    <CustomStack>
      {/* Title */}
      <CustomTypography variant="h1">Inicio de sesión</CustomTypography>
      {/* Form */}
      <CustomBox
        component="form"
        autoComplete="off"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        {/* Form */}
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
// Styled Stack component for custom styling
const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  rowGap: theme.spacing(1),
}));

// Styled Typography component for custom styling of title
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(3),
}));

// Styled Box component for custom styling of form container
const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

// Styled Button component for custom styling of submit button
const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
}));

export default Login;
