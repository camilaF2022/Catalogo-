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

/**
 * Component for filtering artifacts in the catalog.
 * Manages search, shape, culture, and tags filtering.
 *
 * @param {Object} filter - The current filter state.
 * @param {Function} setFilter - Function to update filter state.
 */
const CatalogFilter = ({ filter, setFilter }) => {
  const { addAlert } = useSnackBars();
  const { token } = useToken();

  // Search params from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Flag to avoid updating URL params when component mounts
  const [updateParamsFlag, setUpdateParamsFlag] = useState(false);

  // Retrieved data from the API
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  /**
   * Updates the filter state when a filter value changes.
   *
   * @param {string} name - The name of the filter field.
   * @param {string|Array} value - The new value of the filter field.
   */
  const handleFilterChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  // Initialize the filter state with the search params from the URL
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

  // Fetch metadata (shapes, cultures, tags) from the API
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
        let shapes = metadata.shapes.map((shape) => shape.value);
        let cultures = metadata.cultures.map((culture) => culture.value);
        let tags = metadata.tags.map((tag) => tag.value);

        setShapeOptions(shapes);
        setCultureOptions(cultures);
        setTagOptions(tags);
      })
      .catch((error) => {
        setErrors(true);
        addAlert("Error al cargar los metadatos");
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update the URL search params when the filter state changes
  useEffect(() => {
    if (!updateParamsFlag) {
      return;
    }

    const updatedSearchParams = new URLSearchParams();
    if (filter.query) {
      updatedSearchParams.set("query", filter.query);
    }
    if (filter.shape) {
      updatedSearchParams.set("shape", filter.shape);
    }
    if (filter.culture) {
      updatedSearchParams.set("culture", filter.culture);
    }
    if (filter.tags.length > 0) {
      updatedSearchParams.set("tags", filter.tags.join(","));
    }
    setSearchParams(updatedSearchParams);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CustomBox>
      {/* Search field with clear button */}
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

      {/* Autocomplete fields for shape, culture, and tags */}
      <CustomStack direction="row">
        <Autocomplete
          fullWidth
          id="shape"
          name="shape"
          value={filter.shape}
          onChange={(event, value) =>
            handleFilterChange("shape", value ?? "")
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
          onChange={(event, value) =>
            handleFilterChange("culture", value ?? "")
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
            handleFilterChange("tags", value ?? [])
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

// Styled component for custom box layout
const CustomBox = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

// Styled component for custom stack layout
const CustomStack = styled(Stack)(({ theme }) => ({
  width: "100%",
  columnGap: theme.spacing(2),
}));

export default CatalogFilter;
