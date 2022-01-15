import React, { useState } from "react";

export const SubmitButton = ({
  action,
  disabled = false,
  label = "",
  role = "",
  paddingTop = " u-margin-top-l",
  small = false,
}) => {
  let className = "btn btn-success " + (small ? " opl-btn--small" : "");
  return (
    <button
      role={role}
      onClick={!disabled ? action : undefined}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export const SubmitButtonWithHover = ({
  action,
  label,
  role,
  disabled,
  paddingTop,
  small,
  hoverMsg,
}) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="tooltip u-display_table-cell"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <SubmitButton
        action={action}
        label={label}
        role={role}
        disabled={disabled}
        paddingTop={paddingTop}
        small={small}
      />
      {hover && hoverMsg !== undefined && (
        <span className="tooltiptextAbove">{hoverMsg}</span>
      )}
    </div>
  );
};

export const ConfirmButton = ({
  action,
  disabled = false,
  withoutMargin = false,
  label = "",
  role = "",
  small = false,
}) => {
  let buttonStyle = disabled === true ? " opl-btn-disabled" : "";
  buttonStyle = withoutMargin
    ? buttonStyle
    : buttonStyle + " u-margin-top-l u-margin-left-s u-margin-right-s";
  return (
    <button
      role={role}
      onClick={!disabled ? action : undefined}
      className={
        "o-btn opl-btn opl-btn--secondary try-print-button" +
        buttonStyle +
        (small ? " opl-btn--small" : "")
      }
    >
      {label}
    </button>
  );
};

export const IconButton = ({
  onClick,
  colour = "",
  icon = "",
  size = "",
  tooltipText = "",
  role,
  disabled,
}) => {
  let iconColour = colour && !disabled ? "g-" + colour + "-c" : "";
  let disabledStyle = disabled === true ? "g-gray5-c" : "u-cursor-pointer";
  return (
    <div onClick={!disabled ? onClick : undefined} role={role}>
      <span
        className={
          "g-icon g-icon--only " +
          "g-icon--" +
          icon +
          " " +
          iconColour +
          " " +
          disabledStyle +
          " " +
          size
        }
        title={tooltipText}
      ></span>
    </div>
  );
};

export const LabelIconButton = ({
  onClick,
  colour = "",
  disabled = false,
  icon = "",
  size = "",
  tooltipText = "",
  label = "",
  role = "",
}) => {
  let disabledStyle = disabled === true ? " opl-btn-disabled" : "";
  return (
    <div
      className={"opl-btn opl-btn u-inline-block u-margin-all" + disabledStyle}
      onClick={!disabled ? onClick : undefined}
      role={role}
    >
      <IconButton
        icon={icon}
        size={size}
        tooltipText={tooltipText}
        colour={colour}
      />
      <p className={".o-hint"}>
        <b>{label}</b>
      </p>
    </div>
  );
};

export const RadioButton = ({
  onClick,
  label,
  isConfirmed = false,
  name,
  value,
}) => {
  return (
    <div className="form-check">
      <input
        onClick={onClick}
        defaultChecked={isConfirmed}
        className="form-check-input"
        type="radio"
        name={name}
        value={value}
      ></input>
      <label className="form-check-label">{label}</label>
    </div>
  );
};
