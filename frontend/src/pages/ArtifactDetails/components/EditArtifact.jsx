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
import UploadButton from "../../sharedComponents/UploadButton";
import AutocompleteExtended from "../../sharedComponents/AutocompleteExtended";
import { API_URLS } from "../../../api";
import ImageUploader from "./ImageUploader";
import { allowedFileTypes } from "../../Catalog/CreateArtifact";
import NotFound from "../../../components/NotFound";
import { useSnackBars } from "../../../hooks/useSnackbars";

const EditArtifact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artifactId } = useParams();
  const { addAlert } = useSnackBars();

  const [notFound, setNotFound] = useState(false);
  const [updatedArtifact, setUpdatedArtifact] = useState({
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
    fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactId}`)
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
        setUpdatedArtifact({
          thumbnail: preview,
          images: images,
          ...model,
          ...attributes,
        });
      })
      .catch((error) => console.error(error));
  }, [artifactId]);

  useEffect(() => {
    fetch(API_URLS.ALL_METADATA)
      .then((response) => response.json())
      .then((response) => {
        let metadata = response.data;

        let shapes = metadata.shapes;
        let cultures = metadata.cultures;
        let tags = metadata.tags;

        setShapeOptions(shapes);
        setCultureOptions(cultures);
        setTagOptions(tags);
      })
      .catch((error) => {
        setErrors(true);
        addAlert(error.message);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (name, value) => {
    setUpdatedArtifact({ ...updatedArtifact, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`model[object]`, updatedArtifact.object);
    formData.append(`model[texture]`, updatedArtifact.texture);
    formData.append(`model[material]`, updatedArtifact.material);
    formData.append(`thumbnail`, updatedArtifact.thumbnail);
    // New images are files, but old images are URLs
    updatedArtifact.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("new_images", image);
      } else if (
        typeof image === "string" &&
        image.includes("/media/images/")
      ) {
        formData.append("images", image);
      }
    });
    formData.append("description", updatedArtifact.description);
    formData.append("id_shape", updatedArtifact.shape.id);
    formData.append("id_culture", updatedArtifact.culture.id);
    updatedArtifact.tags.forEach((tag) => formData.append("id_tags", tag.id));

    await fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactId}/update`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => {
        addAlert("¡Objeto editado con éxito!");
        navigate(`/catalog/${artifactId}`);
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
                Editar Pieza {artifactId}
              </CustomTypography>
              <Grid container spacing={2}>
                <ColumnGrid item xs={6} rowGap={2}>
                  <UploadButton
                    label="Objeto *"
                    name="object"
                    isRequired
                    setStateFn={setUpdatedArtifact}
                    initialFilename={getFileNameOrUrl(updatedArtifact.object)}
                  />
                  <UploadButton
                    label="Textura *"
                    name="texture"
                    isRequired
                    setStateFn={setUpdatedArtifact}
                    initialFilename={getFileNameOrUrl(updatedArtifact.texture)}
                  />
                  <UploadButton
                    label="Material *"
                    name="material"
                    isRequired
                    setStateFn={setUpdatedArtifact}
                    initialFilename={getFileNameOrUrl(updatedArtifact.material)}
                  />
                  <UploadButton
                    label="Miniatura (opcional)"
                    name="thumbnail"
                    setStateFn={setUpdatedArtifact}
                    initialFilename={getFileNameOrUrl(updatedArtifact.thumbnail)}
                  />
                  <ImageUploader
                    label="Imágenes (opcional)"
                    name="images"
                    images={updatedArtifact.images}
                    onListChange={setUpdatedArtifact}
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
                    value={updatedArtifact.description}
                    onChange={(e) =>
                      handleInputChange(e.target.name, e.target.value)
                    }
                  />
                  <FormLabel component="legend">Forma *</FormLabel>
                  <AutocompleteExtended
                    id="shape"
                    name="shape"
                    value={updatedArtifact.shape}
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
                    value={updatedArtifact.culture}
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
                    value={updatedArtifact.tags}
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

export default EditArtifact;
