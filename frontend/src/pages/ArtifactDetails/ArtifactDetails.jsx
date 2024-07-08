import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Chip,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { Category, Diversity3, LocalOffer } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import DownloadArtifactButton from "./components/DownloadArtifactButton";
import ModelVisualization from "./components/ModelVisualization";
import ImagesCarousel from "./components/ImagesCarousel";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DownloadArtifactForm from "./components/DownloadArtifactForm";
import NotFound from "../../components/NotFound";
import { API_URLS } from "../../api";
import { useToken } from "../../hooks/useToken";
import { useSnackBars } from "../../hooks/useSnackbars";

const ArtifactDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const { addAlert } = useSnackBars();
  const loggedIn = !!token;
  const { artifactId } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [artifact, setArtifact] = useState({
    attributes: {
      culture: { id: "", value: "" },
      shape: { id: "", value: "" },
      tags: [],
      description: "",
    },
    thumbnail: "",
    model: {
      object: "",
      material: "",
      texture: "",
    },
    images: [],
  });

  const handleRedirect = () => {
    navigate(`/catalog/${artifactId}/edit`, {
      state: { from: location },
    });
  };

  useEffect(() => {
    fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
            return;
          }
        }
        return response.json();
      })
      .then((response) => {
        setArtifact(response);
      })
      .finally(() => setLoading(false));
  }, [artifactId]);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${API_URLS.DETAILED_ARTIFACT}/${artifactId}/download`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        addAlert(data.detail);
        return;
      }

      // If the code reaches here, the first fetch was successful
      // Proceed with the second fetch
      const downloadResponse = await fetch(
        `${API_URLS.DETAILED_ARTIFACT}/${artifactId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([await downloadResponse.blob()])
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `artifact_${artifactId}.zip`;
      link.click();
      link.remove();
      addAlert("Descarga exitosa");
    } catch (error) {
      addAlert("Error al descargar pieza");
    }
  };

  return (
    <>
      {notFound ? (
        <NotFound />
      ) : (
        <ContainerGrid>
          <LeftBox>
            <CustomContainer>
              <Typography variant="h4">
                <b>Pieza {artifact.id}</b>
              </Typography>
              {loggedIn ? (
                <HorizontalStack>
                  <Button variant="contained" onClick={handleDownload}>
                    Descargar Pieza
                  </Button>
                  <Button variant="contained" onClick={handleRedirect}>
                    Editar Pieza
                  </Button>
                </HorizontalStack>
              ) : (
                <DownloadArtifactButton text={"Solicitar datos"}>
                  <DownloadArtifactForm
                    artifactInfo={artifact}
                  ></DownloadArtifactForm>
                </DownloadArtifactButton>
              )}
            </CustomContainer>
            {!artifact.model.object || !artifact.model.material ? (
              <CustomDiv>
                <CircularProgress color="primary" />
              </CustomDiv>
            ) : (
              <ModelVisualization
                objPath={artifact.model.object}
                mtlPath={artifact.model.material}
              />
            )}
            <ImagesCarousel images={artifact.images}></ImagesCarousel>
          </LeftBox>
          <RightBox>
            <Typography>
              {loading ? (
                <CustomSkeletonText />
              ) : (
                artifact.attributes.description
              )}
            </Typography>
            <HorizontalStack>
              <Typography variant="h5">
                <Category color="inherit" fontSize="small" /> Forma:{" "}
              </Typography>
              {loading ? (
                <CustomSkeletonTag />
              ) : (
                <CustomShapeTag label={artifact.attributes.shape.value} />
              )}
            </HorizontalStack>
            <HorizontalStack>
              <Typography variant="h5">
                {" "}
                <Diversity3 color="interhit" fontSize="small" /> Cultura:
              </Typography>
              {loading ? (
                <CustomSkeletonTag />
              ) : (
                <CustomCultureTag label={artifact.attributes.culture.value} />
              )}
            </HorizontalStack>
            {
              <VerticalStack>
                <Typography variant="h5">
                  <LocalOffer color="inherit" fontSize="small" /> Etiquetas:
                </Typography>
                <TagContainer>
                  {loading ? (
                    <CustomSkeletonTag />
                  ) : artifact.attributes.tags.length > 0 ? (
                    artifact.attributes.tags.map((tag) => (
                      <Chip key={tag.id} label={tag.value} />
                    ))
                  ) : (
                    <p>Sin etiquetas</p>
                  )}
                </TagContainer>
              </VerticalStack>
            }
          </RightBox>
        </ContainerGrid>
      )}
    </>
  );
};

const CustomContainer = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: theme.spacing(5.25),
}));
const HorizontalStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
}));
const VerticalStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const LeftBox = styled("div")(({ theme }) => ({
  width: theme.spacing(83),
  [theme.breakpoints.up("md")]: {
    width: theme.spacing(106.5),
  },
  [theme.breakpoints.up("xl")]: {
    width: theme.spacing(140),
  },
  [theme.breakpoints.up("xxl")]: {
    width: theme.spacing(175.5),
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(1),
}));

const RightBox = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  backgroundColor: "#fff",
  [theme.breakpoints.down("md")]: {
    width: theme.spacing(83),
    minWidth: theme.spacing(83),
  },
  [theme.breakpoints.up("md")]: {
    width: theme.spacing(104.5),
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: theme.spacing(6.25),
    width: theme.spacing(28),
    height: theme.spacing(69),
    gap: theme.spacing(1.7),
  },
  [theme.breakpoints.up("xl")]: {
    width: theme.spacing(34.25),
  },
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

const ContainerGrid = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  paddingRight: theme.spacing(5),
  paddingLeft: theme.spacing(5),
  gap: theme.spacing(1),
  [theme.breakpoints.up("lg")]: {
    gap: theme.spacing(3),
  },
}));

const TagContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  width: "100%",
  gap: theme.spacing(1),
}));

const CustomShapeTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.shape,
}));

const CustomCultureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.tags.culture,
}));

const CustomSkeletonTag = styled(Skeleton)(({ theme }) => ({
  width: theme.spacing(13),
  height: theme.spacing(8),
  variant: "rounded",
}));

const CustomSkeletonText = styled(Skeleton)(({ theme }) => ({
  width: theme.spacing(28),
  height: theme.spacing(10),
  variant: "text",
}));

const CustomDiv = styled("div")(({ theme }) => ({
  width: "100%",
  height: theme.spacing(75),
  backgroundColor: "#2e2d2c",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default ArtifactDetails;
