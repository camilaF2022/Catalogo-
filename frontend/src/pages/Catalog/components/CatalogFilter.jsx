import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Grid,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Clear from "@mui/icons-material/Clear";
import { styled } from "@mui/system";
import { useSearchParams } from "react-router-dom";
import { API_URLS } from "../../../api";
import { useSnackBars } from "../../../hooks/useSnackbars";
import { useToken } from "../../../hooks/useToken";

const CatalogFilter = ({ filter, setFilter }) => {
  const { addAlert } = useSnackBars();
  const { token } = useToken();
  // Search params from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Avoid updating the URL when the component mounts and there are search params already
  const [updateParamsFlag, setUpdateParamsFlag] = useState(false);

  // Retrieved data from the API
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const handleFilterChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  // Initialize the filter state with the search params
  useEffect(() => {
    const query = searchParams.get("query")
      ? decodeURIComponent(searchParams.get("query"))
      : "";
    const shape = searchParams.get("shape")
      ? decodeURIComponent(searchParams.get("shape"))
      : "";
    const culture = searchParams.get("culture")
      ? decodeURIComponent(searchParams.get("culture"))
      : "";
    const tags = searchParams.get("tags")
      ? decodeURIComponent(searchParams.get("tags"))
      : "";
    const tagsArray = tags?.split(",").filter((tag) => tag);
    setFilter({ query, shape, culture, tags: tagsArray });
    setUpdateParamsFlag(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch data from the API
  useEffect(() => {
    fetch(API_URLS.ALL_METADATA, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.detail);
        }
        return response.json();
      })
      .then((response) => {
        let metadata = response.data;

        let shapes = metadata.shapes;
        let shapesNames = shapes.map((shape) => shape.value);
        let cultures = metadata.cultures;
        let culturesNames = cultures.map((culture) => culture.value);
        let tags = metadata.tags;
        let tagsNames = tags.map((tag) => tag.value);

        setShapeOptions(shapesNames);
        setCultureOptions(culturesNames);
        setTagOptions(tagsNames);
      })
      .catch((error) => {
        setErrors(true);
        addAlert("Error al cargar los metadatos");
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL search params when the user applies a filter
  useEffect(() => {
    if (!updateParamsFlag) {
      return;
    }
    if (filter.query) {
      searchParams.set("query", filter.query);
    } else {
      searchParams.delete("query");
    }
    if (filter.shape) {
      searchParams.set("shape", filter.shape);
    } else {
      searchParams.delete("shape");
    }
    if (filter.culture) {
      searchParams.set("culture", filter.culture);
    } else {
      searchParams.delete("culture");
    }
    if (filter.tags.length > 0) {
      searchParams.set("tags", filter.tags.join(","));
    } else {
      searchParams.delete("tags");
    }
    setSearchParams(searchParams);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CustomBox>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: filter.query && (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                onClick={() => handleFilterChange("query", "")}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
                size="small"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
        label="Buscar"
        variant="outlined"
        fullWidth
        name="query"
        value={filter.query}
        onChange={(event) =>
          handleFilterChange(event.target.name, event.target.value)
        }
      />
      <CustomStack direction="row">
        <Autocomplete
          fullWidth
          id="shape"
          name="shape"
          value={filter.shape}
          onChange={(value) =>
            handleFilterChange("shape", value.target.textContent)
          }
          options={shapeOptions}
          getOptionLabel={(option) => option ?? ""}
          noOptionsText="No hay formas con ese nombre"
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Forma"
              placeholder="Filtrar por forma"
            />
          )}
          disabled={loading || errors}
        />
        <Autocomplete
          fullWidth
          id="culture"
          name="culture"
          value={filter.culture}
          onChange={(value) =>
            handleFilterChange("culture", value.target.textContent)
          }
          options={cultureOptions}
          getOptionLabel={(option) => option ?? ""}
          noOptionsText="No hay culturas con ese nombre"
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cultura"
              placeholder="Filtrar por cultura"
            />
          )}
          disabled={loading || errors}
        />
        <Autocomplete
          multiple
          limitTags={2}
          fullWidth
          id="tags"
          name="tags"
          value={filter.tags}
          onChange={(event, value) =>
            handleFilterChange(
              "tags",
              value.map((tag) => tag)
            )
          }
          options={tagOptions}
          getOptionLabel={(option) => option ?? ""}
          noOptionsText="No hay etiquetas con ese nombre"
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Etiquetas"
              placeholder="Filtrar por etiquetas"
            />
          )}
          disabled={loading || errors}
        />
      </CustomStack>
    </CustomBox>
  );
};

const CustomBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const CustomStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  columnGap: theme.spacing(2),
}));

export default CatalogFilter;
