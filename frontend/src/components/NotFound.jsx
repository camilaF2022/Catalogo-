import React from "react";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

/**
 * NotFound Component
 *
 * This component is displayed when a user navigates to a non-existent page (404 error).
 * It informs the user that the requested page does not exist.
 */

const NotFound = () => {
  return (
    
    <CustomStack>
      {/* Heading for 404 error */}
      <Typography variant="h1">404 - Página no encontrada</Typography>
      
      {/* Description of the error */}
      <Typography variant="p">La página solicitada no existe</Typography>
    </CustomStack>
  );
};

// Styled Stack component for custom styling
const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  paddingTop: theme.spacing(12),
}));

export default NotFound;
