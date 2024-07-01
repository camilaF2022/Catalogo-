import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArtifactCard from "./components/ArtifactCard";
import CatalogPagination from "./components/CatalogPagination";
import CatalogFilter from "./components/CatalogFilter";
import { API_URLS } from "../../api";
import { useToken } from "../../hooks/useToken";
import useFetchItems from "../../hooks/useFetchItems";

const Catalog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const loggedIn = !!token;

  const {
    items: artifactList,
    loading,
    filter,
    setFilter,
    pagination,
    setPagination,
  } = useFetchItems(API_URLS.ALL_ARTIFACTS);

  const handleRedirect = () => {
    navigate("/catalog/new", { state: { from: location } });
  };

  return (
    <Container>
      <CustomTypography variant="h1">Catálogo</CustomTypography>
      <CatalogFilter filter={filter} setFilter={setFilter} />
      {loggedIn && (
        <CustomBox>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRedirect}
          >
            Agregar pieza
          </Button>
        </CustomBox>
      )}
      {loading ? (
        <Box>
          <Grid container spacing={2}>
            {Array.from({ length: 9 }, (_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : artifactList.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {artifactList.map((artifact) => (
              <Grid item xs={12} sm={6} md={4} key={artifact.id}>
                <ArtifactCard artifact={artifact} />
              </Grid>
            ))}
          </Grid>

          <CatalogPagination
            pagination={pagination}
            setPagination={setPagination}
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

export default Catalog;
