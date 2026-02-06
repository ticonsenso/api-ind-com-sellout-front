import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import {
  obtenerMatriculacionConfig,
  createMatriculacionConfig,
  updateMatriculacionConfig,
  deleteMatriculacionConfig,
} from "../../../redux/selloutDatosSlic";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import AtomTextField from "../../../atoms/AtomTextField";
import AtomContainerGeneral from "../../../atoms/AtomContainerGeneral";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "../../../context/SnacbarContext";
import { useDialog } from "../../../context/DialogDeleteContext";
import CustomLinearProgress from "../../../atoms/CustomLinearProgress";
import { usePermission } from "../../../context/PermisosComtext";
import { limitGeneral } from "../../constantes";
import AtomDatePicker from "../../../atoms/AtomDatePicker";
import { Box } from "@mui/material";

const formatDate = (fechaISO) => {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getUTCDate()).padStart(2, "0");
  const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const anio = fecha.getUTCFullYear();
  return `${anio}-${mes}-${dia}`;
};

const sumarUnMes = (fechaStr) => {
  if (!fechaStr) return undefined;

  const [anioStr, mesStr, diaStr] = fechaStr.split("-");
  let anio = parseInt(anioStr, 10);
  let mes = parseInt(mesStr, 10);
  const dia = parseInt(diaStr, 10);

  mes += 1;
  if (mes > 12) {
    mes = 1;
    anio += 1;
  }

  const mm = String(mes).padStart(2, "0");
  const dd = String(dia).padStart(2, "0");

  return `${anio}-${mm}-${dd}`;
};

const sumarCierre = (fechaStr) => {
  if (!fechaStr) return undefined;

  const [anioStr, mesStr] = fechaStr.split("-");

  let anio = parseInt(anioStr, 10);
  let mes = parseInt(mesStr, 10);

  // Sumar un mes
  mes += 1;
  if (mes > 12) {
    mes = 1;
    anio += 1;
  }

  const mm = String(mes).padStart(2, "0");

  return `${anio}-${mm}-15`;
};

const formatISODateToMesAnio = (fechaISO) => {
  if (!fechaISO) return undefined;
  const [anio, mes] = fechaISO.split("-");
  const fecha = new Date(Number(anio), Number(mes) - 1);
  const opciones = { month: "long", year: "numeric" };
  return fecha.toLocaleDateString("es-ES", opciones).replace(" de ", " ");
};

const isClosed = (closingDate) => {
  const hoy = new Date();
  const cierre = new Date(closingDate);

  hoy.setHours(0, 0, 0, 0);
  cierre.setHours(0, 0, 0, 0);

  const cierreMasUno = new Date(cierre);
  cierreMasUno.setDate(cierreMasUno.getDate() + 2);

  return hoy >= cierreMasUno ? "Cerrado ⛔" : "Abierto 🟢";
};

