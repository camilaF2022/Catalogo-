import React, { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField, styled } from "@mui/material";

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

  const optionAvailable = props.multiple
    ? !value
        .map((selectedOptions) => selectedOptions.value)
        .includes(inputValue)
    : true;

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

const NewOption = styled(MenuItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default AutocompleteExtended;
