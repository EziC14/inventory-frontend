import { onSuccess, onError } from "src/functions/notify";
import { inArray } from "src/functions/array";

// import { Filesystem, Directory } from "@capacitor/filesystem";
import {
  numberToString,
  stringToNumber,
  toUpper,
  removeAccents,
} from "src/functions/format";
// const _ = require("lodash");
// const moment = require("moment");
import _ from "lodash";
import moment from "moment";
import { openURL } from "quasar";
// import * as ExcelJS from "exceljs";
// import { exportFile } from "quasar";

const URL_API = "http://localhost:8000";

export default {
  methods: {
    // async saveFileMobile(data, mimeType, fileName) {
    //   try {
    //     const base64Data = await this.blobToBase64Mobile(
    //       new Blob([data], { type: mimeType })
    //     );
    //     const result = await Filesystem.writeFile({
    //       path: fileName,
    //       data: base64Data,
    //       directory: Directory.Documents,
    //     });

    //     await this.openFileMobile(result.uri, mimeType);
    //   } catch (error) {
    //     this.alertError(
    //       "No se pudo guardar el archivo porque no se otorgaron los permisos necesarios."
    //     );
    //   }
    // },

    async openFileMobile(uri, mimeType) {
      try {
        const fileOpener = window.cordova.plugins.fileOpener2;

        fileOpener.open(uri, mimeType, {
          error: (error) => {
            console.error("Error al abrir el archivo:", error);
            this.alertError(
              "No se pudo abrir el archivo. Asegúrate de tener una aplicación compatible instalada."
            );
          },
          success: () => {
            
          },
        });
      } catch (error) {
        console.error("Error general:", error);
        this.alertError("Hubo un problema al intentar abrir el archivo.");
      }
    },

    blobToBase64Mobile(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    downloadPDF(data) {
      var blob = new Blob([data], {
        type: "application/pdf",
      });
      var pdfurl = window.URL.createObjectURL(blob);
      window.open(pdfurl);
    },

    copyToClipboard(data) {
      navigator.clipboard
        .writeText(data)
        .then(() => {
          this.alertSuccess("Copiado al portapapeles");
        })
        .catch((err) => {
          this.alertError("No se pudo copiar la información");
        });
    },

    validateDates(type, dateFrom, dateTo) {
      const from = moment(dateFrom);
      const to = moment(dateTo);

      if (type === "from" && (!dateFrom || dateFrom === null) && to.isValid()) {
        return {
          filter: true,
          fieldToClear: "dateTo",
          msg: "Para ingresar la fecha 'Hasta', también debe especificar la fecha 'Desde'.",
        };
      }

      if (type === "to" && (!dateTo || dateTo === null)) {
        return { fieldToClear: null };
      }

      if (type === "to" && (!from || !from.isValid())) {
        return {
          fieldToClear: "dateTo",
          msg: "Debe ingresar la fecha 'Desde' antes de la fecha 'Hasta'.",
        };
      }

      if (to.isValid() && from.isValid() && to.isBefore(from)) {
        return {
          fieldToClear: "dateTo",
          msg: "La fecha 'Hasta' no puede ser menor que la fecha 'Desde'.",
        };
      }

      if (to.isValid() && from.isValid() && from.isAfter(to)) {
        return {
          fieldToClear: "dateFrom",
          msg: "La fecha 'Desde' no puede ser mayor que la fecha 'Hasta'.",
        };
      }

      return { fieldToClear: null };
    },

    downloadExcel(data) {
      var blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      var pdfurl = window.URL.createObjectURL(blob);
      window.open(pdfurl);
    },

    subtractHours(dateTimeString) {
      const dateTime = moment(dateTimeString);

      const resultDateTime = dateTime.subtract(5, "hours");

      return resultDateTime.format();
    },

    compareDates(date_event, status_event) {
      const fecha_event = moment(date_event.toString()).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const fecha_act = moment().format("YYYY-MM-DD HH:mm:ss");

      const moment1 = moment(fecha_event, "YYYY-MM-DD HH:mm:ss");
      const moment2 = moment(fecha_act, "YYYY-MM-DD HH:mm:ss");

      const resultadoComparacion = moment1.isAfter(moment2);

      let status = "";
      status = status_event;
      if (!resultadoComparacion) {
        if (status === "PEN" || status === "NOR") {
          status = "NOR";
        }
      }

      return this.$filters.statusEvent(status);
    },

    convertirFormatoDate(fecha) {
      if (!fecha) {
        return;
      }
      var fechaMoment = moment(fecha, "YYYY/MM/DD");
      var nuevoFormato = fechaMoment.format("YYYY-MM-DDTHH:mm:ss");
      return nuevoFormato;
    },

    getFormattedTime() {
      const currentTime = moment();
      const formattedTimeWithSeconds = currentTime.format("HH:mm:ss");
      return formattedTimeWithSeconds;
    },

    dateTimeToCustomFormat(date) {
      const fechaMoment = moment(date);
      const dateFormat = fechaMoment.format("YYYY-MM-DD HH:mm");
      return dateFormat;
    },

    convertirFormatoFecha(fecha) {
      const momento = moment(fecha, "YYYY/MM/DD HH:mm");
      const formatoConT = momento.format("YYYY-MM-DDTHH:mm:ss");
      return formatoConT;
    },

    getCurrentTime() {
      return moment().format("HH:mm:ss");
    },

    getCurrentTimeWithoutSeconds() {
      return moment().format("HH:mm");
    },

    getCurrentDateWithTime() {
      const fecha = moment().format("YYYY-MM-DD HH:mm");
      return fecha;
    },

    getCurrentDate() {
      return moment().format("DD/MM/YYYY");
    },

    objToQueryString(obj) {
      var str = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
    toUpper(str) {
      return toUpper(str);
    },
    removeAccents(str) {
      removeAccents(str);
    },
    trimEqual(str) {
      return toUpper(removeAccents(str));
    },
    isFormatValidXLS(header, columns) {
      this.$q.loading.show("Validando nombres de columnas");
      let result = {};
      result.isValid = true;
      for (var i = 1; i < header.length; i++) {
        if (i < columns.length + 1) {
          result[columns[i - 1].name] = i;
          if (
            this.trimEqual(header[i]) != this.trimEqual(columns[i - 1].label)
          ) {
            result.isValid = false;
            break;
          }
        } else {
          break;
        }
      }
      return result;
    },
    // onExportGeneric(_title, _columns, _rows) {
    //   let wb = new ExcelJS.Workbook();
    //   let ws = wb.addWorksheet(_title);

    //   let columns = [];
    //   _columns.forEach((col) => {
    //     if (col.hasOwnProperty("childrens")) {
    //       col.childrens.forEach((colDetail) => {
    //         columns.push({
    //           header: colDetail.label,
    //           key: colDetail.name + "_detail",
    //         });
    //       });
    //     } else {
    //       columns.push({ header: col.label, key: col.name });
    //     }
    //   });
    //   ws.columns = columns;

    //   let data = _rows || [];
    //   data.forEach((obj) => {
    //     let tempRow = {};
    //     _columns.forEach((col) => {
    //       const objCol = obj[col.field];
    //       if (col.hasOwnProperty("childrens")) {
    //         objCol.forEach((detail) => {
    //           const tempRowDetail = Object.assign({}, tempRow);
    //           col.childrens.forEach((colDetail) => {
    //             const objDetailCol = detail[colDetail.name];
    //             tempRowDetail[colDetail.name + "_detail"] =
    //               colDetail.format !== void 0
    //                 ? colDetail.format(objDetailCol)
    //                 : objDetailCol;
    //           });
    //           ws.addRow(tempRowDetail);
    //         });
    //       } else {
    //         tempRow[col.name] =
    //           col.format !== void 0 ? col.format(objCol) : objCol;
    //       }
    //     });
    //     ws.addRow(tempRow);
    //   });

    //   wb.xlsx.writeBuffer().then((buffer) => {
    //     var blob = new Blob([buffer], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     });
    //     const fileTitle = this.$filters.toLower(_title).replace(" ", "_");
    //     // const fileTitle = _title;
    //     const fileNow = this.$filters.now();
    //     const filename = "{title}_{now}.xlsx"
    //       .replace("{title}", fileTitle)
    //       .replace("{now}", fileNow);
    //     exportFile(filename, blob);
    //   });
    // },

    log(msg) {},
    alertResponse(data) {
      let msg = "";
      const isOk = Boolean(data.ok);
      if (Boolean(data.message) && data.message !== null) {
        msg = data.message;
      }

      if (Boolean(data.msg) && data.msg !== null) {
        msg = data.msg;
      }
      if (msg !== "") {
        if (isOk) {
          this.onSuccess(msg);
        } else {
          this.onError(msg);
        }
      }
    },
    goTo(value) {
      if (!value) return "";

      if (this.$route.path === value) {
        this.$router.push("/redirect").then(() => {
          this.$router.replace(value);
        });
      } else {
        this.$router.push(value);
      }
    },

    downloadFile(file) {
      openURL(URL_API + file);
    },
    getUrlFile(file) {
      if (!file) return "";
      return URL_API + file;
    },

    validateMail(value) {
      const re = /\S+@\S+\.\S+/;
      return re.test(value);
    },

    validateDateFormat(value) {
      return moment(value, "DD/MM/YYYY").isValid();
    },

    validateDateFormatRegister(value) {
      return moment(value, "DD/MM/YYYY").isValid();
    },

    parseOptionsFromObject(info) {
      const result = [];
      _.forEach(info, function (value, key) {
        result.push({
          label: value,
          value: key,
        });
      });
      return result;
    },

    alertError(message) {
      onError(message);
    },
    alertSuccess(message, time = 3000) {
      onSuccess(message, time);
    },
    onlyNumber($event) {
      const keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        $event.preventDefault();
      }
    },
    estadoColor(estado) {
      let color = null;
      const status = estado.substring(0, 3);

      if (status === "INI") {
        color = "#f2c037";
      } else if (status === "FIN") {
        if (estado === "FIN_DES") {
          color = "#c10015";
        } else {
          color = "#21ba45";
        }
      } else if (status === "ADJ") {
        color = "#21ba45";
      } else {
        color = "#f2c037";
      }

      return {
        backgroundColor: color,
      };
    },
    inArray(list, value) {
      return inArray(list, value);
    },
    openURL(url) {
      openURL(url, null, {
        noopener: true,
        noreferrer: true,
      });
    },
    numberToStringFormat(value) {
      return numberToString(value);
    },
    stringToNumberFormat(value) {
      return stringToNumber(value);
    },
    loadImage(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", function (arg) {
          const srcImage = new Image();
          srcImage.onload = function () {
            resolve(srcImage.result);
            // canvas.height = srcImage.height
            // canvas.width = srcImage.width
            // context.drawImage(srcImage, 0, 0)
            // var imageData = canvas.toDataURL("image/png")
            // output.src = imageData
            // uploadCanvas(imageData)
          };
          // srcImage.src = this.result
        });
        // reader.readAsDataURL(file)
        reader.readAsText(file);
      });
      // return new Promise(resolve => {
      //   const image = new Image()
      //   image.addEventListener('load', () => {
      //     resolve(image)
      //   })
      //   image.src = url
      // })
    },
    getCanvasBlob(canvas) {
      return new Promise(function (resolve, reject) {
        canvas.toBlob(
          function (blob) {
            resolve(blob);
          },
          "image/jpeg",
          1
        );
      });
    },
    columnToLetter(column) {
      let temp,
        letter = "";
      while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
      }
      return letter;
    },
    letterToColumn(letter) {
      let column = 0,
        length = letter.length;
      for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
      }
      return column;
    },
  },
};
