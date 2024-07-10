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
import useSnackBars from "../../hooks/useSnackbars";
import UploadButton from "./components/UploadButton";
import AutocompleteExtended from "./components/AutocompleteExtended";
import { API_URLS } from "../../api";

export const allowedFileTypes = {
  model: ["obj"],
  texture: ["jpg"],
  material: ["mtl"],
  thumbnail: ["jpg"],
  images: ["jpg"],
};

/**
 * CreateItem Component
 *
 * Component for creating a new item with file uploads, text inputs, and autocomplete fields.
 * Handles form submission and navigation.
 */
const CreateItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useSnackBars();

  // State for storing new object attributes
  const [newObjectAttributes, setNewObjectAttributes] = useState({
    model: "",
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

  const [loading, setLoading] = useState(true); // Loading state for API request
  const [errors, setErrors] = useState(false); // Error state for API request

  // Retrieved data from the API
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch(API_URLS.ALL_ARTIFACTS)
      .then((response) => response.json())
      .then((response) => {
        let artifacts = response.data;

        let shapes = new Set();
        let cultures = new Set();
        let tags = new Set();

        // Extract unique shape, culture, and tag options from artifacts
        artifacts.forEach((artifact) => {
          let { attributes } = artifact;
          let { shape, culture, tags: artifactTags } = attributes;
          shapes.add(JSON.stringify(shape));
          cultures.add(JSON.stringify(culture));
          artifactTags.forEach((tag) => tags.add(JSON.stringify(tag)));
        });

        // Update state with fetched options
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

  // Handle input change for text fields and Autocomplete fields
  const handleInputChange = (name, value) => {
    setNewObjectAttributes({ ...newObjectAttributes, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newObjectAttributes); // Send new object to the server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Emulate POST delay
    const newId = 1; // Example new object ID
    addAlert("¡Objeto creado con éxito!"); // Show success message
    navigate(`/catalog/${newId}`); // Navigate to catalog page with new object ID
  };

  // Handle cancel button click
  const handleCancel = () => {
    const from = location.state?.from || "/catalog"; // Get previous location or default to catalog
    navigate(from, { replace: true }); // Navigate back
  };

  return (
    <Container>
      {/* Form container */}
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container rowGap={4}>

          {/* Title */}
          <CustomTypography variant="h1">Agregar nuevo objeto</CustomTypography>
          
          {/* Grid container for form elements */}
          <Grid container spacing={2}>
            {/* Left column for file uploads */}
            <ColumnGrid item xs={6} rowGap={2}>
              {/* Upload buttons for model, texture, material, thumbnail, and images */}
              <UploadButton
                label="Modelo *"
                name="model"
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

            {/* Right column for text fields and Autocomplete fields */}
            <ColumnGrid item xs={6} rowGap={1}>
              {/* Description text field */}
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

              {/* Autocomplete for shape selection */}
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
              />

              {/* Autocomplete for culture selection */}
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
              />

              {/* Autocomplete for tags selection */}
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
              />
            </ColumnGrid>
          </Grid>

          {/* Grid container for buttons (Cancel and Submit) */}
          <Grid container justifyContent="flex-end" columnGap={2}>
            {/* Cancel button */}
            <Button variant="text" color="secondary" onClick={handleCancel}>
              Cancelar
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

// Styled Typography component for custom styling
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  textAlign: "left",
}));

// Styled Grid component for column layout
const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default CreateItem;
