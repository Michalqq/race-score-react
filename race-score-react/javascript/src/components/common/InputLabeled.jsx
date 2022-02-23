import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  multiline,
  required,
  icon,
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) setTimeout(() => setError(false), 4000);
  }, [error]);

  const numericValidation = (newValue) => {
    if (/\D/.test(newValue)) {
      return "";
    }
    return newValue;
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
    <div className="form-group py-1">
      <span
        className={"input-group-text py-0 " + (big ? "" : "my-input")}
        id=""
      >
        {label}
      </span>
      <div className="d-flex">
        {/* <p className="input-label">{label}</p> */}
        {multiline === undefined && (
          <>
            {required ? (
              <>
                <div class="input-group mb-0">
                  {icon !== undefined && (
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">
                        <FontAwesomeIcon
                          className={"fa-lg my-1 text-muted"}
                          icon={icon}
                          cursor={"pointer"}
                        />
                      </span>
                    </div>
                  )}
                  <input
                    name={name}
                    className={
                      "form-control " + (big ? "" : "my-input") + errorClass
                    }
                    value={value}
                    placeholder={inputPlaceholder}
                    onChange={(e) => onChange(e)}
                    disabled={disabled}
                    max={max}
                    type={type}
                    required
                  ></input>
                </div>
              </>
            ) : (
              <>
                <div class="input-group mb-0">
                  {icon !== undefined && (
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">
                        <FontAwesomeIcon
                          className={"fa-lg my-1 text-muted"}
                          icon={icon}
                          cursor={"pointer"}
                        />
                      </span>
                    </div>
                  )}
                  <input
                    name={name}
                    className={
                      "form-control " + (big ? "" : "my-input") + errorClass
                    }
                    value={value}
                    placeholder={inputPlaceholder}
                    onChange={(e) => onChange(e)}
                    disabled={disabled}
                    max={max}
                    type={type}
                  ></input>
                </div>
              </>
            )}
          </>
        )}
        {multiline !== undefined && (
          <textarea
            placeholder={inputPlaceholder}
            value={value}
            name={name}
            onChange={(e) => onChange(e)}
            className={"form-control "}
            rows={multiline}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};
