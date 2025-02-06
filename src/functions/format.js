// const numeral = require('numeral')
import numeral from "numeral";

export function toLower(value) {
  if (!value) return "";
  return value.toLowerCase();
}
export function toUpper(value) {
  if (!value) return "";
  return value.toUpperCase();
}
export function toCapitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
export function removeAccents(str) {
  return str != null
    ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    : null;
}
export function toTitle(value) {
  if (!value) return "";
  const valueArray = value.toLowerCase().split(" ");
  for (let i = 0; i < valueArray.length; i++) {
    const word = valueArray[i];
    if (word.indexOf("@") > -1) {
      valueArray[i] = word.toLowerCase();
    } else if (word.indexOf(".") > -1) {
      valueArray[i] = word.toUpperCase();
    } else {
      valueArray[i] = word.charAt(0).toUpperCase() + word.substring(1);
    }
  }
  return valueArray.join(" ");
}

export function stringToNumber(value) {
  return numeral(value).value();
}

export function stringToNumber3(value) {
  return numeral(value).format("0.000");
}

export function toTC(value) {
  return numeral(value).format("0.0000");
}

export function numberToString(value, typescript) {
  if (typeof typescript === "undefined") {
    typescript = false;
  }
  let result = "";
  if (!typescript) {
    result = numeral(value).format("0,0.00");
  } else {
    value = value + "";
    const value2 = numeral(value).format("0,0.00");
    result = "";
    if (value2 === "0.00") {
      result = "";
    } else if (value.indexOf(".") !== -1) {
      if (value[value.length - 1] === ".") {
        result = value;
      } else {
        result = value2;
      }
    } else {
      result = numeral(value).format("0,0");
    }
  }
  return result;
}

export function numberToString2(value, typescript) {
  if (typeof typescript === "undefined") {
    typescript = false;
  }
  let result = "";
  if (!typescript) {
    result = numeral(value).format("0,0");
  } else {
    value = value + "";
    const value2 = numeral(value).format("0,0");
    result = "";
    if (value2 === "0") {
      result = "";
    } else if (value.indexOf(".") !== -1) {
      if (value[value.length - 1] === ".") {
        result = value;
      } else {
        result = value2;
      }
    } else {
      result = numeral(value).format("0,0");
    }
  }
  return result;
}

export function numberToString3(value, typescript) {
  if (typeof typescript === "undefined") {
    typescript = false;
  }
  let result = "";
  if (!typescript) {
    result = numeral(value).format("0,0.000");
  } else {
    value = value + "";
    const value2 = numeral(value).format("0,0.000");
    result = "";
    if (value2 === "0.000") {
      result = "";
    } else if (value.indexOf(".") !== -1) {
      if (value[value.length - 1] === ".") {
        result = value;
      } else {
        result = value2;
      }
    } else {
      result = numeral(value).format("0,0");
    }
  }
  return result;
}

export function toNumber(value) {
  value = parseFloat(value);
  if (value.toString().indexOf(".") !== -1) {
    value = value.toFixed(2);
  }
  return value;
}
