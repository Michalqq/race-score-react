import React, { useState, useEffect } from "react";

export const InputLabeled = ({
  name = "",
  value = "",
  label = "",
  inputPlaceholder = "",
  onlyNumber = false,
  handleChange,
  disabled = false,
  max,
  big = false,
  type = "text",
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) setTimeout(() => setError(false), 4000);
  }, [error]);

  const numericValidation = (newValue) => {
    if (/\D/.test(newValue)) {
      return "";
    }
    return Number(newValue);
  };

  const maxValidation = (newValue) => {
    if (max >= newValue) return newValue;

    setError(true);
    return "";
  };

  const onChange = (e) => {
    e.target.value = onlyNumber
      ? numericValidation(e.target.value)
      : e.target.value;
    e.target.value = max ? maxValidation(e.target.value) : e.target.value;
    if (handleChange !== undefined) handleChange(e);
  };

  const errorClass = error ? " border border-danger border-3 rounded" : "";

  return (
    <div className="form-group p-2">
      <span className={"input-group-text " + (big ? "" : "my-input")} id="">
        {label}
      </span>
      <input
        name={name}
        className={"form-control " + (big ? "" : "my-input") + errorClass}
        value={value}
        placeholder={inputPlaceholder}
        onChange={(e) => onChange(e)}
        disabled={disabled}
        max={max}
        type={type}
      ></input>
    </div>
  );
};
