import React, { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField, styled } from "@mui/material";

/**
 * AutocompleteExtended Component
 *
 * A custom wrapper around Material-UI's Autocomplete component with additional functionality.
 * Supports creating new options if not already available in the provided options list.
 *
 * @param {string} id - The id attribute for the Autocomplete component.
 * @param {string} label - The label text for the TextField component.
 * @param {string} name - The name attribute for form submission.
 * @param {Object | Array} value - The current selected value(s) of the Autocomplete component.
 * @param {function} setValue - The function to set the selected value(s).
 * @param {Array} options - The list of options for Autocomplete.
 * @param {string} placeholder - The placeholder text for the TextField component.
 * @param {boolean} isRequired - Determines if the Autocomplete is required.
 * @param {Object} props - Additional props to pass to the Autocomplete component.
 */
const AutocompleteExtended = ({
  id,
  label,
  name,
  value,
  setValue,
  options = [],
  placeholder,
  isRequired,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // Function to handle creating a new option
  const handleCreateNewOption = () => {
    const newObject = {
      id: -1,
      value: inputValue,
    };
    if (props.multiple) {
      setValue(name, [...value, newObject]);
    } else {
      setValue(name, newObject);
    }
    setOpenMenu(false);
  };

  // Determine if the input value is available as an option
  const optionAvailable = props.multiple
    ? !value
        .map((selectedOptions) => selectedOptions.value)
        .includes(inputValue)
    : true;

  // JSX for creating a new option based on availability
  const createOption = optionAvailable ? (
    <NewOption component="li" key={inputValue} onClick={handleCreateNewOption}>
      Crear "{inputValue}"
    </NewOption>
  ) : (
    <NewOption component="li" key={inputValue} disabled>
      "{inputValue}" ya existe
    </NewOption>
  );

  return (
    <Autocomplete
      id={id}
      name={name}
      value={value}
      open={openMenu}
      onOpen={() => setOpenMenu(true)}
      onClose={() => setOpenMenu(false)}
      onInputChange={(e, value) => setInputValue(value)}
      onChange={(e, value, reason) => {
        if (value == null) {
          setValue(name, { id: "", value: "" });
        }
        setValue(name, value);
        setOpenMenu(false);
      }}
      options={options}
      getOptionLabel={(option) => option.value}
      noOptionsText={createOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={isRequired}
          placeholder={placeholder}
        />
      )}
      renderTags={(selectedOptions, getTagProps) =>
        selectedOptions.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            label={option.value}
            sx={(theme) => ({
              backgroundColor: options
                .map((option) => option.value)
                .includes(option.value)
                ? ""
                : theme.palette.primary.light,
            })}
          />
        ))
      }
      {...props}
    />
  );
};

// Styled MenuItem component for creating a new option
const NewOption = styled(MenuItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default AutocompleteExtended;
