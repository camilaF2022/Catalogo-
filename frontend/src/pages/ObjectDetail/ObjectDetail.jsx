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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModalFormButton from "./components/ModalFormButton";
import EditForm from "./components/EditForm";
import PieceVisualization from "./components/PieceVisualization";
import ImagesCarousel from "./components/ImagesCarousel";
import { useParams } from "react-router-dom";
import DownloadForm from "./components/DownloadForm";

const ObjectDetail = ({ loggedIn }) => {
  //set a dummy piece object for initial  rendering
  const [piece, setPiece] = useState({
    attributes: {
      culture: [],
      shape: [],
      tags: [],
      description: "",
    },
    images: [],
    model: {
      object: "",
      material: "",
    },


  });
  const { pieceId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/piezas/oneArtifact/${pieceId}`)
      .then((response) => response.json())
      .then((response) => {
          setPiece(response);
      })
      .catch((error) => console.error(error));
  }, [pieceId]);
  return (
    <ContainerGrid container>
      <CenterGrid item lg={7}>
        <LeftBox>
          <CustomContainer>
            <Typography variant="h3">
              <b>#{String(pieceId).padStart(4, "0")}</b>
            </Typography>
            {loggedIn ? (
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

          <PieceVisualization
            objPath={piece.model.object}
            mtlPath={piece.model.material}
          />
          <ImagesCarousel images={piece.images}></ImagesCarousel>

        </LeftBox>
      </CenterGrid>
      <Grid item lg>
        <RightBox>
          <HorizontalStack>
            <Typography variant="h5">Cultura:</Typography>
            {piece.attributes.culture.length === 0 ? <Skeleton variant='rounded' width={100} height={40} /> :
              <CustomCultureTag label={piece.attributes.culture[1]} />
            }
          </HorizontalStack>
          <HorizontalStack>
            <Typography variant="h5"> Forma: </Typography>
            {piece.attributes.shape.length === 0 ? <Skeleton variant='rounded' width={100} height={40} /> :
              <CustomShapeTag label={piece.attributes.shape[1]} />
            }
          </HorizontalStack>
          <Typography>{piece.attributes.description.length===0 ?
            <Skeleton variant='text' width={500} height={80} />:
            piece.attributes.description 
          }</Typography>
          {
            <HorizontalStack>
              <Typography variant="h5">Etiquetas:</Typography>
              <TagContainer>
                {piece.attributes.tags.length === 0 ? <Skeleton variant='rounded' width={100} height={40} /> :
                piece.attributes.tags.map((tag, index) => (
                  <Chip key={index} label={tag[1]} />
                ))}
              </TagContainer>
            </HorizontalStack>
          }
        </RightBox>
      </Grid>
    </ContainerGrid>
  );
};

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

export default ObjectDetail;
