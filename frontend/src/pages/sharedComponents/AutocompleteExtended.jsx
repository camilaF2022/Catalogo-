import React, { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField, styled } from "@mui/material";

/**
 * AutocompleteExtended provides an enhanced autocomplete component with additional features.
 * It allows selecting options from a list, creating new options if allowed, and displays tags for selected options.
 * @param {object} props - Component props.
 * @param {string} props.id - Id attribute for the Autocomplete component.
 * @param {string} props.label - Label for the input field.
 * @param {string} props.name - Name attribute for the input field.
 * @param {object | array} props.value - Selected value(s) for the Autocomplete.
 * @param {function} props.setValue - Callback function to update the selected value.
 * @param {array} props.options - Array of options for autocomplete suggestions.
 * @param {string} props.placeholder - Placeholder text for the input field.
 * @param {boolean} props.isRequired - Flag indicating if the field is required.
 * @param {boolean} props.allowCreation - Flag to allow creation of new options.
 * @param {object} props.multiple - Flag indicating if multiple options can be selected.
 * @returns {JSX.Element} AutocompleteExtended component.
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
  allowCreation = false,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  /**
   * Handles creation of a new option based on user input.
   */
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

  /**
   * Checks if the option to be created is available.
   */
  const optionAvailable = props.multiple
    ? !value
        .map((selectedOptions) => selectedOptions.value)
        .includes(inputValue)
    : true;

  /**
   * Creates a JSX element for new option based on conditions.
   */
  const createOption =
    allowCreation && optionAvailable ? (
      <NewOption
        component="li"
        key={inputValue}
        onClick={handleCreateNewOption}
      >
        Crear "{inputValue}"
      </NewOption>
    ) : !optionAvailable ? (
      <NewOption component="li" key={inputValue} disabled>
        "{inputValue}" ya existe
      </NewOption>
    ) : (
      <NewOption component="li" key={inputValue} disabled>
        "{inputValue}" no encontrado
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
          return;
        }
        setValue(name, value);
        setOpenMenu(false);
      }}
      options={options}
      getOptionLabel={(option) => option.value ?? ""}
      noOptionsText={createOption}
      renderInput={(params) => (
        <TextField
          key={name}
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
            key={index}
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

// Styled MenuItem component for creating new options
const NewOption = styled(MenuItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default AutocompleteExtended;

