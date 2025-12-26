import { PALABRAS_INVALIDAS, normalizarTexto } from "./constantes.js";
import * as XLSX from "xlsx";

export const repartirValoresNumerico = (registroOriginal) => {
    const descripcion = registroOriginal.descriptionDistributor || "";


    const esCodigoValido = (valor) => {
        if (!valor) return false;

        if (/\s/.test(valor)) return false;

        const regex = /^[A-Z0-9][A-Z0-9\-\/]*$/i;
        return regex.test(valor);
    };

    const codigoOriginal = registroOriginal.codeProductDistributor || "";
    const codigoEsValido = esCodigoValido(codigoOriginal);

    const separadores = ["\\t", "[\\r\\n]+", "\\+", "\\/"];
    const regexSeparador = new RegExp(separadores.join("|"), "g");

    const productos = descripcion
        .split(regexSeparador)
        .map((linea) => linea.trim())
        .filter((linea) => linea !== "");

    if (productos.length <= 1) {
        return [registroOriginal];
    }


    let cantidadOriginal = Number(registroOriginal.unitsSoldDistributor);
    if (isNaN(cantidadOriginal) || cantidadOriginal < 1) {
        cantidadOriginal = 1;
    }


    if (cantidadOriginal === 1) {
        return productos.map((prod) => ({
            ...registroOriginal,
            descriptionDistributor: prod,
            codeProductDistributor: codigoEsValido ? codigoOriginal : prod,
            unitsSoldDistributor: 1,
        }));
    }

    let cantidadDividida = Math.round(cantidadOriginal / productos.length);
    if (cantidadDividida < 1) cantidadDividida = 1;

    return productos.map((prod) => ({
        ...registroOriginal,
        descriptionDistributor: prod,
        codeProductDistributor: codigoEsValido ? codigoOriginal : prod,
        unitsSoldDistributor: cantidadDividida,
    }));
};


export const tieneSeparadores = (descripcion, simboloConfig) => {
    if (!descripcion) return false;

    const separadores = [
        /\t/,
        /\r?\n/,
        /\//,
        /\+/,
    ];

    if (simboloConfig) {
        const escaped = simboloConfig.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        separadores.push(new RegExp(escaped));
    }

    return separadores.some((sep) => sep.test(descripcion));
};


export const construirFechaDesdeComponente = ({ diaTexto, mesTexto, anioTexto }) => {
    if (!mesTexto || !anioTexto) return null;

    const meses = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        setiembre: 9,
        noviembre: 11,
        diciembre: 12,
    };

    const normalizarTexto = (texto) =>
        texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const mesNormalizado = normalizarTexto(String(mesTexto));
    const mes =
        !isNaN(mesTexto) && mesTexto !== ""
            ? parseInt(mesTexto, 10)
            : meses[mesNormalizado] ?? null;

    const anio = parseInt(anioTexto, 10);
    const dia = diaTexto ? parseInt(diaTexto, 10) : 1;

    if (!mes || isNaN(anio) || isNaN(dia)) return null;

    const fecha = new Date(anio, mes - 1, dia);
    if (isNaN(fecha.getTime())) return null;

    return fecha.toISOString().split("T")[0];
};

export const extraerTextoCelda = (celda) => {
    if (celda == null || celda == undefined) return "";

    if (typeof celda === "string") return celda.trim();

    if (typeof celda === "number") return String(celda);

    if (Object.prototype.toString.call(celda) === "[object Date]") {
        return celda.toISOString();
    }

    if (typeof celda === "object") {
        if ("v" in celda) {
            if (typeof celda.v === "string") return celda.v.trim();
            if (typeof celda.v === "number") return String(celda.v);
            if (celda.v instanceof Date) return celda.v.toISOString();
        }
        if ("text" in celda && typeof celda.text === "string")
            return celda.text.trim();
        if ("result" in celda && typeof celda.result === "string")
            return celda.result.trim();
        if ("richText" in celda && Array.isArray(celda.richText)) {
            return celda.richText
                .map((rt) => rt.text)
                .join("")
                .trim();
        }
    }

    return "";
};

