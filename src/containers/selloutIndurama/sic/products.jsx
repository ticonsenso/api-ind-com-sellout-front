import React from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useEffect, useCallback } from "react";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import ExcelJS from "exceljs";
import { useSnackbar } from "../../../context/SnacbarContext";
import CustomLinearProgress from "../../../atoms/CustomLinearProgress";
import {
  obtenerProductsSic,
  updateProductsSic,
  deleteProductsSic,
  createProductsSic,
  subirExcelProductsSic,
  exportarExcel,
} from "../../../redux/configSelloutSlice";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomSwitch from "../../../atoms/AtomSwitch";
import {
  camposProductsSic,
  paramsValidateProductsSic,
  columnsProductsSic,
} from "./constantes";
import { limitGeneral } from "../../constantes";
import AtomTableInformationExtraccion from "../../../atoms/AtomTableInformationExtraccion";
import IconoFlotante from "../../../atoms/IconActionPage";
import { formatDate } from "../../constantes";

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const ProductsSic = () => {
  const dispatch = useDispatch();
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const dataProductsSic = useSelector(
    (state) => state?.configSellout?.dataProductsSic || []
  );
  const totalProductsSic = useSelector(
    (state) => state?.configSellout?.totalProductsSic || 0
  );

  const [openCreateProductsSic, setOpenCreateProductsSic] = useState(false);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [pageExtra, setPageExtra] = useState(1);
  const [limitExtra, setLimitExtra] = useState(limitGeneral);
  const [datosExcel, setDatosExcel] = useState([]);
  const [openUploadExcel, setOpenUploadExcel] = useState(false);
  const [editProductsSic, setEditProductsSic] = useState(false);
  const [productsSic, setProductsSic] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleCloseUploadExcel = () => {
    setOpenUploadExcel(false);
    setDatosExcel([]);
    setPage(1);
    setLimit(limitGeneral);
  };

  const handleChangePageExtra = (event, newPage) => {
    setPageExtra(newPage);
  };

  const handleChangeRowsPerPageExtra = (event) => {
    setLimitExtra(event.target.value);
    setPageExtra(1);
  };

  const handleOpenCreateProductsSic = () => {
    setOpenCreateProductsSic(true);
  };

  const handleCloseCreateProductsSic = () => {
    setOpenCreateProductsSic(false);
    clearProductsSic();
  };

  const clearProductsSic = () => {
    setProductsSic({});
    setErrors({});
    setOpenUploadExcel(false);
    setEditProductsSic(false);
    setLoading(false);
    buscarProductsSic();
  };

  const buscarProductsSic = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(obtenerProductsSic({ page, limit, search: value }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProductsSic(search, page, limit);
  }, [page, limit]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    paramsValidateProductsSic.forEach((field) => {
      if (!productsSic[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const actions = [
    // {
    //   label: "Editar",
    //   color: "info",
    //   onClick: (row) => handleEditProductsSic(row),
    // },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteProductsSic(row),
    },
  ];

  const handleEditProductsSic = (row) => {
    setEditProductsSic(true);
    setProductsSic(row);
    setOpenCreateProductsSic(true);
  };

  const handleDeleteProductsSic = (row) => {
    showDialog({
      title: "Eliminar producto",
      message: "¿Estás seguro de que deseas eliminar este registro?",
      onConfirm: async () => {
        const response = await dispatch(deleteProductsSic(row.id));
        const msg =
          response?.payload?.message || "Ocurrió un error al eliminar";
        showSnackbar(msg, { severity: "success" });

        if (response.meta?.requestStatus === "fulfilled") {
          buscarProductsSic();
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
      showSnackbar(response.payload.message || "Registro exitoso", { severity: "success" });
      onSuccessCallback?.();
      onResetForm?.();
    } else {
      showSnackbar(response.payload.message || "Ocurrió un error", { severity: "error" });
    }
  };

  const handleGuardarProductsSic = () => {
    if (!validateForm()) return;
    if (editProductsSic) {
      handleGuardarEntidad({
        data: productsSic,
        dispatchFunction: updateProductsSic,
        onSuccessCallback: () => buscarProductsSic(),
        onResetForm: handleCloseCreateProductsSic,
      });
    } else {
      handleGuardarEntidad({
        data: productsSic,
        dispatchFunction: createProductsSic,
        onSuccessCallback: () => buscarProductsSic(),
        onResetForm: handleCloseCreateProductsSic,
      });
    }
  };

  const debounceSearchAddress = useCallback(
    debounce((value) => {
      buscarProductsSic(value, page, limit);
    }, 1000),
    []
  );

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "prod sic",
          nombre: "Productos SIC",
        })
      );
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        showSnackbar(
          response.payload.message || "Archivo descargado correctamente", { severity: "success" }
        );
      }
    } catch (error) {
      showSnackbar(error.message || "Error al descargar el archivo", { severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const confirmarExportarExcel = () => {
    showDialog({
      title: "Confirmación de descarga",
      message:
        "Usted va a realizar la descarga del archivo excel de productos SIC",
      onConfirm: exportExcel,
      onCancel: () => { },
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.worksheets.find(
        (ws) => ws.name === "prod sic"
      );
      if (!worksheet) {
        throw new Error("La hoja 'prod sic' no fue encontrada en el archivo");
      }

      const headerRow = worksheet.getRow(1);
      const headers = headerRow.values.slice(1);

      const expectedHeaders = columnsProductsSic
        .filter((col) => col.field !== "status")
        .map((col) => col.label);

      const missingHeaders = expectedHeaders.filter(
        (h) => !headers.includes(h)
      );
      if (missingHeaders.length > 0) {
        throw new Error(
          `Faltan columnas en el Excel: ${missingHeaders.join(", ")}`
        );
      }

      const data = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // saltar encabezado

        const rowValues = row.values.slice(1);
        const item = {};

        columnsProductsSic.forEach(({ field, label }) => {
          if (field === "status") {
            item[field] = true; // asignar true por defecto
          } else {
            const colIndex = headers.indexOf(label);
            item[field] = colIndex !== -1 ? rowValues[colIndex] ?? "" : "";
          }
        });

        data.push(item);
      });

      if (data.length === 0) {
        throw new Error("No se encontraron datos válidos en el archivo.");
      }

      setDatosExcel(data);
      setOpenUploadExcel(true);
      showSnackbar("Archivo cargado correctamente.", { severity: "success" });
    } catch (error) {
      showSnackbar(error.message || "Error leyendo el archivo Excel.", { severity: "error" });
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };


  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            {/* <IconoFlotante
              handleButtonClick={confirmarExportarExcel}
              title="Descargar lista productos SIC"
              iconName="SaveAlt"
              color="#5ab9f6"
              right={77}
            />
            <IconoFlotante
              id="input-excel-product-sic"
              handleButtonClick={() =>
                document.getElementById("input-excel-product-sic").click()
              }
              handleChangeFile={handleFileChange}
              title="Subir excel de productos SIC"
            /> */}

            <AtomCard
              title=""
              nameButton=""
              border={true}
              onClick={handleOpenCreateProductsSic}
              search={true}
              valueSearch={search}
              onChange={(e) => {
                setPage(1);
                setLimit(5);
                setSearch(e.target.value);
                debounceSearchAddress(e.target.value);
              }}
              children={
                <>
                  <AtomTableForm
                    columns={columnsProductsSic}
                    data={dataProductsSic}
                    showIcons={true}
                    actions={actions}
                    pagination={true}
                    page={page}
                    limit={limit}
                    count={totalProductsSic}
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
        openDialog={openCreateProductsSic}
        titleCrear={"Crear producto SIC"}
        editDialog={editProductsSic}
        titleEditar={"Editar producto SIC"}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleGuardarProductsSic}
        handleCloseDialog={handleCloseCreateProductsSic}
        dialogContentComponent={
          <Grid
            container
            spacing={2}
            sx={{ width: "80%", justifyContent: "center" }}
          >
            {camposProductsSic.map((campo) => (
              <Grid size={campo.size} key={campo.id}>
                <AtomTextField
                  id={campo.id}
                  required={campo.required}
                  headerTitle={campo.headerTitle}
                  value={productsSic[campo.id] || ""}
                  placeholder={campo.placeholder}
                  multiline={campo.multiline}
                  rows={campo.rows}
                  onChange={(e) => {
                    setProductsSic({
                      ...productsSic,
                      [campo.id]: e.target.value,
                    });
                  }}
                  error={errors[campo.id]}
                  helperText={errors[campo.id] ? "El campo es requerido" : ""}
                />
              </Grid>
            ))}
            <Grid size={4}>
              <AtomSwitch
                id="discontinued"
                required={true}
                title="Descontinuado"
                tooltip="Define si el producto está descontinuado"
                checked={Boolean(productsSic.discontinued)}
                onChange={(e) =>
                  setProductsSic({
                    ...productsSic,
                    discontinued: e.target.checked,
                  })
                }
              />
            </Grid>
          </Grid>
        }
      />
    </>
  );
};

export default ProductsSic;
