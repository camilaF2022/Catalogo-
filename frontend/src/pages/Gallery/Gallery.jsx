import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container, Grid, Typography, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArtifactCard from "./components/ArtifactCard";
import CustomPagination from "./components/CustomPagination";
import CustomFilter from "./components/CustomFilter";
import useSnackBars from "../../hooks/useSnackbars";
import { API_URLS } from "../../api";

/**
 * Gallery Component
 *
 * Component for displaying artifacts with filtering, pagination, and optional new artifact creation.
 *
 * @param {boolean} loggedIn - Indicates whether the user is logged in.
 */
const Gallery = ({ loggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useSnackBars();

  const [loading, setLoading] = useState(true); // Loading state for API request
  const [errors, setErrors] = useState(false); // Error state for API request

  // Retrieved data from the API
  const [artifactList, setArtifactList] = useState([]); // Original list of artifacts from the API

  // Filtered artifacts based on CustomFilter component
  const [filteredArtifacts, setFilteredArtifacts] = useState([]); // Filtered artifacts based on user selection

  // Sliced artifacts to display on the current page
  const [artifactsToDisplay, setArtifactsToDisplay] = useState([]); // Artifacts sliced based on pagination

  // Fetch data from the API on component mount
  useEffect(() => {
    fetch(API_URLS.ALL_ARTIFACTS)
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
      .catch((error) => {
        setErrors(true);
        addAlert(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle redirection to create a new artifact page
  const handleRedirect = () => {
    navigate("/catalog/new", { state: { from: location.pathname } });
  };

  return (
    <Container>
      {/* Title */}
      <CustomTypography variant="h1">Catálogo</CustomTypography>
      {/* CustomFilter component for artifact filtering */}
      <CustomFilter
        artifactList={artifactList}
        setFilteredArtifacts={setFilteredArtifacts}
      />
      {/* Button to add a new artifact (visible if logged in) */}
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
      {/* Display loading skeleton while artifacts are loading */}
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
      ) : filteredArtifacts.length > 0 ? ( // Display filtered artifacts if there are any
        <Box>
          <Grid container spacing={2}>
            {/* Display each artifact as an ArtifactCard */}
            {artifactsToDisplay.map((artifact) => (
              <Grid item xs={12} sm={6} md={4} key={artifact.id}>
                <ArtifactCard artifact={artifact} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination component for navigating through artifacts */}
          <CustomPagination
            items={filteredArtifacts}
            setDisplayedItems={setArtifactsToDisplay}
          />
        </Box>
      ) : (
        // Display message when no artifacts match the filter criteria
        <CustomBox>
          <Typography variant="p" align="center">
            No se encontraron resultados
          </Typography>
        </CustomBox>
      )}
    </Container>
  );
};

// Styled Typography component for custom styling
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(3),
  textAlign: "center",
}));

// Styled Grid component for custom styling
const CustomBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export default Gallery;
