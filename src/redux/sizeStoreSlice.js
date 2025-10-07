import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  sizeStores: [],
  totalSizeStores: 0,
  idSizeStore: null,
  calculoComisionesMarcimex: [],
  totalCalculoComisionesMarcimex: 0,
  presupuestoTienda: [],
  totalPresupuestoTienda: 0,
  tiendasAgrupacion: [],
  tiendasAsignadas: [],
  asesoresAsignados: [],
  storeManager: [],
  totalStoreManager: 0,
};

export const obtenerCalculoComisionesMarcimex = createAsyncThunk(
  "sizeStore/obtenerCalculoComisionesMarcimex",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.calculoComisionesMarcimexUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerStoreManagerMarcimex = createAsyncThunk(
  "sizeStore/obtenerStoreManagerMarcimex",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storeManagerUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerSizeStores = createAsyncThunk(
  "sizeStore/obtenerSizeStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionTiendaUrl.url + "-search")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerTiendasAgrupacionConfiguracion = createAsyncThunk(
  "sizeStore/obtenerTiendasAgrupacionConfiguracion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionTiendaUrl.url + "-search")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSizeStore = createAsyncThunk(
  "sizeStore/createSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionTiendaUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMonthSizeStore = createAsyncThunk(
  "sizeStore/createMonthSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.monthSizeStoreUrl.url + "-multiple")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSizeStore = createAsyncThunk(
  "sizeStore/updateSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionTiendaUrl.url)
        .setMethod("PUT")
        .setParams({ id })
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSizeStore = createAsyncThunk(
  "sizeStore/deleteSizeStore",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionTiendaUrl.url)
        .setMethod("DELETE")
        .setParams({ id })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const guardarSizeStore = createAsyncThunk(
  "sizeStore/guardarSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.guardarSizeStoreUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerPresupuestoTienda = createAsyncThunk(
  "sizeStore/obtenerPresupuestoTienda",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.presupuestoTiendaUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMonthSizeStore = createAsyncThunk(
  "sizeStore/updateMonthSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.monthSizeStoreUrl.url)
        .setMethod("PUT")
        .setParams({ id })
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerMonthSizeStore = createAsyncThunk(
  "sizeStore/obtenerMonthSizeStore",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.monthSizeStoreUrl.url + "-by-store-configuration-id")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asignarTiendaAgrupacion = createAsyncThunk(
  "sizeStore/asignarTiendaAgrupacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparTiendaUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTiendaAgrupacion = createAsyncThunk(
  "sizeStore/deleteTiendaAgrupacion",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparTiendaUrl.url)
        .setMethod("DELETE")
        .setParams(id)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asignarAsesorAgrupacion = createAsyncThunk(
  "sizeStore/asignarAsesorAgrupacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparAsesorUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAsesorAsign = createAsyncThunk(
  "sizeStore/deleteAsesorAsign",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparAsesorUrl.url)
        .setMethod("DELETE")
        .setParams(id)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerTiendasAsignadas = createAsyncThunk(
  "sizeStore/obtenerTiendasAsignadas",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparTiendaUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerAsesoresAsignados = createAsyncThunk(
  "sizeStore/obtenerAsesoresAsignados",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.agruparAsesorUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerSizeStores.fulfilled, (state, action) => {
      if (action.payload) {
        state.sizeStores = action.payload.items;
        state.totalSizeStores = action.payload.total;
      } else {
        state.sizeStores = [];
        state.totalSizeStores = 0;
      }
    })
    .addCase(obtenerSizeStores.rejected, (state, action) => {
      state.sizeStores = [];
      state.totalSizeStores = 0;
    })
    .addCase(createSizeStore.fulfilled, (state, action) => {
      if (action.payload) {
        state.idSizeStore = action.payload.id;
      } else {
        state.idSizeStore = null;
      }
    })
    .addCase(createSizeStore.rejected, (state, action) => {
      state.idSizeStore = null;
    })
    .addCase(obtenerCalculoComisionesMarcimex.fulfilled, (state, action) => {
      if (action.payload) {
        state.calculoComisionesMarcimex = action.payload.items;
        state.totalCalculoComisionesMarcimex = action.payload.total;
      } else {
        state.calculoComisionesMarcimex = [];
        state.totalCalculoComisionesMarcimex = 0;
      }
    })
    .addCase(obtenerCalculoComisionesMarcimex.rejected, (state, action) => {
      state.calculoComisionesMarcimex = [];
      state.totalCalculoComisionesMarcimex = 0;
    })
    .addCase(obtenerPresupuestoTienda.fulfilled, (state, action) => {
      if (action.payload) {
        state.presupuestoTienda = action.payload.items;
        state.totalPresupuestoTienda = action.payload.total;
      } else {
        state.presupuestoTienda = [];
        state.totalPresupuestoTienda = 0;
      }
    })
    .addCase(obtenerPresupuestoTienda.rejected, (state, action) => {
      state.presupuestoTienda = [];
      state.totalPresupuestoTienda = 0;
    })
    .addCase(
      obtenerTiendasAgrupacionConfiguracion.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.tiendasAgrupacion =
            action?.payload?.items?.map((item) => ({
              id: item.id,
              label: item.storeName,
            })) || [];
        } else {
          state.tiendasAgrupacion = [];
        }
      }
    )
    .addCase(
      obtenerTiendasAgrupacionConfiguracion.rejected,
      (state, action) => {
        state.tiendasAgrupacion = [];
      }
    )
    .addCase(obtenerTiendasAsignadas.fulfilled, (state, action) => {
      if (action.payload) {
        state.tiendasAsignadas = action.payload.storeSecondaries;
      } else {
        state.tiendasAsignadas = [];
      }
    })
    .addCase(obtenerTiendasAsignadas.rejected, (state, action) => {
      state.tiendasAsignadas = [];
    })
    .addCase(obtenerAsesoresAsignados.fulfilled, (state, action) => {
      if (action.payload) {
        state.asesoresAsignados = action.payload.storeSecondaries;
      } else {
        state.asesoresAsignados = [];
      }
    })
    .addCase(obtenerAsesoresAsignados.rejected, (state, action) => {
      state.asesoresAsignados = [];
    })
    .addCase(obtenerStoreManagerMarcimex.fulfilled, (state, action) => {
      if (action.payload) {
        state.storeManager = action.payload.items;
        state.totalStoreManager = action.payload.total;
      } else {
        state.asesoresAsignados = [];
        state.totalStoreManager = 0;
      }
    })
    .addCase(obtenerStoreManagerMarcimex.rejected, (state, action) => {
      state.storeManager = [];
      state.totalStoreManager = 0;
    });
};

const sizeStoreSlice = createSlice({
  name: "sizeStore",
  initialState,
  reducers: {
    setIdSizeStore: (state, action) => {
      state.idSizeStore = action.payload;
    },
  },
  extraReducers,
});

export const { setIdSizeStore } = sizeStoreSlice.actions;

export default sizeStoreSlice.reducer;
