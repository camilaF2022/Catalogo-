import React from 'react';
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Home Component
 *
 * Component rendering the home page content with introductory text and a link to the catalog.
 */
const Home = () => {
    return (
        <CustomStack>
            <CustomBox>
              {/* Title */}
                <CustomTypography variant="h1">Piezas Arqueológicas</CustomTypography>
                {/* Description */}
                <CustomText>
                ¡Bienvenido al fascinante mundo del Museo de Arte Popular Americano Tomás Moro!
                 Sumérgete en la riqueza cultural y la historia a través de nuestra colección de modelos 3D, fotografías e información detallada de piezas arqueológicas. Explora las maravillas de civilizaciones pasadas mientras te maravillas con la artesanía y la maestría de nuestros antepasados. Desde majestuosas esculturas hasta intrincados artefactos, nuestro sitio web ofrece una ventana única hacia el legado de la humanidad. Únete a nosotros en este viaje cautivador a través del tiempo y el espacio, donde cada pieza cuenta una historia extraordinaria.
                </CustomText>
                {/* Link to Catalog */}
                <Link to="/catalog">
                    <CustomButton variant="contained" color="primary">
                    Ver catálogo
                    </CustomButton>
                </Link>
            </CustomBox>
    </CustomStack>
    );
};

// Styled Stack component for custom styling
const CustomStack = styled(Stack)(({ theme }) => ({
    justifyContent: "center",
    alignItems: "center",
    rowGap: theme.spacing(1),
    padding: theme.spacing(4),c
    
  }));
  
  // Styled Typography component for custom styling of title
  const CustomTypography = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(10), /// Increase separation with the following text
  }));
  
  // Styled Box component for custom styling
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(4),
    textAlign: 'center',
    maxWidth: '800px', // Limit box width
    margin: '0 auto', // Center align horizontally
  }));
  

// Styled Button component for custom styling
  const CustomButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3.5),
    width: '200px', // Adjust button width
    alignSelf: 'center', // Center align button
  }));
  
  // Styled Typography component for custom styling of text description
  const CustomText = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    
    textAlign: 'left', // Left align text
    fontSize: '1.2rem', // Increase font size
  }));
  
  

export default Home;