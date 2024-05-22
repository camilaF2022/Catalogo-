import React, { useState } from "react";
import { Autocomplete, Chip, MenuItem, TextField, styled } from "@mui/material";

const AutocompleteExtended = ({
  id,
  label,
  name,
  value,
  setValue,
  options=[],
  placeholder,
  isRequired,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const handleCreateNewOption = () => {
    if (props.multiple) {
      setValue(name, [...value, inputValue]);
    } else {
      setValue(name, inputValue);
    }
    setOpenMenu(false);
  };

  const optionAvailable = !value.includes(inputValue);

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
        setValue(name, value);
        setOpenMenu(false);
      }}
      options={options}
      getOptionLabel={(option) => option}
      noOptionsText={createOption}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={isRequired}
          placeholder={placeholder}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            label={option}
            sx={(theme) => ({
              backgroundColor: options.includes(option)
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
