import { boot } from "quasar/wrappers";
import moment from "moment";
import "moment/dist/locale/es";
import _ from "lodash";
import { toLower } from "src/functions/format";
// const moment = require("moment");
moment.locale("es");

export default boot(async ({ app }) => {
  app.config.globalProperties.$filters = {
    default(value, _default) {
      if (!value) return _default;
      return value;
    },
    // getCurrentDay(day) {
    //   const newDay = moment().date(day);
    //   const formattedDate = newDay.format("YYYY-MM-DD");
    //
    //   return formattedDate;
    // },

    generateRandomText() {
      const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    },

    generateRandomNumbers() {
      let numbers = "";
      for (let i = 0; i < 9; i++) {
        const randomNumber = Math.floor(Math.random() * 10);
        numbers += randomNumber;
      }
      return numbers;
    },

    formatearMoneda(numero) {
      return numero.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatToLocalizedDateString(fechaISO) {
      return moment(fechaISO)
        .locale("es")
        .format("ddd DD [de] MMM [del] YYYY HH:mm");
    },

    formatToMonthYear(dateString) {
      return moment(dateString).locale("es").format("MMMM YYYY");
    },

    formatDate(fecha) {
      return moment(fecha, "YYYY-MM-DD").format("DD/MM/YYYY");
    },

    addMonthsToGiveEpp(months) {
      const date = moment().add(months, "months");
      return date.format("DD/MM/YYYY");
    },

    formatDateToInfoEvent(dateString) {
      const date = moment(dateString, "DD-MM-YYYY HH:mm:ss");
      return date.format("ddd. D [de] MMM [del] YYYY HH:mm");
    },

    ubigeoToDepartmentDealer(value) {
      if (!value) return "";
      var id;
      if (value < 10) {
        id = "0" + value;
      } else {
        id = value;
      }
      return app.config.globalProperties.$ubigeo.departments[id];
    },

    toLower(str) {
      return toLower(str);
    },
    now() {
      return moment().format("YYYY_MM_DD_HH_mm_A");
    },
    inArray(arr, val) {
      return _.includes(arr, val);
    },
    getCurrentTime() {
      return moment().format("LTS");
    },
    toFromNow(value) {
      if (!value) return "";
      return moment(value).fromNow();
    },
    // formatDate(value) {
    //   if (!value) return "";
    //   return moment(value).format("DD/MM/YYYY hh:mm:ss A");
    // },

    addMonthsToDate(monthsToAdd) {
      const currentDate = moment();

      const newDate = currentDate.add(monthsToAdd, "months");

      return newDate.format("YYYY/MM/DD");
    },

    typeLostEpp(str) {
      return str === "INS"
        ? "dentro de la empresa"
        : str === "OUT"
        ? "fuera de la empresa"
        : "-";
    },

    typeDeclaracion(str) {
      return str === "DJD"
        ? "Declaración Jurada de docimicilio"
        : str === "DBS"
        ? "Declaración de beneficiarios de seguro vida ley"
        : str === "DCI"
        ? "Declaración de conflicto de interes"
        : "-";
    },

    getDate30DaysAgo() {
      const currentDate = moment();

      const fechaHace30Dias = currentDate.subtract(30, "days");

      const format = fechaHace30Dias.format("YYYY/MM/DD");

      return format;
    },

    getCurrentDate() {
      return moment().format("YYYY/MM/DD");
    },

    convertSize(bytes) {
      const kilobytes = bytes / 1024;
      const megabytes = kilobytes / 1024;

      if (megabytes >= 1) {
        return megabytes.toFixed(2) + " MB";
      } else {
        return kilobytes.toFixed(2) + " KB";
      }
    },

    motivoEntregaEpp(str) {
      return str === "PRI"
        ? "Primera vez"
        : str === "DES"
        ? "Renovación por desgaste"
        : str === "PER"
        ? "Renovación por pérdida"
        : "-";
    },

    typeEpp(str) {
      return str === "ACC"
        ? "Accesorio"
        : str === "PRE"
        ? "Prenda"
        : str === "CAL"
        ? "Calzado"
        : str === "GUA"
        ? "Guantes"
        : "-";
    },

    typeEntregaEpp(str) {
      return str === "PRO"
        ? "Equipo de protección personal"
        : str === "EME"
        ? "Equipo de emergencia"
        : str === "HER"
        ? "Herramienta de trabajo"
        : "-";
    },

    iconBytypeFile(str) {
      return str === "pdf"
        ? "fa-light fa-file-pdf"
        : str === "pptx" || str === "ppt"
        ? "fa-light fa-file-ppt"
        : "-";
    },

    bgByTypeFile(str) {
      return str === "pdf"
        ? "bg-red-2"
        : str === "pptx" || str === "ppt"
        ? "bg-amber-3"
        : "negative";
    },

    colorByTypeFile(str) {
      return str === "pdf"
        ? "red-14"
        : str === "pptx" || str === "ppt"
        ? "orange-8"
        : "negative";
    },

    truncateText(text, maxLength) {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + "...";
    },

    truncateTextFile(text, maxLength = 10) {
      const typeFile = text.split(".")[text.split(".").length - 1];
      // Verificamos si la longitud del texto es mayor que maxLength
      if (text.length > maxLength) {
        // Cortamos el texto y agregamos "..."
        return text.slice(0, maxLength) + "..." + typeFile;
      }
      // Si el texto es igual o más corto que maxLength, lo devolvemos sin cambios
      return text;
    },

    textProfile(frase) {
      if (frase) {
        const palabrasOmitidas = ["de"];
        let palabras = frase.trim().split(/\s+/);
        palabras = palabras.filter(
          (palabra) => !palabrasOmitidas.includes(palabra.toLowerCase())
        );

        if (palabras.length >= 2) {
          return palabras[0].slice(0, 1) + palabras[1].slice(0, 1);
        } else if (palabras.length === 1) {
          return palabras[0].slice(0, 1);
        }
      } else {
        return "-";
      }
    },

    calendarColorByStatus(str) {
      return str === "PLA"
        ? "Planificado"
        : str === "PEN"
        ? "status-event-PEN"
        : str === "PRO"
        ? "status-event-PRO"
        : str === "FIN"
        ? "status-event-FIN"
        : str === "CAN"
        ? "status-event-CAN"
        : str === "NOR"
        ? "status-event-NOR"
        : "status-event-PEN";
    },

    statusEvent(str) {
      return str === "PLA"
        ? "Planificado"
        : str === "PEN"
        ? "Pendiente"
        : str === "PRO"
        ? "En proceso"
        : str === "FIN"
        ? "Finalizado"
        : str === "CAN"
        ? "Cancelado"
        : str === "NOR"
        ? "No Realizado"
        : "-";
    },

    typeProduct(str) {
      return str === "PRI"
        ? "Primario"
        : str === "FIN"
        ? "Final"
        : "-";
    },
  };
});
