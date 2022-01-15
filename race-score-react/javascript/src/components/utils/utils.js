export const formatDate = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return dt + "-" + month + "-" + year;
};

export const dotDateFormat = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return dt + "." + month + "." + year;
};

export const isObjectEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

export function getCurrentDate(separator = ".") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${date}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${year}`;
}

export const dashDateFormat = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + dt;
};

export const dateToIsoDateFormat = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + dt + "T00:00:00Z";
};

export const isoEndDate = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + dt + "T23:59:59Z";
};

export const dashDateFormatMinusOneDay = (isoDate) => {
  let date = new Date(isoDate);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate() - 1;

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + dt;
};

export const checkDate = (filename) => {
  const fileNameLength = filename.length;

  let startSign = fileNameLength - 14;
  let endSign = fileNameLength - 4;

  let fileDate = filename.substring(startSign, endSign);
  fileDate = fileDate + "T23:59:50";

  var actualDate = new Date();
  var checkingDate = new Date(fileDate);
  return actualDate.getTime() <= checkingDate.getTime();
};
