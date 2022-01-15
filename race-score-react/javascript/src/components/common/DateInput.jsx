import React from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { dateToIsoDateFormat } from "../utils/utils";
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from "react-day-picker/moment";
import pl from "date-fns/locale/pl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "moment/locale/pl";

export const DateInput = (props) => {
  const FORMAT = props.format === undefined ? "DD.MM.YYYY" : props.format;
  const LOCATE = "pl";

  let minDate =
    props.minDate === undefined
      ? undefined
      : new Date(dateToIsoDateFormat(props.minDate));
  let maxDate =
    props.maxDate === undefined
      ? undefined
      : new Date(dateToIsoDateFormat(props.maxDate));
  const value =
    props.value === undefined
      ? new Date()
      : new Date(dateToIsoDateFormat(props.value));

  const dayPickerProps = {
    localeUtils: MomentLocaleUtils,
    locale: LOCATE,
    fromMonth: minDate,
    toMonth: maxDate,
    disabledDays: [
      {
        before: minDate,
        after: maxDate,
      },
    ],
  };

  const inputProps = {
    disabled: props.disabled,
    readOnly: true,
    style: {
      color: props.disabled ? "darkslategrey" : "black",
    },
    className: "data-input grey-select",
    role: props.role,
  };

  return (
    <div
      className="l-col-12 u-margin-top-m l-table-row"
      role={"dayPickerInput"}
    >
      <div className="l-col-3 u-display_table-cell">
        <label role={"date-input-label"}>{props.label}</label>
      </div>
      <div className="l-col-9 u-display_table-cell">
        <DayPickerInput
          dayPickerProps={dayPickerProps}
          inputProps={inputProps}
          formatDate={formatDate}
          parseDate={parseDate}
          format={FORMAT}
          value={value}
          onDayChange={(e) => props.onChange(e)}
        />
      </div>
    </div>
  );
};

export const CustomDatePicker = (props) => {
  return (
    <div className="centered-grid form-group p-2">
      <span className={"input-group-text"} id="">
        {props.label}
      </span>
      <DatePicker
        autoComplete="off"
        className="form-control "
        onChange={props.onChange}
        selected={props.selected ? props.selected : null}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="Godzina"
        dateFormat="dd-MM-yyyy HH:mm"
        locale={pl}
        calendarContainer={props.calendarContainer}
        maxDate={props.maxDate === undefined ? new Date() : props.maxDate}
        minDate={props.minDate}
        placeholderText={props.placeholderText}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
};

export const TimePicker = (props) => {
  return (
    <div className="centered-grid form-group p-2">
      <span className={"input-group-text"} id="">
        {props.label}
      </span>
      <DatePicker
        className="form-control "
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Godzina"
        dateFormat="HH:mm"
        onChange={props.onChange}
        selected={props.selected ? props.selected : null}
        locale={pl}
        placeholderText={props.placeholderText}
      />
    </div>
  );
};
