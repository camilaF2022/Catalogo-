import React, { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField, styled } from "@mui/material";

/**
 * Extended Autocomplete component with additional functionalities:
 * - Allows selection from predefined options.
 * - Supports creation of new options based on user input.
 * - Displays selected options as Chips.
 *
 * @param {string} id - The id attribute for the Autocomplete component.
 * @param {string} label - The label text for the input field.
 * @param {string} name - The name attribute for the input field.
 * @param {Object | Array} value - The currently selected value(s) for the Autocomplete.
 * @param {function} setValue - Callback function to update the selected value.
 * @param {Array} options - Array of options to populate the Autocomplete list.
 * @param {string} placeholder - Placeholder text for the input field.
 * @param {boolean} isRequired - Determines if the input field is required.
 * @param {boolean} allowCreation - Flag to enable/disable creation of new options.
 * @param {...any} props - Additional props to pass down to Autocomplete component.
 * @returns {JSX.Element} - Rendered Autocomplete component with extended functionality.
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
   * Adds the new option to the selected values if multiple selection is enabled.
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
   * Determines if the entered input can be created as a new option.
   * Checks if the input is not already in the selected options.
   */
  const optionAvailable = props.multiple
    ? !value.map((selectedOptions) => selectedOptions.value).includes(inputValue)
    : true;

  /**
   * Represents the JSX element for creating a new option based on user input.
   * Shows different messages based on whether creation is allowed and the input's availability.
   */
  const createOption =
    allowCreation && optionAvailable ? (
      <NewOption component="li" key={inputValue} onClick={handleCreateNewOption}>
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

// Styled component for customizing the MenuItem in Autocomplete
const NewOption = styled(MenuItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default AutocompleteExtended;
