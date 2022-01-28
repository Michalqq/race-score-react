import React, { useState, useEffect } from "react";
import Select from "react-select";

export const Selector = (props) => {
  const [selectedOption, setSelectedOption] = useState({});
  const [disabled, setDisabled] = useState(props.disabled);

  const handleChange = (option) => {
    setSelectedOption(props.clearSelectedAfterPick === undefined ? option : {});
    if (!option.defValue) setDisabled(false);

    props.handleChange(option.value);
  };

  const customStyles = {
    control: (styles) => ({
      ...styles,
      border: 0,
      borderColor: "orange",
      boxShadow: null,
      "&:hover": {
        boxShadow: null,
      },
    }),
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted pink",
      padding: 10,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 15 }),
  };

  useEffect(() => {
    if (props.options === undefined) return;
    if (props.options.length === 0) setSelectedOption();
    if (props.skipDefault === undefined || !props.skipDefault) setDefValue();
  }, [props.options]);

  const setDefValue = () => {
    let defaultValue =
      props.value === null || props.value === undefined
        ? props.options.filter((option) => option.defValue)
        : props.options.filter((option) => option.value === props.value);

    if (defaultValue.length > 0) handleChange(defaultValue[0]);
    else if (props.options.length > 0) handleChange(props.options[0]);
  };

  return (
    <>
      <div className="form-group px-1 py-0">
        {props.label && (
          <span className="input-group-text mb-1 py-0 " id="">
            {props.label}
          </span>
        )}
        <Select
          aria-label="select-label"
          classNamePrefix="react-select"
          className={"select py-0"}
          value={selectedOption}
          onChange={(e) => handleChange(e)}
          options={props.options}
          styles={customStyles}
          placeholder={props.placeholder}
          isDisabled={disabled || props.isLoading}
          isLoading={props.isLoading}
          isSearchable={false}
        />
      </div>
    </>
  );
};
