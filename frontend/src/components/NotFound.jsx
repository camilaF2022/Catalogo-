import React from "react";
import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const NotFound = () => {
  return (
    <CustomStack>
      <Typography variant="h1">404 - Página no encontrada</Typography>
      <Typography variant="p">La página solicitada no existe</Typography>
    </CustomStack>
  );
};

const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  paddingTop: theme.spacing(12),
}));

export default NotFound;
