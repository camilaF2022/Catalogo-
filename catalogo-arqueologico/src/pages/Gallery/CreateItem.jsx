import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Autocomplete,
  FormLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const CreateItem = () => {
  const navigate = useNavigate();
  const [newObjectAttributes, setNewObjectAttributes] = useState({
    model: "",
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
  };

  const handleCancel = () => {
    navigate("/gallery");
  };

  return (
    <Container>
      <Grid container rowGap={4}>
        <CustomTypography variant="h1">Agregar nuevo objeto</CustomTypography>
        <Grid container spacing={2}>
          <ColumnGrid item xs={6} rowGap={2}>
            <FormLabel component="legend">Modelo 3D *</FormLabel>
            <Button variant="contained" color="primary" component="label">
              Cargar el archivo
            </Button>
            <FormLabel component="legend">Imágenes (opcional)</FormLabel>
            <Button variant="contained" color="primary" component="label">
              Cargar el archivo
            </Button>
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
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
            <FormLabel component="legend">Forma *</FormLabel>
            <Autocomplete
              required
              fullWidth
              id="shape"
              name="shape"
              value={newObjectAttributes.shape}
              onChange={(value) =>
                handleInputChange("shape", value.target.textContent)
              }
              options={shapeOptions}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccionar la forma de la pieza"
                />
              )}
            />
            <FormLabel component="legend">Cultura *</FormLabel>
            <Autocomplete
              required
              fullWidth
              id="culture"
              name="culture"
              value={newObjectAttributes.culture}
              onChange={(value) =>
                handleInputChange("culture", value.target.textContent)
              }
              options={cultureOptions}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Seleccionar la cultura de origen"
                />
              )}
            />
            <FormLabel component="legend">Etiquetas (opcional)</FormLabel>
            <Autocomplete
              multiple
              limitTags={3}
              fullWidth
              id="tags"
              name="tags"
              value={newObjectAttributes.tags}
              onChange={(event, value) =>
                handleInputChange(
                  "tags",
                  value.map((tag) => tag)
                )
              }
              options={tagOptions}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} placeholder="Seleccionar etiquetas" />
              )}
            />
          </ColumnGrid>
        </Grid>
        <Grid container justifyContent="flex-end" columnGap={2}>
          <Button variant="text" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Publicar
          </Button>
        </Grid>
      </Grid>
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
