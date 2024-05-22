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
import { useNavigate } from "react-router-dom";
import useSnackBars from "../../hooks/useSnackbars";
import UploadButton from "./components/UploadButton";
import AutocompleteExtended from "./components/AutocompleteExtended";

export const allowedFileTypes = {
  model: ["obj"],
  texture: ["jpg"],
  material: ["mtl"],
  thumbnail: ["jpg"],
  images: ["jpg"],
};

const CreateItem = () => {
  const navigate = useNavigate();
  const { addAlert } = useSnackBars();

  const [newObjectAttributes, setNewObjectAttributes] = useState({
    model: "",
    texture: "",
    material: "",
    thumbnail: "",
    images: [],
    description: "",
    shape: "",
    culture: "",
    tags: [],
  });

  // Retrieved data from the API
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    fetch("/pieces_models/response.json")
      .then((response) => response.json())
      .then((response) => {
        let artifacts = response.data;

        let shapes = new Set();
        let cultures = new Set();
        let tags = new Set();

        artifacts.forEach((artifact) => {
          let { attributes } = artifact;
          let { shape, culture, tags: artifactTags } = attributes;
          shapes.add(shape);
          cultures.add(culture);
          artifactTags.forEach((tag) => tags.add(tag));
        });

        setShapeOptions(Array.from(shapes));
        setCultureOptions(Array.from(cultures));
        setTagOptions(Array.from(tags));
      })
      .catch((error) => console.error(error));
  }, []);

  const handleInputChange = (name, value) => {
    setNewObjectAttributes({ ...newObjectAttributes, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newObjectAttributes); // Send new object to the server
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Emulate POST delay
    const newId = 1;
    addAlert("¡Objeto creado con éxito!");
    navigate(`/gallery/${newId}`);
  };

  const handleCancel = () => {
    navigate("/gallery");
  };

  return (
    <Container>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container rowGap={4}>
          <CustomTypography variant="h1">Agregar nuevo objeto</CustomTypography>
          <Grid container spacing={2}>
            <ColumnGrid item xs={6} rowGap={2}>
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
                getOptionLabel={(option) => option}
                filterSelectedOptions
              />
            </ColumnGrid>
          </Grid>
          <Grid container justifyContent="flex-end" columnGap={2}>
            <Button variant="text" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Publicar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
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

export default CreateItem;
