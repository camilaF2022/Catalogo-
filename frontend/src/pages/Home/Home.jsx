import React from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <CustomStack>
      <CustomBox>
        <CustomTypography variant="h1">Piezas Arqueológicas</CustomTypography>
        <CustomText>
          ¡Bienvenido al fascinante mundo del Museo de Arte Popular Americano
          Tomás Moro! Sumérgete en la riqueza cultural y la historia a través de
          nuestra colección de modelos 3D, fotografías e información detallada
          de piezas arqueológicas. Explora las maravillas de civilizaciones
          pasadas mientras te maravillas con la artesanía y la maestría de
          nuestros antepasados. Desde majestuosas esculturas hasta intrincados
          artefactos, nuestro sitio web ofrece una ventana única hacia el legado
          de la humanidad. Únete a nosotros en este viaje cautivador a través
          del tiempo y el espacio, donde cada pieza cuenta una historia
          extraordinaria.
        </CustomText>
        <Link to="/catalog">
          <CustomButton variant="contained" color="primary">
            Ver catálogo
          </CustomButton>
        </Link>
      </CustomBox>
    </CustomStack>
  );
};

const CustomStack = styled(Stack)(({ theme }) => ({
  justifyContent: "center",
  alignItems: "center",
  rowGap: theme.spacing(1),
  padding: theme.spacing(4),
}));

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(10),
}));

const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  textAlign: "center",
  maxWidth: "800px",
  margin: "0 auto",
}));

const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3.5),
  width: "200px",
  alignSelf: "center",
}));

const CustomText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: "1.2rem",
  textAlign: "justify",
  textJustify: "inter-word",
}));

export default Home;
