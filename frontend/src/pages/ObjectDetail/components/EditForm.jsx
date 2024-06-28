/*
import {  Paper } from "@mui/material";

const EditForm = () => {
    return (
        <Paper >
          Edit Form must be here 
        </Paper>
    );
};
export default EditForm;
*/


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
import UploadButton from "../../Gallery/components/UploadButton";
import AutocompleteExtended from "../../Gallery/components/AutocompleteExtended";
import { API_URLS } from "../../../api";
import useSnackBars from "../../../hooks/useSnackbars";

const EditForm = ({ piece, onCancel }) => {
  const { addAlert } = useSnackBars();

  const [updatedPiece, setUpdatedPiece] = useState({
    ...piece,
    model: piece.model || {},
    attributes: piece.attributes || {},
    preview: piece.preview || null,
    images: piece.images || [],
  });


  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);

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

  const handleAutocompleteChange = (name, value) => {
    setUpdatedPiece({ ...updatedPiece, attributes: { ...updatedPiece.attributes, [name]: value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(updatedPiece); // Simula el envío al servidor
  };


  return (
    <Container>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container rowGap={4}>
          <Typography variant="h4">Editar objeto Pieza </Typography>
          <Grid container spacing={2}>
            
            <ColumnGrid item xs={6} rowGap={2}>
              <UploadButton
                label="Modelo *"
                name="model"
                isRequired
                setStateFn={(file) => handleInputChange("model", { ...updatedPiece.model, model: file })}          
                initialFilename={updatedPiece.model.object  }
              />
              
              <UploadButton
                label="Textura *"
                name="texture"
                isRequired
                setStateFn={(file) => handleInputChange("texture", { ...updatedPiece.model, texture: file })}
                initialFilename={updatedPiece.model.texture  || null}
              />
              
              <UploadButton
                label="Material *"
                name="material"
                isRequired
                setStateFn={(file) => handleInputChange("material", { ...updatedPiece.model, material: file })}
                initialFilename={updatedPiece.model.material  || null}
              />
              
              <UploadButton
                label="Miniatura (opcional)"
                name="thumbnail"
                setStateFn={(file) => handleInputChange("thumbnail", file)}
                initialFilename={updatedPiece.preview  || null}
              />
              
              <UploadButton
                label="Imágenes (opcional)"
                name="images"
                isMultiple
                setStateFn={(files) => handleInputChange("images", files)}
                initialFilenames={updatedPiece.images  || []}
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
                value={updatedPiece.attributes.description}
                onChange={(e) => handleAutocompleteChange(e.target.name, e.target.value)}
              />
              <FormLabel component="legend">Forma *</FormLabel>
              <AutocompleteExtended
                id="shape"
                name="shape"
                value={updatedPiece.attributes.shape}
                setValue={(name, value) => handleAutocompleteChange("shape", value)}
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
                value={updatedPiece.attributes.culture}
                setValue={(name, value) => handleAutocompleteChange("culture", value)}
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
                value={updatedPiece.attributes.tags}
                setValue={(name, value) => handleAutocompleteChange("tags", value)}
                options={tagOptions}
                placeholder="Seleccionar las etiquetas del objeto"
                filterSelectedOptions
              />
            </ColumnGrid>
          </Grid>
          <Grid container justifyContent="flex-end" columnGap={2}>
            <Button variant="text" color="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default EditForm;




