import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  params: [],
  optionsParams: [],
  configuracionesExtraidas: [],
  configuracionExtraccionId: null,
  optionsConfiguracion: [],
  totalExtracciones: 0,
  optionsTablaEnvio: [],
};

//configuraciones
export const obtenerConfiguraciones = createAsyncThunk(
  "configuraciones/obtenerConfiguraciones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extraccionConfigUrl.url + "/search")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const crearConfiguracion = createAsyncThunk(
  "configuraciones/crearConfiguracion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extraccionConfigUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editarConfiguracion = createAsyncThunk(
  "configuraciones/editarConfiguracion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataSinId } = data;
    try {
      return await apiService
        .setUrl(apiConfig.extraccionConfigUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataSinId)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteConfiguracionExtraccion = createAsyncThunk(
  "configuraciones/eliminarConfiguracionExtraccion",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extraccionConfigUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//parametros
export const obtenerColumnas = createAsyncThunk(
  "columnas/obtenerColumnas",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const idSource = state.extraccion.configuracionExtraccionId || id;
    try {
      return await apiService
        .setUrl(apiConfig.columnasUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: 0, limit: 50 })
        .setData({ dataSourceId: idSource })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const crearColumna = createAsyncThunk(
  "columnas/crearColumna",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnasUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editarColumna = createAsyncThunk(
  "columnas/editarColumna",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataSinId } = data;

    try {
      return await apiService
        .setUrl(`${apiConfig.columnasUrl.url}/${id}`)
        .setMethod("PUT")
        .setData(dataSinId)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const eliminarColumna = createAsyncThunk(
  "columnas/eliminarColumna",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnasUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//guardar extraccion
export const guardarExtraccion = createAsyncThunk(
  "extraccion/guardarExtraccion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.guardarExtraccionUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//eliminar clientes/datos cargados
export const deleteClientesCargados = createAsyncThunk(
  "extraccion/deleteClientesCargados",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.sendSelloutUrl.url + "/deleteall")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//tabla envio
export const obtenerTablaEnvio = createAsyncThunk(
  "tablaEnvio/obtenerTablaEnvio",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.tablaEnvioUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(crearConfiguracion.fulfilled, (state, action) => {
      if (action.payload) {
        state.configuracionExtraccionId = action.payload.dataSource.id;
      } else {
        state.configuracionExtraccionId = null;
      }
    })
    .addCase(crearConfiguracion.rejected, (state, action) => {
      state.configuracionExtraccionId = null;
    })
    .addCase(obtenerConfiguraciones.fulfilled, (state, action) => {
      if (action.payload) {
        state.configuracionesExtraidas = action.payload.dataSources;
        state.totalExtracciones = action.payload.total;
        state.optionsConfiguracion = action.payload.dataSources.map(
          (configuracion) => ({
            label: configuracion.description,
            id: configuracion.id,
            sheetName: configuracion.sheetName,
            companyId: configuracion.companyId,
          })
        );
      } else {
        state.configuracionesExtraidas = [];
        state.totalExtracciones = 0;
        state.optionsConfiguracion = [];
      }
    })
    .addCase(obtenerConfiguraciones.rejected, (state, action) => {
      state.configuracionesExtraidas = [];
      state.totalExtracciones = 0;
      state.optionsConfiguracion = [];
    })
    .addCase(obtenerColumnas.fulfilled, (state, action) => {
      if (action.payload) {
        state.params = action.payload.items;
      } else {
        state.params = [];
      }
    })
    .addCase(obtenerColumnas.rejected, (state, action) => {
      state.params = [];
    })
    .addCase(obtenerTablaEnvio.fulfilled, (state, action) => {
      if (action.payload) {
        state.optionsTablaEnvio = action.payload.items.map((item) => ({
          label: item.description,
          id: item.name.toLowerCase().replace(/\s+/g, ""),
        }));
      } else {
        state.optionsTablaEnvio = [];
      }
    })
    .addCase(obtenerTablaEnvio.rejected, (state, action) => {
      state.optionsTablaEnvio = [];
    });
};

const extraccionSlice = createSlice({
  name: "extraccion",
  initialState,
  reducers: {
    setConfiguracionExtraccionId: (state, action) => {
      if (action.payload) {
        state.configuracionExtraccionId = action.payload;
      } else {
        state.configuracionExtraccionId = null;
      }
    },
    clearData: (state) => {
      state.configuracionExtraccionId = null;
      state.params = [];
    },
  },
  extraReducers,
});

export const { setConfiguracionExtraccionId, clearData } =
  extraccionSlice.actions;
export default extraccionSlice.reducer;