const columns = [
  {
    label: "Mes calculo",
    field: "monthFormatted",
  },
  {
    label: "Fecha de inicio",
    field: "startDate",
    type: "date",
  },
  {
    label: "Fecha de cierre",
    field: "closingDate",
    type: "date",
  },

  {
    label: "Estado",
    field: "status",
  },
];

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const ConfiguracionMatriculacion = () => {
  const hasPermission = usePermission();
  const namePermission = hasPermission("CONFIGURACION CIERRE SELLOUT");
  const isAdmin = hasPermission("CONFIGURACION ADMINISTRADOR");
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  const data = useSelector(
    (state) => state.selloutDatos.dataMatriculacionConfig
  );
  const dataMatriculacionConfig = data.map((item) => ({
    ...item,
    createdAt: formatDate(item.createdAt),
    monthFormatted: formatISODateToMesAnio(item.month),
    status: isClosed(item.closingDate),
  }));
  const totalMatriculacionConfig = useSelector(
    (state) => state.selloutDatos.totalMatriculacionConfig || 0
  );
  const [openMatriculacion, setOpenMatriculacion] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitGeneral);
  const [edit, setEdit] = useState(false);
  const paramsValidate = ["description", "closingDate", "month", "startDate"];
  const [loading, setLoading] = useState(false);
  const [matricula, setMatricula] = useState({
    description: "",
    closingDate: "",
    month: "",
    startDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const debounceSearchMatriculacion = useCallback(
    debounce((value) => {
      buscarMatriculacion(value, page, limit);
    }, 1000),
    []
  );

  const buscarMatriculacion = async (value, page, limit) => {
    setLoading(true);
    try {
      await dispatch(
        obtenerMatriculacionConfig({ search: value, page, limit })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarMatriculacion(search, page, limit);
  }, [page, limit]);

  const handleSubmit = async () => {
    if (matricula.id) {
      editMatriculacion();
    } else {
      crearMatriculacion();
    }
  };

  const editMatriculacion = async () => {
    const data = {
      id: matricula.id,
      closingDate: matricula.closingDate,
      description: matricula.description,
      month: matricula.month,
      startDate: matricula.startDate,
    };
    const response = await dispatch(updateMatriculacionConfig(data));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message, { severity: "success" });
      buscarMatriculacion();
      handleCloseMatriculacion();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const crearMatriculacion = async () => {
    const response = await dispatch(createMatriculacionConfig(matricula));
    if (response.meta.requestStatus === "fulfilled") {
      showSnackbar(response.payload.message, { severity: "success" });
      handleCloseMatriculacion();
      buscarMatriculacion();
    } else {
      showSnackbar(response.payload.message, { severity: "error" });
    }
  };

  const handleOpenMatriculacion = () => {
    setOpenMatriculacion(true);
  };

  const actions = [
    {
      label: "Editar",
      color: "info",
      onClick: (row) => handleEditMatriculacion(row),
      visible: (row) => {
        if (isAdmin) return true;
        const esEstadoCerrado = row.status?.includes("Cerrado");
        return !esEstadoCerrado;
      },
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => handleDeleteMatriculacion(row),
      visible: (row) => {
        if (isAdmin) return true;
        const esEstadoCerrado = row.status?.includes("Cerrado");
        return !esEstadoCerrado;
      },
    },
  ];

  const handleCloseMatriculacion = () => {
    setOpenMatriculacion(false);
    setMatricula({
      description: "",
      closingDate: "",
      month: "",
      startDate: "",
    });
    setErrors({});
    setEdit(false);
  };

  const handleDeleteMatriculacion = (row) => {
    showDialog({
      title: "Eliminar Matriculacion",
      message: "¿Estás seguro de que deseas eliminar esta matriculacion?",
      onConfirm: async () => {
        try {
          const response = await dispatch(deleteMatriculacionConfig(row.id));
          if (response.meta.requestStatus === "fulfilled") {
            showSnackbar(response.payload.message, { severity: "success" });
            buscarMatriculacion();
          } else {
            showSnackbar(response.payload.message, { severity: "error" });
          }
        } catch (error) {
          showSnackbar(error || "Error al eliminar la matriculacion");
        }
      },
      onCancel: () => { },
    });
  };

  const handleEditMatriculacion = (row) => {
    setMatricula(row);
    setEdit(true);
    setOpenMatriculacion(true);
  };

  return (
    <>
      <AtomContainerGeneral
        children={
          <>
            <AtomCard
              title=""
              nameButton={namePermission ? "Crear" : ""}
              border={true}
              onClick={handleOpenMatriculacion}
              labelBuscador="Búsqueda por descripción y mes de cálculo"
              placeholder="Buscar por descripción y mes de cálculo"
              search={true}
              valueSearch={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                debounceSearchMatriculacion(e.target.value);
              }}
              children={
                <>
                  <AtomTableForm
                    columns={columns}
                    data={dataMatriculacionConfig}
                    actions={namePermission ? actions : []}
                    pagination={true}
                    page={page}
                    limit={limit}
                    count={totalMatriculacionConfig}
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
        openDialog={openMatriculacion}
        titleCrear="Crear Configuración de Cierre"
        editDialog={edit}
        buttonCancel={true}
        maxWidth="md"
        buttonSubmit={true}
        handleSubmit={handleSubmit}
        handleCloseDialog={handleCloseMatriculacion}
        titleEditar="Editar Configuración de Cierre"
        dialogContentComponent={
          <Grid container spacing={2} sx={{ width: "90%" }}>
            <Grid size={6}>
              <AtomDatePicker
                id="month"
                required={true}
                mode="month"
                label="Mes de cálculo"
                disabled={edit}
                value={matricula?.month || null}
                onChange={(e) => {
                  const mesCierre = sumarUnMes(e);
                  setMatricula({
                    ...matricula,
                    month: e,
                    startDate: mesCierre,
                    closingDate: sumarCierre(e),
                  });
                }}
                error={errors.month}
                helperText={
                  errors.month ? "El mes de cálculo es requerido" : ""
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomDatePicker
                id="startDate"
                required={true}
                mode="date"
                label="Fecha de inicio"
                value={matricula?.startDate || null}
                onChange={(e) =>
                  setMatricula({
                    ...matricula,
                    startDate: e,
                  })
                }
                error={errors.startDate}
                helperText={
                  errors.startDate ? "La fecha de inicio es requerida" : ""
                }
              />
            </Grid>
            <Grid size={6}>
              <AtomDatePicker
                id="closingDate"
                required={true}
                label="Fecha de cierre"
                value={matricula?.closingDate || null}
                onChange={(e) => setMatricula({ ...matricula, closingDate: e })}
                error={errors.closingDate}
                helperText={
                  errors.closingDate ? "La fecha de cierre es requerida" : ""
                }
              />
            </Grid>
          </Grid>
        }
      />
    </>
  );
};

export default ConfiguracionMatriculacion;
