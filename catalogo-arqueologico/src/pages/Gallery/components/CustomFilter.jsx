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

const CustomFilter = ({ artifactList, setFilteredArtifacts }) => {
  // Search params from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  // Avoid updating the search params when the component mounts and there are search params
  const [updateParamsFlag, setUpdateParamsFlag] = useState(false);

  // Retrieved data from the API
  const [shapeOptions, setShapeOptions] = useState([]);
  const [cultureOptions, setCultureOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  // Filter state
  const [filter, setFilter] = useState({
    query: "",
    shape: "",
    culture: "",
    tags: [],
  });

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

  // Filter artifacts based on the filter state
  useEffect(() => {
    let filtered = artifactList.filter((artifact) => {
      const { shape, culture, tags } = artifact.attributes;
      const {
        query,
        shape: filterShape,
        culture: filterCulture,
        tags: filterTags,
      } = filter;

      const filterTagsInLowerCase = filterTags.map((tag) => tag.toLowerCase());

      if (
        query &&
        !artifact.attributes.description
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        !query.includes(String(artifact.id))
      ) {
        return false;
      }

      if (filterShape && shape.toLowerCase() !== filterShape.toLowerCase()) {
        return false;
      }

      if (
        filterCulture &&
        culture.toLowerCase() !== filterCulture.toLowerCase()
      ) {
        return false;
      }

      if (
        filterTagsInLowerCase.length > 0 &&
        !filterTagsInLowerCase.every((tag) => tags.includes(tag.toLowerCase()))
      ) {
        return false;
      }

      return true;
    });
    setFilteredArtifacts(filtered);
  }, [filter, artifactList]); // eslint-disable-line react-hooks/exhaustive-deps

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
        size="small"
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
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Forma"
              placeholder="Filtrar por forma"
            />
          )}
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
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cultura"
              placeholder="Filtrar por cultura"
            />
          )}
        />
        <Autocomplete
          multiple
          limitTags={2}
          fullWidth
          sx={{
            maxHeight: "56px",
          }}
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
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Etiquetas"
              placeholder="Filtrar por etiquetas"
            />
          )}
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

export default CustomFilter;