export const normalizarFechaISO = (valorCelda) => {
    if (!valorCelda && valorCelda !== 0) return null;

    let fecha = null;

    if (typeof valorCelda === "number") {
        const serial = Math.round(valorCelda);
        if (serial >= 1 && serial <= 2958465) {
            fecha = new Date((serial - 25569) * 86400 * 1000);
        }
    }

    else if (Object.prototype.toString.call(valorCelda) === "[object Date]") {
        fecha = valorCelda;
    }

    else if (typeof valorCelda === "string") {
        const texto = valorCelda.trim();

        const matchSerial = texto.match(/^\+?0*(\d{4,7})(\.\d+)?$/);
        if (matchSerial) {
            const serial = Math.round(parseFloat(matchSerial[1]));
            if (serial >= 1 && serial <= 2958465) {
                fecha = new Date((serial - 25569) * 86400 * 1000);
            }
        }

        if (!fecha) {
            const matchSlash = texto.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
            if (matchSlash) {
                let dia = parseInt(matchSlash[1], 10);
                let mes = parseInt(matchSlash[2], 10);
                let anio = parseInt(matchSlash[3], 10);

                if (anio < 100) anio = 2000 + anio;

                fecha = new Date(anio, mes - 1, dia);

                if (
                    fecha.getFullYear() !== anio ||
                    fecha.getMonth() + 1 !== mes ||
                    fecha.getDate() !== dia
                ) {
                    fecha = null;
                }
            }
        }

        if (!fecha) {
            const matchPuntos = texto.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
            if (matchPuntos) {
                const dia = parseInt(matchPuntos[1], 10);
                const mes = parseInt(matchPuntos[2], 10);
                const anio = parseInt(matchPuntos[3], 10);

                fecha = new Date(anio, mes - 1, dia);

                if (
                    fecha.getFullYear() !== anio ||
                    fecha.getMonth() + 1 !== mes ||
                    fecha.getDate() !== dia
                ) {
                    fecha = null;
                }
            }
        }

        if (!fecha) {
            const matchLetras = texto.match(/^(\d{1,2})-([A-Za-z]+)-(\d{2,4})$/);
            if (matchLetras) {
                const dia = parseInt(matchLetras[1], 10);
                const mesStr = matchLetras[2].toLowerCase();
                const anioCorto = parseInt(matchLetras[3], 10);

                const meses = {
                    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
                    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
                };

                const mes = meses[mesStr.slice(0, 3)];
                let anio = anioCorto < 100 ? 2000 + anioCorto : anioCorto;

                if (!isNaN(dia) && mes !== undefined && !isNaN(anio)) {
                    fecha = new Date(anio, mes, dia);
                }
            }
        }

        if (!fecha) {
            const timestamp = Date.parse(texto);
            if (!isNaN(timestamp)) {
                fecha = new Date(timestamp);
            }
        }
    }

    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
        return fecha.toISOString().split("T")[0];
    }

    return null;
};

export const getUltimoDiaMesActual = (fechaInput) => {
    const [year, month, day] = fechaInput.split("-").map(Number);
    if (!year || !month || !day)
        throw new Error(`Fecha inválida: ${fechaInput}`);

    const ultimoDia = new Date(year, month, 0);

    const yyyy = ultimoDia.getFullYear();
    const mm = String(ultimoDia.getMonth() + 1).padStart(2, "0");
    const dd = String(ultimoDia.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
};

export const detectarColumnasAutomaticamente = (fila, COLUMN_KEYWORDS) => {
    const resultado = {};

    const headers = fila.map((celda) =>
        normalizarTexto(extraerTextoCelda(celda))
    );

    for (const [tipo, keywords] of Object.entries(COLUMN_KEYWORDS)) {
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            for (const keyword of keywords) {
                if (header === keyword) {
                    if (resultado[tipo] === undefined) {
                        resultado[tipo] = i;
                        break;
                    }
                }
            }
        }
    }

    return resultado;
};

export const detectHeader = (rows, COLUMN_KEYWORDS) => {
    const defaultsAplicados = new Set();

    for (let i = 0; i < Math.min(100, rows.length); i++) {
        const fila = rows[i];

        const cleanedRow = fila.map(celda => extraerTextoCelda(celda));
        const nonEmptyCells = cleanedRow.filter(c => c !== "");

        if (nonEmptyCells.length < 2) continue;

        const mapeo = detectarColumnasAutomaticamente(
            cleanedRow,
            COLUMN_KEYWORDS
        );

        if (mapeo.unitsSoldDistributor === undefined) {
            defaultsAplicados.add("unitsSoldDistributor");
        }

        if (mapeo.codeStoreDistributor === undefined) {
            defaultsAplicados.add("codeStoreDistributor");
        }

        if (mapeo.codeProductDistributor === undefined) {
            defaultsAplicados.add("codeProductDistributor");
        }

        if (mapeo.descriptionDistributor !== undefined) {
            return {
                header: fila,
                rowIndex: i,
                defaultsAplicados,
            };
        }
    }

    return {
        header: null,
        rowIndex: -1,
        defaultsAplicados,
    };
};


