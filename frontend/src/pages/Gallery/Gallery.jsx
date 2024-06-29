import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container, Grid, Typography, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArtifactCard from "./components/ArtifactCard";
import CustomPagination from "./components/CustomPagination";
import CustomFilter from "./components/CustomFilter";
import useSnackBars from "../../hooks/useSnackbars";
import { API_URLS } from "../../api";

const Gallery = ({ loggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useSnackBars();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);

  // Retrieved data from the API
  const [artifactList, setArtifactList] = useState([]);

  // Filtered artifacts
  const [filteredArtifacts, setFilteredArtifacts] = useState([]);
  // Sliced artifacts to display on the current page
  const [artifactsToDisplay, setArtifactsToDisplay] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch(API_URLS.ALL_ARTIFACTS)
      .then((response) => response.json())
      .then((response) => {
        let artifacts = response.data;
        setArtifactList(artifacts);
      })
      .catch((error) => {
        setErrors(true);
        addAlert(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRedirect = () => {
    navigate("/catalog/new", { state: { from: location.pathname } });
  };

  return (
    <Container>
      <CustomTypography variant="h1">Catálogo</CustomTypography>
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
      {loading ? (
        <Box>
          <Grid container spacing={2}>
            {Array.from({ length: 6 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : filteredArtifacts.length > 0 ? (
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
