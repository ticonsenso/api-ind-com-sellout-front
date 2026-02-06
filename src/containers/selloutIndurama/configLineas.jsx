import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import AtomTextField from "../../atoms/AtomTextField";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../context/SnacbarContext";

import {
    obtenerLines,
    updateLines,
    deleteLines,
    createLines,
    subirExcelLines,
    exportarExcel,
} from "../../redux/configSelloutSlice";
import { columnsConfLines, camposConfLines } from "./constantes";
import { useDispatch, useSelector } from "react-redux";
import { useDialog } from "../../context/DialogDeleteContext";
import AtomSwitch from "../../atoms/AtomSwitch";
import { SaveAlt as SaveAltIcon } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { limitGeneral, pageGeneral } from "../constantes";
import AtomTableInformationExtraccion from "../../atoms/AtomTableInformationExtraccion";
import IconoFlotante from "../../atoms/IconActionPage";
import CustomLinearProgress from "../../atoms/CustomLinearProgress";

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

const ConfigLineas = () => {
    const dispatch = useDispatch();
    const { showDialog } = useDialog();
    const { showSnackbar } = useSnackbar();
    const [datosExcel, setDatosExcel] = useState({ lines: [] });
    const [openUploadExcel, setOpenUploadExcel] = useState(false);
    const dataLines = useSelector(
        (state) => state?.configSellout?.dataLines || []
    );
    console.log(dataLines);
    const totalLines = useSelector(
        (state) => state?.configSellout?.totalLines || 0
    );

    const [openCreateLines, setOpenCreateLines] = useState(false);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(pageGeneral);
    const [limit, setLimit] = useState(limitGeneral);
    const [editLines, setEditLines] = useState(false);
    const [lines, setLines] = useState({
        name: "",
        lineName: "",
    });
    const paramsValidate = ["name", "lineName"];
    const [loading, setLoading] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setLimit(event.target.value);
        setPage(1);
    };

    const handleOpenCreateLines = () => {
        setOpenCreateLines(true);
    };

    const handleCloseCreateLines = () => {
        setOpenCreateLines(false);
        setLines({
            name: "",
            lineName: "",
        });
        setErrors({});
        setEditLines(false);
    };

    const handleCloseUploadExcel = () => {
        setOpenUploadExcel(false);
        setDatosExcel({ lines: [] });
        setPage(1);
        setLimit(limitGeneral);
    };

    const debounceSearch = useCallback(
        debounce((value) => {
            buscarLines(value, pageGeneral, limitGeneral);
        }, 1000),
        []
    );

    const buscarLines = async (value, page, limit) => {
        setLoading(true);
        try {
            await dispatch(obtenerLines({ name: value, page, limit }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarLines(search, page, limit);
    }, [page, limit]);

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        paramsValidate.forEach((field) => {
            if (!lines[field]) {
                newErrors[field] = true;
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const actions = [
        {
            label: "Editar",
            color: "info",
            onClick: (row) => handleEditLines(row),
        },
        {
            label: "Eliminar",
            color: "error",
            onClick: (row) => handleDeleteLines(row),
        },
    ];

    const handleEditLines = (row) => {
        setEditLines(true);
        setLines(row);
        setOpenCreateLines(true);
    };

    const handleDeleteLines = (row) => {
        showDialog({
            title: "Eliminar línea",
            message: "¿Estás seguro de que deseas eliminar este registro?",
            onConfirm: async () => {
                const response = await dispatch(deleteLines(row.id));
                const msg =
                    response?.payload?.message || "Ocurrió un error al eliminar";
                showSnackbar(msg);

                if (response.meta?.requestStatus === "fulfilled") {
                    buscarLines();
                }
            },
        });
    };

    const handleGuardarEntidad = async ({
        data,
        dispatchFunction,
        onSuccessCallback,
        onResetForm,
    }) => {
        const response = await dispatch(dispatchFunction(data));

        if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message || "Registro exitoso");
            onSuccessCallback?.();
            onResetForm?.();
        } else {
            showSnackbar(response.payload.message || "Ocurrió un error");
        }
    };

    const handleGuardarLines = () => {
        if (!validateForm()) return;
        if (editLines) {
            handleGuardarEntidad({
                data: lines,
                dispatchFunction: updateLines,
                onSuccessCallback: () => buscarLines(search, page, limit),
                onResetForm: handleCloseCreateLines,
            });
        } else {
            handleGuardarEntidad({
                data: lines,
                dispatchFunction: createLines,
                onSuccessCallback: () => buscarLines(search, page, limit),
                onResetForm: handleCloseCreateLines,
            });
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const worksheet = workbook.worksheets[0]; // Take first sheet or filter by name

            if (!worksheet) {
                throw new Error("No se encontró ninguna hoja en el archivo");
            }

            const headerRow = worksheet.getRow(1);
            const headersOriginal = headerRow.values.slice(1);

            const headers = headersOriginal.map((h) =>
                String(h).toLowerCase().trim()
            );

            // Mapeo de headers esperados a keys
            const mapHeaders = {
                "nombre": "name",
                "descripción": "lineName",
            };

            const expectedHeaders = Object.keys(mapHeaders);
            const hasRequired = expectedHeaders.some(h => headers.includes(h));

            if (!hasRequired) {
            }

            const data = [];
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) return;

                const rowValues = row.values.slice(1);
                const item = {};

                const nameIndex = headers.indexOf("nombre");
                const descIndex = headers.indexOf("nombre linea");

                item.name = nameIndex !== -1 ? rowValues[nameIndex] : "";
                item.lineName = descIndex !== -1 ? rowValues[descIndex] : "";

                if (item.name || item.lineName) {
                    data.push(item);
                }
            });

            if (data.length === 0) {
                throw new Error("No se encontraron datos válidos en el archivo.");
            }

            setDatosExcel({ lines: data });
            setOpenUploadExcel(true);
            showSnackbar("Archivo cargado correctamente.");
        } catch (error) {
            showSnackbar(error.message || "Error leyendo el archivo Excel.");
        } finally {
            setLoading(false);
            event.target.value = null;
        }
    };

    const handleGuardarExcel = async () => {
        setLoading(true);

        try {
            const response = await dispatch(subirExcelLines(datosExcel));

            if (response.meta.requestStatus !== "fulfilled") {
                throw new Error(
                    response.payload?.message || "Ocurrió un error al subir los datos."
                );
            }

            showSnackbar(response.payload.message || "Se subieron todas las líneas exitosamente");
            handleCloseUploadExcel();
            buscarLines(search, page, limit);
        } catch (error) {
            showSnackbar(error.message || "Ocurrió un error durante la subida");
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async () => {
        setLoading(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("conf-lines");

            // Add headers
            worksheet.addRow(["Nombre", "Nombre Linea"]);

            // Ensure column width
            worksheet.columns = [
                { width: 30 },
                { width: 50 },
            ];

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "conf-lines.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);

            showSnackbar("Archivo descargado correctamente");
        } catch (error) {
            showSnackbar(error.message || "Error al generar el archivo");
        } finally {
            setLoading(false);
        }
    };

    const confirmarExportarExcel = () => {
        showDialog({
            title: "Confirmación de descarga",
            message:
                "Usted va a realizar la descarga del archivo excel de configuración de líneas",
            onConfirm: exportExcel,
            onCancel: () => { },
        });
    };

    return (
        <>
            <AtomContainerGeneral
                children={
                    <>
                        <IconoFlotante
                            handleButtonClick={confirmarExportarExcel}
                            title="Descargar lista líneas"
                            iconName="SaveAlt"
                            color="#5ab9f6"
                            right={77}
                        />
                        <IconoFlotante
                            handleButtonClick={() =>
                                document.getElementById("input-excel-conf-lines").click()
                            }
                            handleChangeFile={handleFileChange}
                            title="Subir archivo excel líneas"
                            id="input-excel-conf-lines"
                            iconName="DriveFolderUploadOutlined"
                        />
                        <AtomCard
                            title=""
                            nameButton="Crear"
                            border={true}
                            onClick={handleOpenCreateLines}
                            labelBuscador="Búsqueda por nombre o descripción"
                            placeholder="Buscar por:"
                            search={true}
                            valueSearch={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceSearch(e.target.value);
                            }}
                            children={
                                <>
                                    <AtomTableForm
                                        columns={columnsConfLines}
                                        data={dataLines}
                                        showIcons={true}
                                        actions={actions}
                                        pagination={true}
                                        page={page}
                                        limit={limit}
                                        count={totalLines}
                                        setPage={setPage}
                                        setLimit={setLimit}
                                        handleChangePage={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                        loading={loading}
                                    />
                                </>
                            }
                        />
                    </>
                }
            />
            <AtomDialogForm
                openDialog={openCreateLines}
                titleCrear={"Crear línea"}
                editDialog={editLines}
                titleEditar={"Editar línea"}
                buttonCancel={true}
                maxWidth="md"
                buttonSubmit={true}
                handleSubmit={handleGuardarLines}
                handleCloseDialog={handleCloseCreateLines}
                dialogContentComponent={
                    <Grid
                        container
                        spacing={2}
                        sx={{ width: "80%", justifyContent: "right" }}
                    >
                        {camposConfLines.map((campo) => (
                            <Grid size={campo.size} key={campo.id}>
                                <AtomTextField
                                    id={campo.id}
                                    headerTitle={campo.headerTitle}
                                    required={campo.required}
                                    value={lines[campo.id]}
                                    disabled={campo.disabled}
                                    onChange={(e) => {
                                        const nuevoValor = e.target.value;
                                        setLines({
                                            ...lines,
                                            [campo.id]: nuevoValor,
                                        });
                                    }}
                                    error={errors[campo.id]}
                                    helperText={
                                        errors[campo.id] ? "Campo requerido" : ""
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                }
            />
            <AtomDialogForm
                openDialog={openUploadExcel}
                titleCrear={"Datos Extraídos"}
                buttonCancel={loading ? false : true}
                handleSubmit={handleGuardarExcel}
                buttonSubmit={loading ? false : true}
                maxWidth="xl"
                handleCloseDialog={handleCloseUploadExcel}
                dialogContentComponent={
                    <Box sx={{ width: "100%", justifyContent: "center" }}>
                        {loading ? (
                            <CustomLinearProgress />
                        ) : (
                            <>
                                {datosExcel.lines.length > 0 ? (
                                    <AtomTableInformationExtraccion
                                        columns={columnsConfLines}
                                        data={datosExcel.lines}
                                        pagination={true}
                                    />
                                ) : (
                                    <Typography>No hay datos extraídos</Typography>
                                )}
                            </>
                        )}
                    </Box>
                }
            />
        </>
    );
};

export default ConfigLineas;