export const getSheetIndexes = ({
    hojaInicio,
    hojaFin,
    extraerTodos,
    totalHojas,
}) => {
    const start = parseInt(hojaInicio, 10) - 1;
    const end = parseInt(hojaFin, 10) - 1;

    const isValidStart = !isNaN(start) && start >= 0 && start < totalHojas;
    const isValidEnd = !isNaN(end) && end >= start && end < totalHojas;

    if (extraerTodos) return Array.from({ length: totalHojas }, (_, i) => i);
    if (isValidStart && isValidEnd)
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    if (isValidStart) return [start];
    return [0];
};

export const extractRowsFromWorksheet = (worksheet, limiteVacias = 5) => {
    let rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
        blankrows: false,
    });

    if (!rows.length) return [];

    let resultadoFinal = [];
    let consecutivasVacias = 0;

    for (let i = 0; i < rows.length; i++) {
        const fila = rows[i];
        const filaVacia = fila.every(
            (cell) => cell === "" || cell === null || cell === undefined
        );

        if (filaVacia) {
            consecutivasVacias++;
            if (consecutivasVacias >= limiteVacias) {
                console.warn(
                    `⚠️ Se detuvo la lectura en la fila ${i} por exceso de filas vacías consecutivas`
                );
                break;
            }
            continue;
        } else {
            consecutivasVacias = 0;
        }

        let consecutivasColVacias = 0;
        let ultimaColumnaConDato = fila.length - 1;

        for (let j = 0; j < fila.length; j++) {
            const cell = fila[j];
            if (cell === "" || cell === null || cell === undefined) {
                consecutivasColVacias++;
                if (consecutivasColVacias >= limiteVacias) {
                    ultimaColumnaConDato = j - limiteVacias;
                    break;
                }
            } else {
                consecutivasColVacias = 0;
                ultimaColumnaConDato = j;
            }
        }

        resultadoFinal.push(fila.slice(0, ultimaColumnaConDato + 1));
    }

    return resultadoFinal;
};

export const normalizarTextoDescripcion = (txt) =>
    txt
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[∕⁄／]/g, "/")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

export const validarDescripcion = (desc) => {
    const descripcionFormat = desc.trim().toLowerCase();
    const descripcion = normalizarTextoDescripcion(descripcionFormat);

    if (descripcion.length < 2) return false;

    if (!/[\p{L}\p{N}]/u.test(descripcion)) return false;

    const palabras = descripcion.split(/\s+/);
    const invalidas = PALABRAS_INVALIDAS.map(p => p.toLowerCase());

    if (invalidas.includes(descripcion)) return false;

    for (const palabra of invalidas) {
        const regex = new RegExp(`\\b${palabra}\\b`, "i");

        if (regex.test(descripcion)) {
            if (palabras.length === 1) return false;
        }
    }

    return true;
};

export const validarAlmacen = (valor) => {
    if (!valor) return false;
    const texto = valor.trim().toLowerCase();
    if (texto.length < 2) return false;

    const invalidas = PALABRAS_INVALIDAS.map(p => p.toLowerCase());
    if (invalidas.includes(texto)) return false;
    return true;
};

export const detectarSiDebeSepararse = (registroOriginal, simbolo) => {
    const descripcion = (registroOriginal?.descriptionDistributor || "").toString();

    // Si no hay símbolo definido en la configuración, usa los separadores por defecto.
    const separadores = simbolo
        ? [simbolo.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')] // Escapar el símbolo si existe
        : ["\\t", "[\\r\\n]+", "\\+", "\\/"];

    const regexSeparador = new RegExp(separadores.join("|"), "g");
    const shouldSplit = regexSeparador.test(descripcion);

    return {
        shouldSplit,
        registroOriginal
    };
};


