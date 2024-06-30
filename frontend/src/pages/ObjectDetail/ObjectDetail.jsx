import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Chip,
  Paper,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModalFormButton from "./components/ModalFormButton";
import PieceVisualization from "./components/PieceVisualization";
import ImagesCarousel from "./components/ImagesCarousel";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DownloadForm from "./components/DownloadForm";
import NotFound from "../../components/NotFound";
import { API_URLS } from "../../api";
import { useToken } from "../../hooks/useToken";

const ObjectDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useToken();
  const loggedIn = !!token;
  const { pieceId } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [piece, setPiece] = useState({
    attributes: {
      culture: { id: "", value: "" },
      shape: { id: "", value: "" },
      tags: [],
      description: "",
    },
    preview: "",
    model: {
      object: "",
      material: "",
      texture: "",
    },
    images: [],
  });

  const handleRedirect = () => {
    navigate(`/catalog/${pieceId}/edit`, {
      state: { from: location.pathname },
    });
  };

  useEffect(() => {
    fetch(`${API_URLS.DETAILED_ARTIFACT}/${pieceId}`)
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
        setPiece(response);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [pieceId]);
  return (
    <>
      {notFound ? (
        <NotFound />
      ) : (
        <ContainerGrid>
          <LeftBox>
            <CustomContainer>
              <Typography variant="h3">
                <b>{piece.id}</b>
              </Typography>
              {loggedIn ? (
                <HorizontalStack>
                  <Button variant="contained">Descargar Pieza</Button>
                  <Button variant="contained" onClick={handleRedirect}>
                    Editar Pieza
                  </Button>
                </HorizontalStack>
              ) : (
                <ModalFormButton text={"Solicitar datos"}>
                  <DownloadForm pieceInfo={piece}></DownloadForm>
                </ModalFormButton>
              )}
            </CustomContainer>
            {!piece.model.object || !piece.model.material ? (
              <CustomDiv>
                <CircularProgress color="primary" />
              </CustomDiv>
            ) : (
              <PieceVisualization
                objPath={piece.model.object}
                mtlPath={piece.model.material}
              />
            )}
            <ImagesCarousel images={piece.images}></ImagesCarousel>
          </LeftBox>
          <RightBox>
            <Typography>
              {loading ? <CustomSkeletonText /> : piece.attributes.description}
            </Typography>
            <HorizontalStack>
              <Typography variant="h5">Cultura:</Typography>
              {loading ? (
                <CustomSkeletonTag />
              ) : (
                <CustomCultureTag label={piece.attributes.culture.value} />
              )}
            </HorizontalStack>
            <HorizontalStack>
              <Typography variant="h5"> Forma: </Typography>
              {loading ? (
                <CustomSkeletonTag />
              ) : (
                <CustomShapeTag label={piece.attributes.shape.value} />
              )}
            </HorizontalStack>
            {
              <VerticalStack>
                <Typography variant="h5">Etiquetas:</Typography>
                <TagContainer>
                  {loading ? (
                    <CustomSkeletonTag />
                  ) : piece.attributes.tags.length > 0 ? (
                    piece.attributes.tags.map((tag) => (
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

const CustomContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
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
    marginTop: theme.spacing(8),
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
  width: theme.spacing(30.5),
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

export default ObjectDetail;
