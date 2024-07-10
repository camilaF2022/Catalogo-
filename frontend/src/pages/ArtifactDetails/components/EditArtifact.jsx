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
import ImageUploader from "./ImageUploader"; // Assuming this is a custom component
import NotFound from "../../../components/NotFound";
import { useSnackBars } from "../../../hooks/useSnackbars";
import { useToken } from "../../../hooks/useToken";

/**
 * EditArtifact component handles the editing of artifact details.
 * It fetches artifact data, allows updating, and handles form submission.
 */
const EditArtifact = () => {
  const navigate = useNavigate(); // Navigation utility from React Router
  const location = useLocation(); // Location hook from React Router
  const { artifactId } = useParams(); // Retrieves artifactId from URL params
  const { addAlert } = useSnackBars(); // Snackbar utility hook for displaying alerts
  const { token } = useToken(); // Authentication token hook

  // State variables
  const [notFound, setNotFound] = useState(false); // Indicates if artifact is not found
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
  }); // Holds updated artifact data

  const [loading, setLoading] = useState(true); // Loading state for API fetch
  const [errors, setErrors] = useState(false); // Error state for API fetch
  const goBack = !!location.state?.from; // Indicates if there's a previous location to go back to

  // State variables for fetched metadata options
  const [shapeOptions, setShapeOptions] = useState([]); // Options for artifact shapes
  const [cultureOptions, setCultureOptions] = useState([]); // Options for artifact cultures
  const [tagOptions, setTagOptions] = useState([]); // Options for artifact tags

  // Fetches artifact data from the API based on artifactId
  useEffect(() => {
    fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true); // Sets notFound state if artifact is not found
            return;
          }
        }
        return response.json();
      })
      .then((response) => {
        let { attributes, thumbnail, model, images } = response;
        // Sets updatedArtifact state with fetched data
        setUpdatedArtifact({
          thumbnail: thumbnail,
          images: images,
          ...model,
          ...attributes,
        });
      });
  }, [artifactId]); // Runs when artifactId changes

  // Fetches metadata options (shapes, cultures, tags) from the API
  useEffect(() => {
    fetch(API_URLS.ALL_METADATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) =>
        response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.detail); // Throws error if response is not OK
          }
          let metadata = data.data;
          let shapes = metadata.shapes;
          let cultures = metadata.cultures;
          let tags = metadata.tags;

          // Sets shapeOptions, cultureOptions, and tagOptions states with fetched data
          setShapeOptions(shapes);
          setCultureOptions(cultures);
          setTagOptions(tags);
        })
      )
      .catch((error) => {
        setErrors(true); // Sets errors state if there's an error during fetch
        addAlert(error.message); // Displays error message using addAlert
      })
      .finally(() => setLoading(false)); // Sets loading state to false after fetch
  }, []); // Runs once on component mount

  // Handles input change for updating updatedArtifact state
  const handleInputChange = (name, value) => {
    setUpdatedArtifact({ ...updatedArtifact, [name]: value });
  };

  // Handles form submission for updating artifact details
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creates FormData object for sending data to backend
    const formData = new FormData();

    // Adds updatedArtifact data to FormData object
    if (updatedArtifact.object instanceof File) {
      formData.append("model[new_object]", updatedArtifact.object);
    }
    if (updatedArtifact.texture instanceof File) {
      formData.append("model[new_texture]", updatedArtifact.texture);
    }
    if (updatedArtifact.material instanceof File) {
      formData.append("model[new_material]", updatedArtifact.material);
    }
    if (updatedArtifact.thumbnail instanceof File) {
      formData.append("new_thumbnail", updatedArtifact.thumbnail);
    } else if (typeof updatedArtifact.thumbnail === "string") {
      formData.append(
        "thumbnail",
        updatedArtifact.thumbnail.split("/").pop()
      );
    }
    updatedArtifact.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("new_images", image);
      } else if (typeof image === "string") {
        formData.append("images", image.split("/").pop());
      }
    });

    formData.append("description", updatedArtifact.description);
    formData.append("id_shape", updatedArtifact.shape.id);
    formData.append("id_culture", updatedArtifact.culture.id);

    // Appends tag IDs only if the updated list of tags is not empty
    updatedArtifact.tags.forEach((tag) =>
      formData.append("id_tags", tag.id)
    );

    // Sends FormData to update artifact endpoint
    await fetch(`${API_URLS.DETAILED_ARTIFACT}/${artifactId}/update`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) =>
        response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.detail); // Throws error if response is not OK
          }
        })
      )
      .then((response) => {
        addAlert("¡Objeto editado con éxito!"); // Displays success message using addAlert
        navigate(`/catalog/${artifactId}`); // Navigates to artifact details page
      })
      .catch((error) => {
        addAlert(error.message); // Displays error message using addAlert
      });
  };

  // Retrieves filename or URL from item (file object or string)
  const getFileNameOrUrl = (item) => {
    if (typeof item === "object" && item !== null) {
      return item.name; // Returns filename if item is a file object
    }
    if (typeof item === "string" && item.includes("/")) {
      return item.split("/").pop(); // Returns filename from URL string
    }
    return item; // Returns item itself if neither file object nor string
  };

  // Handles cancel action to navigate back to previous location or catalog
  const handleCancel = () => {
    const from = goBack ? location.state.from : `/catalog`;
    navigate(from, { replace: goBack });
  };

  // Renders the component
  return (
    <>
      {notFound ? (
        <NotFound /> // Renders NotFound component if artifact is not found
      ) : (
        <Container>
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <Grid container rowGap={4}>
              {/* Title */}
              <CustomTypography variant="h1">
                Editar pieza {artifactId}
              </CustomTypography>
              <Grid container spacing={2}>
                {/* Left column */}
                <ColumnGrid item xs={6} rowGap={2}>
                  {/* Upload buttons for object, texture, material */}
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
                  {/* Upload button for thumbnail */}
                  <UploadButton
                    label="Miniatura (opcional)"
                    name="thumbnail"
                    setStateFn={setUpdatedArtifact}
                    initialFilename={getFileNameOrUrl(
                      updatedArtifact.thumbnail
                    )}
                  />
                  {/* Image uploader for images */}
                  <ImageUploader
                    label="Imágenes (opcional)"
                    name="images"
                    images={updatedArtifact.images}
                    onListChange={setUpdatedArtifact}
                    allowedImageTypes={allowedFileTypes.images}
                  />
                </ColumnGrid>
                {/* Right column */}
                <ColumnGrid item xs={6} rowGap={1}>
                  {/* Text field for description */}
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
                  {/* Autocomplete for shape */}
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
                  {/* Autocomplete for culture */}
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
                  {/* Autocomplete for tags */}
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
              {/* Actions footer */}
              <Grid container justifyContent="flex-end" columnGap={2}>
                {/* Cancel button */}
                <Button variant="text" color="secondary" onClick={handleCancel}>
                  {goBack ? "Cancelar" : "Volver al catálogo"}
                </Button>
                {/* Update button */}
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

// Custom typography styling
const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(6),
  textAlign: "left",
}));

// Grid styling for column layout
const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default EditArtifact;
