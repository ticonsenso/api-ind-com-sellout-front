import { useState, useEffect } from "react";
import AtomCard from "../../../atoms/AtomCard";
import AtomTableForm from "../../../atoms/AtomTableForm";
import AtomDialogForm from "../../../atoms/AtomDialogForm";
import CrearConfiguracionExtraccion from "./crearConfigExtraccion";
import { useDispatch, useSelector } from "react-redux";
import {
  obtenerExtractionsConfig,
  deleteExtractionsConfig,
  setConfiguracionSeleccionada,
  setDataColumnsSearch,
} from "../../../redux/configSelloutSlice";
import { columnsConfiguracion } from "../constantes";
import { useDialog } from "../../../context/DialogDeleteContext";
import { useSnackbar } from "../../../context/SnacbarContext";
import AtomCircularProgress from "../../../atoms/AtomCircularProgress";
import { usePermission } from "../../../context/PermisosComtext";

const ConfiguracionExtraccion = () => {
  const hasPermission = usePermission();
  const namePermission = hasPermission("ACCIONES CONFIGURACION EXTRACCION");
  const { showDialog } = useDialog();
  const { showSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const totalExtracciones = useSelector(
    (state) => state?.configSellout?.totalExtracciones || 0
  );
  const [openDialogCrear, setOpenDialogCrear] = useState(false);
  const [configuracion, setConfiguracion] = useState(null);
  const configuracionesExtraidas = useSelector(
    (state) => state?.configSellout?.configExtracciones || []
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value));
    setPage(1);
  };

  const handleCloseDialogCrear = () => {
    setOpenDialogCrear(false);
    buscarConfiguraciones();
    setConfiguracion(null);
    dispatch(setConfiguracionSeleccionada(null));
    dispatch(setDataColumnsSearch(null));
  };

  const handleSubmit = () => {
    setOpenDialogCrear(false);
  };

  const handleEdit = async (row) => {
    setConfiguracion(row);
    dispatch(setConfiguracionSeleccionada(row.id));
    setOpenDialogCrear(true);
  };

  const handleDelete = (row) => {
    showDialog({
      title: "Eliminar Configuración",
      message: "¿Estás seguro de que deseas eliminar esta configuración?",
      onConfirm: async () => {
        const response = await dispatch(deleteExtractionsConfig(row.id));
        if (response.meta.requestStatus === "fulfilled") {
          showSnackbar(response.payload.message);
          buscarConfiguraciones();
        } else {
          showSnackbar(response.payload.message);
        }
      },
      onCancel: () => { },
    });
  };

  const actions = [
    {
      label: "Editar",
      color: "info",
      onClick: (row) => {
        handleEdit(row);
      },
    },
    {
      label: "Eliminar",
      color: "error",
      onClick: (row) => {
        handleDelete(row);
      },
    },
  ];

  const buscarConfiguraciones = async () => {
    setLoading(true);
    try {
      await dispatch(obtenerExtractionsConfig({ page, limit, search }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarConfiguraciones();
  }, [page, limit, search]);

  return (
    <AtomCard
      nameButton={namePermission ? "Crear" : ""}
      valueSearch={search}
      onChange={(e) => setSearch(e.target.value)}
      search={true}
      onClick={() => setOpenDialogCrear(true)}
      children={
        <>
          {loading ? (
            <AtomCircularProgress />
          ) : (
            <AtomTableForm
              columns={columnsConfiguracion}
              data={configuracionesExtraidas}
              actions={namePermission ? actions : []}
              pagination={true}
              page={page}
              limit={limit}
              setPage={setPage}
              setLimit={setLimit}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              count={totalExtracciones}
            />
          )}
          <AtomDialogForm
            maxWidth="xl"
            closeButton={true}
            openDialog={openDialogCrear}
            buttonCancel={true}
            textButtonCancel="Configuración terminada"
            handleCloseDialog={handleCloseDialogCrear}
            handleSubmit={handleSubmit}
            titleCrear="Crear configuracion de extracción sellout"
            dialogContentComponent={
              <CrearConfiguracionExtraccion config={configuracion} />
            }
          />
        </>
      }
    />
  );
};

export default ConfiguracionExtraccion;
