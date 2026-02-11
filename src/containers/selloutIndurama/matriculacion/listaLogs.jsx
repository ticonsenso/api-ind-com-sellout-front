import React from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import {
  obtenerMatriculacionRegistrados,
  exportarExcel,
} from "../../../redux/configSelloutSlice";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import { useSnackbar } from "../../../context/SnacbarContext";
import { useDialog } from "../../../context/DialogDeleteContext";
import CustomLinearProgress from "../../../atoms/CustomLinearProgress";
import { usePermission } from "../../../context/PermisosComtext";
import IconoFlotante from "../../../atoms/IconActionPage";
import { columnsMatriculacion, columnsDetallesMatriculacion } from "../extraccion/constantes";
import AtomDialog from "../../../atoms/AtomDialogForm";
import { styles } from "../extraccion/constantes";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { formatDate, isMonthClosed, debounce, timeSearch } from "../../constantes";
import { deleteClientesCargados } from "../../../redux/extraccionSlice"
import {
  obtenerMatriculacionConfig,
} from "../../../redux/selloutDatosSlic";
import AtomTextFielInputForm from "../../../atoms/AtomTextField";
const ListaLogsMatriculacion = ({ calculateDate }) => {
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES MATRICULACION SELLOUT");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  const dataMatriculacionRegistrados = useSelector(
    (state) => state.configSellout?.dataMatriculacionRegistrados
  );

  const dataMatriculacionConfig = useSelector(
    (state) => state.selloutDatos.dataMatriculacionConfig
  );
  const monthToCompare = calculateDate;
  const matriculacionConfigrada = dataMatriculacionConfig?.find(
    (config) => config.month === monthToCompare
  );
  const matriculacionCerrada = isMonthClosed(
    matriculacionConfigrada?.closingDate
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detallesData, setDetallesData] = useState([]);
  const [search, setSearch] = useState('');
  const [searchAlmacen, setSearchAlmacen] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
  };

  const buscarMatriculacion = async () => {
    await dispatch(
      obtenerMatriculacionConfig({ page: 1, limit: 1000 })
    );
  };

  const debounceSearch = useCallback(
    debounce((value) => {
      buscarMatriculacionRegistrados(value);
    }, timeSearch),
    [calculateDate]
  );

  useEffect(() => {
    buscarMatriculacion();
  }, [calculateDate]);


  const buscarMatriculacionRegistrados = async (value) => {
    setLoading(true);
    try {
      dispatch(
        obtenerMatriculacionRegistrados({
          calculateDate,
          distributor: value,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMatriculacionRegistrados(search);
  }, [calculateDate]);

  const confirmarExportarExcel = () => {
    showDialog({
      title: "Confirmación de descarga",
      message:
        "Usted va a realizar la descarga del archivo excel de matriculaciones con fecha: " +
        formatDate(calculateDate),
      onConfirm: exportExcel,
      onCancel: () => { },
    });
  };

  const exportExcel = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        exportarExcel({
          excel_name: "matriculation_logs",
          nombre: "Detalles_Matriculaciones",
          calculateDate: formatDate(calculateDate),
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

  const actions = [
    {
      label: "Detalles",
      color: "success",
      onClick: (row) => handleDetailsMatriculacion(row),
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteDistribuidor(row),
    }
  ];

  const actionsDetalles = [
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteDistribuidorAlmacen(row),
    }
  ];


  const handleDeleteDistribuidor = (row) => {
    showDialog({
      title: "Confirmación de eliminación", message:
        `¿Está seguro que desea eliminar todos los datos registrados a:  Distribuidor: ${row?.distributor}   - Fecha: ${calculateDate}?`,
      onConfirm: async () => {
        try {
          const data = {
            distribuidor: row.id || null,
            storeName: row.storeName || null,
            calculateDate: calculateDate || null,
          }
          const response = await dispatch(deleteClientesCargados(data));
          if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message || "Registro exitoso", { severity: "success" });
            buscarMatriculacionRegistrados();
          } else {
            showSnackbar(response.payload.message || "Ocurrió un error", { severity: "error" });
          }
        } catch (error) {
          showSnackbar(error || "Error al eliminar la matriculacion", { severity: "error" });
        }
      },
      onCancel: () => { },
    });
  };

  const handleDeleteDistribuidorAlmacen = (row) => {
    showDialog({
      title: "Confirmación de eliminación", message: `¿Está seguro que desea eliminar los registros: Distribuidor: ${row?.distributor} Almacén: ${row?.storeName}?`,
      onConfirm: async () => {
        try {
          const response = await dispatch(deleteClientesCargados({ distribuidor: row.distributor, storeName: row.storeName, calculateDate: calculateDate }));
          if (response.meta.requestStatus === "fulfilled") {
            setDetallesData((prev) => ({
              ...prev,
              logs: prev.logs.filter((log) => log.id !== row.id),
            }));

          } else {
            showSnackbar(response.payload.message || "Ocurrió un error", { severity: "error" });
          }
        } catch (error) {
          showSnackbar(error || "Error al eliminar la matriculacion", { severity: "error" });
        }
      },
      onCancel: () => { },
    });
  };

  const handleDetailsMatriculacion = (row) => {
    setDetallesData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetallesData([]);
    setSearchAlmacen('');
    buscarMatriculacionRegistrados(search);
  };

  const filteredLogs = detallesData?.logs?.filter((log) =>
    log.storeName?.toLowerCase().includes(searchAlmacen.toLowerCase())
  ) || [];

  const NOMBRES_CAMPOS = {
    distributor: "DISTRIBUIDOR",
    storeName: "ALMACÉN",
    calculateDate: "FECHA DE REGISTRO",
    isUploaded: "CARGADO",
    productCountTotal: "UNIDADES VENDIDAS",
    rowCountTotal: "FILAS",
  };

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <IconoFlotante
              handleButtonClick={() => {
                buscarMatriculacionRegistrados();
              }}
              title="Actualizar lista"
              iconName="Refresh"
              right={50}
              color="#63B6FF"
              top={95}
            />
            {namePermission && (
              <IconoFlotante
                handleButtonClick={confirmarExportarExcel}
                title="Descargar lista matriculaciones por mes"
                iconName="SaveAlt"
                color="#01960eff"
                right={10}
                top={95}
              />
            )}
            <AtomCard
              title=""
              nameButton={""}
              search={true}
              placeholder="Buscar distribuidor"
              searchValue={search}
              onChange={(e) => {
                setSearch(e.target.value);
                debounceSearch(e.target.value);
              }}
              children={
                <>
                  <AtomTableForm
                    columns={columnsMatriculacion}
                    data={dataMatriculacionRegistrados || []}
                    pagination={false}
                    actions={matriculacionCerrada === "abierto" ? actions : []}
                    page={page}
                    limit={limit}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    loading={loading}
                  />
                </>
              }
            />
            <AtomDialog
              openDialog={open}
              handleCloseDialog={handleClose}
              title="Detalles de la matriculación"
              maxWidth="xl"
              buttonCancel="Cerrar"
              dialogContentComponent={
                <Box sx={{ width: "100%" }}>
                  <Box sx={styles.container} mb={2}>
                    <Typography color="primary" sx={{ fontWeight: 500 }}>
                      Datos de la matriculación
                    </Typography>

                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={styles.table}
                    >
                      <Table size="small">
                        <TableBody>
                          {Object.keys(NOMBRES_CAMPOS).map((key) => (
                            <TableRow key={key}>
                              <TableCell
                                sx={{ ...styles.tableCell, width: "35%" }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  sx={styles.typography}
                                >
                                  {NOMBRES_CAMPOS[key]}
                                </Typography>
                              </TableCell>
                              <TableCell sx={styles.tableCellDetail}>
                                {key === "isUploaded" ? (
                                  detallesData?.[key] === true ? (
                                    <CheckCircleIcon color="success" />
                                  ) : (
                                    <CancelIcon color="error" />
                                  )
                                ) : (
                                  detallesData?.[key] ?? "N/A"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  {detallesData?.logs?.length > 0 && (
                    <Box sx={styles.container}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <Typography
                          color="primary"
                          gutterBottom
                          sx={{ width: "50%", fontWeight: 500, }}
                        >
                          Detalles de Almacenes
                        </Typography>
                        <Box sx={{ width: "40%" }}>
                          <AtomTextFielInputForm
                            id="searchAlmacen"
                            height="40px"
                            color="#ecf3ffff"
                            placeholder="Buscar almacén..."
                            headerTitle=""
                            value={searchAlmacen}
                            onChange={(e) => setSearchAlmacen(e.target.value)}
                          />
                        </Box>
                      </Box>
                      <AtomTableForm
                        columns={columnsDetallesMatriculacion}
                        data={filteredLogs}
                        pagination={false}
                        actions={actionsDetalles}
                        page={page}
                        limit={limit}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </Box>
                  )}
                </Box>
              }
            />
          </>
        }
      />
    </>
  );
};

export default ListaLogsMatriculacion;
