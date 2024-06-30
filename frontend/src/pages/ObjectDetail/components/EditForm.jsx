import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  FormLabel,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UploadButton from "../../Gallery/components/UploadButton";
import AutocompleteExtended from "../../Gallery/components/AutocompleteExtended";
import { API_URLS } from "../../../api";
import useSnackBars from "../../../hooks/useSnackbars";
import ImageUploader from "./ImageUploader";
import { allowedFileTypes } from "../../Gallery/CreateItem";
import NotFound from "../../../components/NotFound";

const EditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pieceId } = useParams();
  const { addAlert } = useSnackBars();

  const [notFound, setNotFound] = useState(false);
  const [updatedPiece, setUpdatedPiece] = useState({
    object: "",
    texture: "",
    material: "",
    thumbnail: "",
    images: [],
    description: "",
    shape: {
      id: "",
      value: "",
    },
    culture: {
      id: "",
      value: "",
    },
    tags: [],
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  const returnToDetails = !!location.state?.from;

  // Retrieved data from the API
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch(`${API_URLS.DETAILED_ARTIFACT}${pieceId}`)
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
        let { attributes, preview, model, images } = response;
        setUpdatedPiece({
          thumbnail: preview,
          images: images,
          ...model,
          ...attributes,
        });
      })
      .catch((error) => console.error(error));
  }, [pieceId]);

  useEffect(() => {
    fetch(API_URLS.ALL_ARTIFACTS)
      .then((response) => response.json())
      .then((response) => {
        let artifacts = response.data;

        let shapes = new Set();
        let cultures = new Set();
        let tags = new Set();

        artifacts.forEach((artifact) => {
          let { attributes } = artifact;
          let { shape, culture, tags: artifactTags } = attributes;
          shapes.add(JSON.stringify(shape));
          cultures.add(JSON.stringify(culture));
          artifactTags.forEach((tag) => tags.add(JSON.stringify(tag)));
        });

        setShapeOptions(Array.from(shapes).map(JSON.parse));
        setCultureOptions(Array.from(cultures).map(JSON.parse));
        setTagOptions(Array.from(tags).map(JSON.parse));
      })
      .catch((error) => {
        setErrors(true);
        addAlert(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (name, value) => {
    setUpdatedPiece({ ...updatedPiece, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`model[object]`, updatedPiece.object);
    formData.append(`model[texture]`, updatedPiece.texture);
    formData.append(`model[material]`, updatedPiece.material);
    formData.append(`thumbnail`, updatedPiece.thumbnail);
    // New images are files, but old images are URLs
    updatedPiece.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("new_images", image);
      } else if (
        typeof image === "string" &&
        image.includes("/media/images/")
      ) {
        formData.append("images", image);
      }
    });
    formData.append("description", updatedPiece.description);
    formData.append("id_shape", updatedPiece.shape.id);
    formData.append("id_culture", updatedPiece.culture.id);
    updatedPiece.tags.forEach((tag) => formData.append("id_tags", tag.id));

    await fetch(`${API_URLS.DETAILED_ARTIFACT}/${pieceId}/update`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        addAlert("¡Objeto editado con éxito!");
        navigate(`/catalog/${pieceId}`);
      })
      .catch((error) => {
        addAlert(error.message);
      });
  };

  const getFileNameOrUrl = (item) => {
    if (typeof item === "object" && item !== null) {
      return item.name;
    }
    if (typeof item === "string" && item.includes("/")) {
      return item.split("/").pop();
    }
    return item;
  };

  const handleCancel = () => {
    const from = location.state?.from || `/catalog`;
    navigate(from, { replace: true });
  };

  return (
    <>
      {notFound ? (
        <NotFound />
      ) : (
        <Container>
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <Grid container rowGap={4}>
              <CustomTypography variant="h1">
                Editar Pieza {pieceId}
              </CustomTypography>
              <Grid container spacing={2}>
                <ColumnGrid item xs={6} rowGap={2}>
                  <UploadButton
                    label="Objeto *"
                    name="object"
                    isRequired
                    setStateFn={setUpdatedPiece}
                    initialFilename={getFileNameOrUrl(updatedPiece.object)}
                  />
                  <UploadButton
                    label="Textura *"
                    name="texture"
                    isRequired
                    setStateFn={setUpdatedPiece}
                    initialFilename={getFileNameOrUrl(updatedPiece.texture)}
                  />
                  <UploadButton
                    label="Material *"
                    name="material"
                    isRequired
                    setStateFn={setUpdatedPiece}
                    initialFilename={getFileNameOrUrl(updatedPiece.material)}
                  />
                  <UploadButton
                    label="Miniatura (opcional)"
                    name="thumbnail"
                    setStateFn={setUpdatedPiece}
                    initialFilename={getFileNameOrUrl(updatedPiece.thumbnail)}
                  />
                  <ImageUploader
                    label="Imágenes (opcional)"
                    name="images"
                    images={updatedPiece.images}
                    onListChange={setUpdatedPiece}
                    allowedImageTypes={allowedFileTypes.images}
                  />
                </ColumnGrid>
                <ColumnGrid item xs={6} rowGap={1}>
                  <FormLabel component="legend">Descripción *</FormLabel>
                  <TextField
                    required
                    id="description"
                    name="description"
                    placeholder="Descripción del objeto"
                    multiline
                    rows={4}
                    fullWidth
                    value={updatedPiece.description}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                  <FormLabel component="legend">Forma *</FormLabel>
                  <AutocompleteExtended
                    id="shape"
                    name="shape"
                    value={updatedPiece.shape}
                    setValue={handleInputChange}
                    options={shapeOptions}
                    placeholder="Seleccionar la forma del objeto"
                    isRequired
                    fullWidth
                    filterSelectedOptions
                    disabled={loading || errors}
                  />
                  <FormLabel component="legend">Cultura *</FormLabel>
                  <AutocompleteExtended
                    id="culture"
                    name="culture"
                    value={updatedPiece.culture}
                    setValue={handleInputChange}
                    options={cultureOptions}
                    placeholder="Seleccionar la cultura del objeto"
                    isRequired
                    fullWidth
                    filterSelectedOptions
                    disabled={loading || errors}
                  />
                  <FormLabel component="legend">Etiquetas (opcional)</FormLabel>
                  <AutocompleteExtended
                    multiple
                    limitTags={3}
                    fullWidth
                    id="tags"
                    name="tags"
                    value={updatedPiece.tags}
                    setValue={handleInputChange}
                    options={tagOptions}
                    placeholder="Seleccionar las etiquetas del objeto"
                    filterSelectedOptions
                    disabled={loading || errors}
                  />
                </ColumnGrid>
              </Grid>
              <Grid container justifyContent="flex-end" columnGap={2}>
                <Button variant="text" color="secondary" onClick={handleCancel}>
                  {returnToDetails ? "Cancelar" : "Volver al catálogo"}
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </>
  );
};

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  textAlign: "left",
}));

const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default EditForm;
