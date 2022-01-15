import { format, isValid, parseISO } from "date-fns";

export function formatTableDate(date) {
  let addDate = new Date(parseISO(date));
  if (isValid(addDate)) {
    let newDate = format(addDate, "dd-MM-yyyy HH:mm");
    return newDate;
  } else return "";
}

export function formatTableDateWithoutTime(date) {
  let addDate = new Date(parseISO(date));
  if (isValid(addDate)) {
    let newDate = format(addDate, "dd-MM-yyyy");
    return newDate;
  } else return "";
}

export const getDefaultFilterValue = (props, columnId, defaultValue) => {
  let columnUser = props.columns[0].columns.filter((e) => e.id == columnId)[0];
  return columnUser.filterValue != null ? columnUser.filterValue : defaultValue;
};

export function sortDataByDocDateDesc(data) {
  return data
    .sort(function (a, b) {
      return a.documentDate > b.documentDate
        ? 1
        : a.documentDate < b.documentDate
        ? -1
        : 0;
    })
    .reverse();
}
export function sortDataByParam(data, sortName) {
  return data
    .sort(function (a, b) {
      return a[sortName] > b[sortName] ? 1 : a[sortName] < b[sortName] ? -1 : 0;
    })
    .reverse();
}
