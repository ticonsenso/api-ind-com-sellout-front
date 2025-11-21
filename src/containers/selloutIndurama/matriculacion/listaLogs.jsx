import React from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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
} from "@mui/material";
import { useSnackbar } from "../../../context/SnacbarContext";
import { useDialog } from "../../../context/DialogDeleteContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import { usePermission } from "../../../context/PermisosComtext";
import IconoFlotante from "../../../atoms/IconActionPage";
import { columnsMatriculacion } from "../extraccion/constantes";
import AtomDialog from "../../../atoms/AtomDialogForm";
import { styles } from "../extraccion/constantes";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { formatDate, formatIsoToDate } from "../../constantes";

const ListaLogsMatriculacion = ({ calculateDate }) => {
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES MATRICULACION SELLOUT");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  const data = useSelector(
    (state) => state.configSellout?.dataMatriculacionRegistrados
  );
  const dataMatriculacionRegistrados = data.map((item) => ({
    ...item,
    calculateDate: formatDate(item?.calculateDate || null),
  }));

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detallesData, setDetallesData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
  };

  const buscarMatriculacionRegistrados = async () => {
    setLoading(true);
    try {
      dispatch(
        obtenerMatriculacionRegistrados({
          calculateDate,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMatriculacionRegistrados();
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
          response.payload.message || "Archivo descargado correctamente"
        );
      }
    } catch (error) {
      showSnackbar(error.message || "Error al descargar el archivo");
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
  ];

  const handleDetailsMatriculacion = (row) => {
    setDetallesData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDetallesData([]);
  };

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
              right={60}
              // color="#63B6FF"
              top={95}
            />
            {namePermission && (
              <IconoFlotante
                handleButtonClick={confirmarExportarExcel}
                title="Descargar lista matriculaciones por mes"
                iconName="SaveAlt"
                color="#5ab9f6"
                right={15}
                top={95}
              />
            )}
            <AtomCard
              title=""
              nameButton={""}
              search={false}
              children={
                <>
                  {loading ? (
                    <AtomCircularProgress />
                  ) : (
                    <AtomTableForm
                      columns={columnsMatriculacion}
                      data={dataMatriculacionRegistrados || []}
                      pagination={false}
                      actions={actions}
                      page={page}
                      limit={limit}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  )}
                </>
              }
            />
            <AtomDialog
              openDialog={open}
              handleCloseDialog={handleClose}
              title="Detalles de la matriculación"
              maxWidth="lg"
              buttonCancel="Cerrar"
              dialogContentComponent={
                <Box sx={{ width: "100%" }}>
                  <Box sx={styles.container} mb={2}>
                    <Typography variant="subtitle2" color="primary">
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
                  {detallesData?.logs?.length > 1 && (
                    <Box sx={styles.container}>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Detalles de Almacenes
                      </Typography>

                      <TableContainer
                        component={Paper}
                        elevation={0}
                        sx={styles.table}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={styles.tableCell}></TableCell>
                              <TableCell sx={styles.tableCell}>
                                <Typography sx={styles.typography}>
                                  Distribuidor
                                </Typography>
                              </TableCell>
                              <TableCell sx={styles.tableCell}>
                                <Typography sx={styles.typography}>
                                  Almacén
                                </Typography>
                              </TableCell>
                              <TableCell sx={styles.tableCell}>
                                <Typography sx={styles.typography}>
                                  Filas / Registros
                                </Typography>
                              </TableCell>
                              <TableCell sx={styles.tableCell}>
                                <Typography sx={styles.typography}>
                                  Unidades Vendidas
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {detallesData?.logs?.map((detalle, index) => (
                              <TableRow
                                key={`${detalle.distributor}-${detalle.codeStoreDistributor}-${index}`}
                              >
                                <TableCell sx={styles.tableCell}>
                                  {index + 1}
                                </TableCell>
                                <TableCell sx={styles.tableCellDetail}>
                                  {detalle.distributor}
                                </TableCell>
                                <TableCell sx={styles.tableCellDetail}>
                                  {detalle.storeName}
                                </TableCell>
                                <TableCell sx={styles.tableCellDetail}>
                                  {detalle.rowsCount}
                                </TableCell>
                                <TableCell sx={styles.tableCellDetail}>
                                  {detalle.productCount}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
