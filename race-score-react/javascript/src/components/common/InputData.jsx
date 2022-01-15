import React, { useState, useEffect } from "react";

export const InputData = ({
  disabled = false,
  handleChange,
  onBlur,
  value = "",
  label = "",
  isValid = true,
  isChecked = false,
  role = "data-input",
  help,
  onlyNumber = false,
  isMsisdn = false,
  isDuration = false,
  isAmount = false,
  validMessage = "",
  placeholder,
  multiline = false,
  multilineRows = 5,
}) => {
  const [cellValue, setCellValue] = useState(value);
  const [helpMsg, setHelpMsg] = useState();
  const [message, setMessage] = useState();

  let timeout;

  const onChange = (val) => {
    value = onlyNumber ? numericValidation(val) : val;
    value = isMsisdn ? msisdnValidation(value) : value;
    value = isDuration ? durationValidation(value) : value;
    value = isAmount ? amountValidation(value) : value;
    setCellValue(value);
    if (handleChange !== undefined) handleChange(value);
  };

  useEffect(() => {
    if (cellValue !== value) onChange(value);
  }, [value]);

  const setHelpMessage = () => {
    timeout = setTimeout(() => {
      setHelpMsg(help);
    }, 500);
  };

  const onMouseOver = () => {
    clearTimeout(timeout);
    setHelpMsg();
  };

  const durationValidation = (newValue) => {
    if (newValue.length > 6) {
      setMessage("Czas trwania rozmowy nie może przekroczyć 6 cyfr");
      return newValue.substring(0, 6);
    }
    return newValue;
  };

  const numericValidation = (newValue) => {
    if (/[^0-9]/.test(newValue)) {
      setMessage("Dopuszczalne są tylko cyfry");
      return "";
    }
    return newValue;
  };

  const msisdnValidation = (newValue) => {
    if (!/^[5-8]/.test(newValue)) {
      setMessage("Pierwsza cyfra numeru nie może być inna niż: 5,6,7 lub 8");
      return "";
    }

    return newValue.length > 9 ? newValue.substring(0, 9) : newValue;
  };

  const amountValidation = (newValue) => {
    let replacedValue = newValue
      .replace(/,/g, ".")
      .replace(/[^-0-9.,]/g, "")
      .replace(/^(-)|-+/g, "$1")
      .replace(/\./, "x")
      .replace(/\./g, "")
      .replace(/x/, ".");

    let dotIndex = replacedValue.indexOf(".");
    if (
      dotIndex !== -1 &&
      replacedValue.substring(dotIndex + 1, replacedValue.length).length > 2
    ) {
      setMessage("Maksymalnie 2 cyfry po przecinku");
      replacedValue = replacedValue.substring(0, dotIndex + 3);
    }
    if (dotIndex === -1) dotIndex = replacedValue.length;
    if (replacedValue.replace(/-/g, "").substring(0, dotIndex).length > 13) {
      setMessage("Maksymalnie 13 cyfr przed przecinkiem");
      replacedValue =
        replacedValue.substring(0, 13) +
        replacedValue.substring(dotIndex, replacedValue.length);
    }
    return replacedValue;
  };

  useEffect(() => {
    if (message !== undefined) setTimeout(() => setMessage(undefined), 4000);
  }, [message]);

  const getExtraAttrib = () => {
    if (!isValid) return "error-select";

    return isChecked ? "green-select" : "grey-select";
  };

  return (
    <div className="l-col-12 l-table-row">
      <div className="l-col-3 u-display_table-cell">
        <p className="u-font-bold" role={"inputDataLabel"}>
          {label}
        </p>
      </div>

      <div className="l-col-9 tooltip u-display_table-cell">
        {((validMessage !== undefined && !isValid) ||
          message !== undefined) && (
          <div className="u-text-right red">
            {message === undefined ? validMessage : message}
            <span className="u-padding-left-s error-icon">&#9888;</span>
          </div>
        )}
        {isValid && message === undefined && (
          <div className="u-text-right red">
            <span className="u-padding-left-s"></span>
          </div>
        )}
        {!multiline ? (
          <input
            role={role}
            name="input"
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            value={cellValue}
            disabled={disabled}
            className={
              "opl-input--size-s data-input u-padding-top-l u-padding-l " +
              getExtraAttrib()
            }
            onMouseOver={() => setHelpMessage()}
            onMouseOut={() => onMouseOver()}
            placeholder={placeholder}
          />
        ) : (
          <textarea
            role={role}
            name="input"
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            value={cellValue}
            disabled={disabled}
            className={
              "data-input u-padding-top-l u-padding-l " + getExtraAttrib()
            }
            onMouseOver={() => setHelpMessage()}
            onMouseOut={() => onMouseOver()}
            placeholder={placeholder}
            rows={multilineRows}
          />
        )}
        {helpMsg !== undefined && message === undefined && (
          <span className="tooltiptext">{helpMsg}</span>
        )}
      </div>
    </div>
  );
};
