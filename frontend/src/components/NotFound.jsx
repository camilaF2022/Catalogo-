import React from "react";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * NotFound component represents the page displayed when a URL path doesn't match any existing routes.
 * It includes a message indicating that the page was not found.
 */
const NotFound = () => {
  return (
    <CustomStack>
      <Typography variant="h1">404 - Página no encontrada</Typography>
      <Typography variant="p">La página solicitada no existe</Typography>
    </CustomStack>
  );
};

// CustomStack styled component to center content vertically and provide padding
const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  paddingTop: theme.spacing(12), // Provides top padding equivalent to 12 units of theme spacing
}));

export default NotFound;
