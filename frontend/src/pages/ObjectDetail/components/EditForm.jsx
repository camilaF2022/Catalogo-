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
import { useLocation, useParams,useNavigate, } from "react-router-dom";
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

const EditForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pieceId } = useParams();
  
  const piece = location.state.piece;
  const { addAlert } = useSnackBars();

  const [updatedPiece, setUpdatedPiece] = useState({
    model: piece.model.object || "",
    texture: piece.model.texture || "",
    material: piece.model.material || "",
    thumbnail: piece.preview || "",
    images: piece.images || [],
    description: piece.attributes.description || "",
    shape: piece.attributes.shape || "",
    culture: piece.attributes.culture || "",
    tags: piece.attributes.tags || [],
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(`model[object]`, updatedPiece.model);
    formData.append(`model[texture]`, updatedPiece.texture);
    formData.append(`model[material]`, updatedPiece.material);
    formData.append(`thumbnail`, updatedPiece.thumbnail);
    if (!updatedPiece.initialImages) {
      if(updatedPiece.images){
      updatedPiece.images.forEach((image) => {
        formData.append("images", image);
      })}
      if(updatedPiece.newImages){
        updatedPiece.newImages.forEach((image) => {
        formData.append("images", image);
      })};
    } else {
      if(updatedPiece.initialImages){
        updatedPiece.initialImages.forEach((image) => {
          formData.append("images", image);
        })
      }
      if(updatedPiece.newImages){
        updatedPiece.newImages.forEach((image) => {
        formData.append("images", image);
      })};

    }
    formData.append("description", updatedPiece.description);
    formData.append("id_shape", updatedPiece.shape.id);
    formData.append("id_culture", updatedPiece.culture.id);
    updatedPiece.tags.forEach((tag) =>
      formData.append("id_tags", tag.id)
    );
    
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

  const handleImagesChange = ({ initial, new: newFiles }) => {
    setUpdatedPiece({ ...updatedPiece, initialImages: initial, newImages: newFiles });
  };
  
  const getFileNameOrUrl = (item) => {
    if (typeof item === 'object' && item !== null) {
      return item.name;
    }
    if (typeof item === 'string' && item.includes('/')) {
      return item.split('/').pop();
    }
    return item;
  };
  
  


  return (
    <Container>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container rowGap={4}>
          <CustomTypography variant="h1">Editar Pieza {pieceId}</CustomTypography>
          <Grid container spacing={2}>
            
            <ColumnGrid item xs={6} rowGap={2}>
              <UploadButton
                label="Modelo *"
                name="model"
                isRequired
                setStateFn={setUpdatedPiece}         
                initialFilename={getFileNameOrUrl(updatedPiece.model)  }
                
              />
              
              <UploadButton
                label="Textura *"
                name="texture"
                isRequired
                setStateFn={setUpdatedPiece}   
                initialFilename={getFileNameOrUrl(updatedPiece.texture)  }
              />
              
              <UploadButton
                label="Material *"
                name="material"
                isRequired
                setStateFn={setUpdatedPiece}   
                initialFilename={getFileNameOrUrl(updatedPiece.material)  }
              />
              
              <UploadButton
                label="Miniatura (opcional)"
                name="thumbnail"
                setStateFn={setUpdatedPiece}   
                initialFilename={getFileNameOrUrl(updatedPiece.thumbnail) }
              />
              {/*
              <UploadButton
                label="Imágenes (opcional)"
                name="images"
                isMultiple
                setStateFn={setUpdatedPiece}   
                initialFilenames={updatedPiece.images  || []}
              />*/}
              <FormLabel component="legend">Imágenes (opcional)</FormLabel>
              <ImageUploader
                initialImages={updatedPiece.images}
                onImagesChange={handleImagesChange}
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
            <Button variant="text" color="secondary" onClick={() => navigate(`/catalog/${pieceId}`)}>
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

const CustomTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(12),
  textAlign: "left",
}));

const ColumnGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
}));

export default EditForm;




