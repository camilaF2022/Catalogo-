import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Chip,
  Grid,
  Container,
  Stack,
  Box,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModalFormButton from "./components/ModalFormButton";
import EditForm from "./components/EditForm";
import PieceVisualization from "./components/PieceVisualization";
import ImagesCarousel from "./components/ImagesCarousel";
import { useParams } from "react-router-dom";
import DownloadForm from "./components/DownloadForm";
import NotFound from "../../components/NotFound";
import { API_URLS } from "../../api";

/**
 * ObjectDetail Component
 *
 * Component for displaying detailed information about an artifact object.
 *
 * @param {boolean} loggedIn - Flag indicating if the user is logged in.
 */
const ObjectDetail = ({ loggedIn }) => {
  // set a dummy piece object for initial  rendering
  const { pieceId } = useParams(); // Extracts pieceId from URL params
  const [notFound, setNotFound] = useState(false); // State to manage 404 not found state
  const [piece, setPiece] = useState({
    attributes: {
      culture: {id: "", value: ""},
      shape: {id: "", value: ""},
      tags: [],
      description: "",
    },
    images: [],
    model: {
      object: "",
      material: "",
    },
  }); // State for storing detailed piece information

  // Fetches piece details from the API based on pieceId
  useEffect(() => {
    fetch(`${API_URLS.DETAILED_ARTIFACT}${pieceId}`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true); // Sets notFound state if the piece is not found
            return;
          }
        }
        return response.json(); // Parses response JSON
      })
      .then((response) => {
        setPiece(response); // Sets piece state with fetched data
      })
      .catch((error) => console.error(error)); // Handles fetch errors
  }, [pieceId]); // Runs effect on pieceId change
  return (
    <>
      {notFound ? ( // Renders NotFound component if piece is not found
        <NotFound />
      ) : (
        <ContainerGrid container>
          <CenterGrid item lg={7}>
            <LeftBox>
              <CustomContainer>
                <Typography variant="h3">
                  <b>#{piece.id && String(piece.id).padStart(4, "0")}</b>
                </Typography>
                {loggedIn ? ( // Conditionally renders download and edit buttons based on loggedIn prop
                  <HorizontalStack>
                    <Button variant="contained">Descargar Pieza</Button>

                    <ModalFormButton text={"Editar Pieza"}>
                      <EditForm />
                    </ModalFormButton>
                  </HorizontalStack>
                ) : (
                  <ModalFormButton text={"Solicitar datos"}>
                    <DownloadForm pieceInfo={piece}></DownloadForm>
                  </ModalFormButton>
                )}
              </CustomContainer>

              {!piece.model.object || !piece.model.material ? ( // Renders loading indicator if object or material paths are not available
                <CustomDiv>
                  <CircularProgress color="primary" />
                </CustomDiv>
              ) : (
                <PieceVisualization // Renders PieceVisualization component with object and material paths
                  objPath={piece.model.object}
                  mtlPath={piece.model.material}
                />
              )}
              <ImagesCarousel images={piece.images}></ImagesCarousel>
            </LeftBox>
          </CenterGrid>
          <Grid item lg>
            <RightBox>
              <HorizontalStack>
                <Typography variant="h5">Cultura:</Typography>
                {piece.attributes.culture.value === "" ? ( // Renders skeleton tag if culture value is empty
                  <CustomSkeletonTag />
                ) : (
                  <CustomCultureTag label={piece.attributes.culture.value} />
                )}
              </HorizontalStack>
              <HorizontalStack>
                <Typography variant="h5"> Forma: </Typography>
                {piece.attributes.shape.value === ""  ? ( // Renders skeleton tag if shape value is empty
                  <CustomSkeletonTag />
                ) : (
                  <CustomShapeTag label={piece.attributes.shape.value} />
                )}
              </HorizontalStack>
              <Typography>
                {piece.attributes.description === "" ? ( // Renders skeleton text if description is empty
                  <CustomSkeletonText />
                ) : (
                  piece.attributes.description
                )}
              </Typography>
              {
                <HorizontalStack>
                  <Typography variant="h5">Etiquetas:</Typography>
                  <TagContainer>
                    {piece.attributes.tags.length === 0 ? (
                      <CustomSkeletonTag />
                    ) : (
                      piece.attributes.tags.map((tag) => ( // Maps and renders each tag as a Chip component
                        <Chip key={tag.id} label={tag.value} />
                      ))
                    )}
                  </TagContainer>
                </HorizontalStack>
              }
            </RightBox>
          </Grid>
        </ContainerGrid>
      )}{" "}
    </>
  );
};

// Styled Components
const CustomContainer = styled(Container)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
const HorizontalStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const LeftBox = styled(Box)(({ theme }) => ({
  width: theme.spacing(73),

  [theme.breakpoints.up("md")]: {
    width: theme.spacing(83),
  },
  [theme.breakpoints.up("xl")]: {
    width: theme.spacing(106),
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
}));

const RightBox = styled(Stack)(({ theme }) => ({
  paddingRight: theme.spacing(7),
  marginTop: theme.spacing(10),

  [theme.breakpoints.down("lg")]: {
    marginLeft: theme.spacing(15),
  },
  [theme.breakpoints.down("md")]: {
    marginLeft: theme.spacing(8),
    marginTop: theme.spacing(3),
  },
  gap: theme.spacing(4),
}));

const CenterGrid = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const ContainerGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
}));

const TagContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
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
  width: theme.spacing(62.5),
  height: theme.spacing(10),
  variant: "text",
}));

const CustomDiv = styled("div")(() => ({
  width: "100%",
  height: "500px",
  backgroundColor: "#2e2d2c",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export default ObjectDetail;
