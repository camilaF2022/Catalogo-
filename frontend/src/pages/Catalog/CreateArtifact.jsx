import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import UploadButton from "../sharedComponents/UploadButton";
import AutocompleteExtended from "../sharedComponents/AutocompleteExtended";
import { API_URLS } from "../../api";
import { useSnackBars } from "../../hooks/useSnackbars";
import { useToken } from "../../hooks/useToken";

// Allowed file types for various artifact attributes
export const allowedFileTypes = {
  object: ["obj"],
  texture: ["jpg"],
  material: ["mtl"],
  thumbnail: ["jpg", "png"],
  images: ["jpg", "png"],
};

/**
 * Component for creating a new artifact.
 * Allows users to upload object-related files, provide description, select shape, culture, and tags.
 * Submits artifact data to the server and handles navigation.
 */
const CreateArtifact = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useSnackBars();
  const { token } = useToken();

  // State to manage new artifact attributes and form loading state
  const [newObjectAttributes, setNewObjectAttributes] = useState({
    object: {},
    texture: {},
    material: {},
    thumbnail: {},
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

  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [errors, setErrors] = useState(false); // Error state for API fetch

  const goBack = !!location.state?.from; // Checks if there's a 'from' location to navigate back

  // State to store fetched metadata options
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // Fetch metadata (shapes, cultures, tags) from the API on component mount
  useEffect(() => {
    fetch(API_URLS.ALL_METADATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener metadatos");
        }
        return response.json();
      })
      .then((data) => {
        let metadata = data.data;
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
  }, []); // Dependency array ensures this effect runs only once on mount

  // Function to handle input changes in the form fields
  const handleInputChange = (name, value) => {
    setNewObjectAttributes({ ...newObjectAttributes, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`model[new_object]`, newObjectAttributes.object);
    formData.append(`model[new_texture]`, newObjectAttributes.texture);
    formData.append(`model[new_material]`, newObjectAttributes.material);
    formData.append(`new_thumbnail`, newObjectAttributes.thumbnail);
    newObjectAttributes.images.forEach((image) =>
      formData.append("new_images", image)
    );
    formData.append("description", newObjectAttributes.description);
    formData.append("id_shape", newObjectAttributes.shape.id);
    formData.append("id_culture", newObjectAttributes.culture.id);
    newObjectAttributes.tags.forEach((tag) =>
      formData.append("id_tags", tag.id)
    );

    try {
      const response = await fetch(`${API_URLS.DETAILED_ARTIFACT}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }

      const data = await response.json();
      const newArtifactId = data.data.id;
      addAlert("¡Objeto creado con éxito!");
      navigate(`/catalog/${newArtifactId}`);
    } catch (error) {
      addAlert(error.message);
    }
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    const from = goBack ? location.state.from : "/catalog";
    navigate(from, { replace: goBack });
  };

  // Render component
  return (
    <Container>
      {/* Form for creating a new artifact */}
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container rowGap={4}>
          {/* Page title */}
          <CustomTypography variant="h1">Agregar nueva pieza</CustomTypography>

          {/* Grid container for form inputs */}
          <Grid container spacing={2}>
            {/* Column for upload buttons */}
            <ColumnGrid item xs={6} rowGap={2}>
              <UploadButton
                label="Objeto *"
                name="object"
                isRequired
                setStateFn={setNewObjectAttributes}
              />
              <UploadButton
                label="Textura *"
                name="texture"
                isRequired
                setStateFn={setNewObjectAttributes}
              />
              <UploadButton
                label="Material *"
                name="material"
                isRequired
                setStateFn={setNewObjectAttributes}
              />
              <UploadButton
                label="Miniatura (opcional)"
                name="thumbnail"
                setStateFn={setNewObjectAttributes}
              />
              <UploadButton
                label="Imágenes (opcional)"
                name="images"
                isMultiple
                setStateFn={setNewObjectAttributes}
              />
            </ColumnGrid>

            {/* Column for text fields and autocomplete components */}
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
                value={newObjectAttributes.description}
                onChange={(e) =>
                  handleInputChange(e.target.name, e.target.value)
                }
              />

              <FormLabel component="legend">Forma *</FormLabel>
              <AutocompleteExtended
                id="shape"
                name="shape"
                value={newObjectAttributes.shape}
                setValue={handleInputChange}
                options={shapeOptions}
                placeholder="Seleccionar la forma del objeto"
                isRequired
                fullWidth
                filterSelectedOptions
                disabled={loading || errors}
                allowCreation={false}
              />

              <FormLabel component="legend">Cultura *</FormLabel>
              <AutocompleteExtended
                id="culture"
                name="culture"
                value={newObjectAttributes.culture}
                setValue={handleInputChange}
                options={cultureOptions}
                placeholder="Seleccionar la cultura del objeto"
                isRequired
                fullWidth
                filterSelectedOptions
                disabled={loading || errors}
                allowCreation={false}
              />

              <FormLabel component="legend">Etiquetas (opcional)</FormLabel>
              <AutocompleteExtended
                multiple
                limitTags={3}
                fullWidth
                id="tags"
                name="tags"
                value={newObjectAttributes.tags}
                setValue={handleInputChange}
                options={tagOptions}
                placeholder="Seleccionar las etiquetas del objeto"
                filterSelectedOptions
                disabled={loading || errors}
                allowCreation={false}
              />
            </ColumnGrid>
          </Grid>

          {/* Grid container for buttons */}
          <Grid container justifyContent="flex-end" columnGap={2}>
            {/* Cancel button */}
            <Button variant="text" color="secondary" onClick={handleCancel}>
              {goBack ? "Cancelar" : "Volver al catálogo"}
            </Button>

            {/* Submit button */}
            <Button variant="contained" color="primary" type="submit">
              Publicar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

// Styled components for custom styling
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: "left",
}));

const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default CreateArtifact;
