import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Grid, Button, Paper, alpha } from "@mui/material";
import {
  Inventory as InventoryIcon,
  Store as StoreIcon
} from "@mui/icons-material";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import AtomCard from "../../atoms/AtomCard";
import AtomTableForm from "../../atoms/AtomTableForm";
import AtomDialogForm from "../../atoms/AtomDialogForm";
import { useSnackbar } from "../../context/SnacbarContext";
import { apiService } from "../../service/apiService";
import { apiConfig } from "../../service/apiConfig";
import CustomLinearProgress from "../../atoms/CustomLinearProgress";

const columns = [
  {
    label: "Entidad",
    field: "entityName",
  },
  {
    label: "Estado",
    field: "status",
  },

  {
    label: "Total Registros",
    field: "totalRecords",
  },
  {
    label: "Registros Procesados",
    field: "processedRecords",
  },
  {
    label: "Inicio",
    field: "startTime",
    type: "date"
  },
  {
    label: "Fin",
    field: "endTime",
    type: "date"
  },
  {
    label: "Duración",
    field: "duration",
  }
];

const ActualizacionDim = () => {
  const { showSnackbar } = useSnackbar();
  const token = useSelector((state) => state.auth.auth.token);

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [processResult, setProcessResult] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService
        .setUrl(`${apiConfig.jobsDeltaUrl.url}?page=${page}&limit=${limit}`)
        .setMethod("GET")
        .send(token);
      const data = response.data.map((item) => {
        const start = item.startTime ? new Date(item.startTime).getTime() : 0;
        const end = item.endTime ? new Date(item.endTime).getTime() : 0;
        const diff = end > start ? (end - start) / 1000 : 0;
        const minutes = Math.floor(diff / 60);
        const seconds = Math.floor(diff % 60);

        return {
          ...item,
          entityName: item.entityName === "dim_almacenes_s08" ? "ALMACENES" : "PRODUCTOS",
          duration: diff > 0 ? `${minutes}m ${seconds}s` : "En proceso...",
        };
      });
      setJobs(data || []);
      setTotalJobs(response.pagination?.total || 0);
    } catch (error) {
      showSnackbar(error.message || "Error al obtener procesos", { severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, limit, token, showSnackbar]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCreateProcess = async (type) => {
    setLoading(true);
    setOpenCreateDialog(false);
    try {
      const config = type === "productos" ? apiConfig.syncProductosDeltaUrl : apiConfig.syncAlmacenesDeltaUrl;
      const response = await apiService
        .setUrl(config.url)
        .setMethod("POST")
        .setData({})
        .send(token);

      setProcessResult(response);
      setOpenResultDialog(true);
      showSnackbar("Proceso iniciado correctamente", { severity: "success" });
      fetchJobs();
    } catch (error) {
      showSnackbar(error.message || "Error al iniciar el proceso", { severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const processOptions = [
    {
      id: "almacenes",
      title: "Almacenes",
      description: "Sincronizar puntos de venta y bodegas",
      icon: <StoreIcon sx={{ fontSize: 32 }} />,
      color: "#F39400"
    },
    {
      id: "productos",
      title: "Productos",
      description: "Sincronizar catálogo de productos",
      icon: <InventoryIcon sx={{ fontSize: 32 }} />,
      color: "#0072CE"
    }
  ];

  return (
    <AtomContainerGeneral>
      <AtomCard
        title=""
        nameButton="Nuevo Proceso"
        onClick={() => setOpenCreateDialog(true)}
        children={
          <AtomTableForm
            columns={columns}
            data={jobs}
            pagination={true}
            page={page}
            limit={limit}
            count={totalJobs}
            setPage={setPage}
            setLimit={setLimit}
            handleChangePage={(e, p) => setPage(p)}
            handleChangeRowsPerPage={(e) => {
              setLimit(e.target.value);
              setPage(1);
            }}
            loading={loading}
            showIcons={false}
          />
        }
      />

      <AtomDialogForm
        openDialog={openCreateDialog}
        titleCrear="Iniciar Nuevo Proceso"
        handleCloseDialog={() => setOpenCreateDialog(false)}
        buttonCancel={true}
        buttonSubmit={false}
        maxWidth="md"
        dialogContentComponent={
          <Grid container spacing={3} sx={{ p: 2, display: "flex", flexDirection: "row" }} >
            <Grid item size={12}>
              <Typography variant="body1" sx={{ textAlign: "center", mb: 1, color: "#666" }}>
                Seleccione el tipo de dimensión que desea sincronizar:
              </Typography>
            </Grid>
            {processOptions.map((option) => (
              <Grid item size={6} key={option.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "20px",
                    border: "2px solid #f0f0f0",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      borderColor: option.color,
                      backgroundColor: alpha(option.color, 0.04),
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 24px ${alpha(option.color, 0.15)}`,
                      "& .icon-wrapper": {
                        backgroundColor: option.color,
                        color: "#fff",
                      }
                    }
                  }}
                  onClick={() => handleCreateProcess(option.id)}
                >
                  <Box
                    className="icon-wrapper"
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      backgroundColor: alpha(option.color, 0.1),
                      color: option.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
                    {option.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#888", display: "block", lineHeight: 1.2 }}>
                    {option.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        }
      />

      <AtomDialogForm
        openDialog={openResultDialog}
        titleCrear="Detalles del Proceso Iniciado"
        handleCloseDialog={() => setOpenResultDialog(false)}
        buttonCancel={false}
        buttonSubmit={true}
        textButtonSubmit="Cerrar"
        handleSubmit={() => {
          setOpenResultDialog(false)
          fetchJobs()
        }}
        maxWidth="md"
        dialogContentComponent={
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#dceaffff",
              borderRadius: "8px",
              maxHeight: "400px",
              overflow: "auto"
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
              Respuesta del Servidor:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {processResult?.message
                ?.replace("dim_producto_s08", "PRODUCTOS")
                ?.replace("dim_almacenes_s08", "ALMACENES")}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {processResult?.status}
            </Typography>
          </Paper>
        }
      />

      {loading && <CustomLinearProgress />}
    </AtomContainerGeneral>
  );
};

export default ActualizacionDim;
