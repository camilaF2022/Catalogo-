import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArtifactCard from "./components/ArtifactCard";
import CustomPagination from "./components/CustomPagination";
import CustomFilter from "./components/CustomFilter";

const Gallery = ({ loggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieved data from the API
  const [artifactList, setArtifactList] = useState([]);

  // Filtered artifacts
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  // Sliced artifacts to display on the current page
  const [artifactsToDisplay, setArtifactsToDisplay] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch("/pieces_models/response.json")
      .then((response) => response.json())
      .then((response) => {
        let artifacts = response.data;

        let artifactsSimplified = artifacts.map((artifact) => {
          let { id, attributes, preview } = artifact;
          return {
            id,
            attributes,
            preview,
          };
        });
        setArtifactList(artifactsSimplified);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRedirect = () => {
    navigate("/gallery/new", { state: { from: location.pathname } });
  };

  return (
    <Container>
      <CustomTypography variant="h1">Galería</CustomTypography>
      <CustomFilter
        artifactList={artifactList}
        setFilteredArtifacts={setFilteredArtifacts}
      />
      {loggedIn && (
        <CustomBox>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRedirect}
          >
            Agregar objeto
          </Button>
        </CustomBox>
      )}
      {filteredArtifacts.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {artifactsToDisplay.map((artifact) => (
              <Grid item xs={12} sm={6} md={4} key={artifact.id}>
                <ArtifactCard artifact={artifact} />
              </Grid>
            ))}
          </Grid>

          <CustomPagination
            items={filteredArtifacts}
            setDisplayedItems={setArtifactsToDisplay}
          />
        </Box>
      ) : (
        <CustomBox>
          <Typography variant="p" align="center">
            No se encontraron resultados
          </Typography>
        </CustomBox>
      )}
    </Container>
  );
};

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

const CustomBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export default Gallery;
