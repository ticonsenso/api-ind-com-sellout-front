import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  empresas: [],
  cargos: [],
  optionsEmpresas: [],
  categorias: [],
  optionsCategorias: [],
  idEmpresaSeleccionada: null,
  optionsCargosEmpresa: [],
  empresaSeleccionada: {},
  totalEmpresas: 0,
  totalCargos: 0,
  tamanosTienda: [],
  totalTamanosTienda: 0,
  optionsTamanosTienda: [],
};

const setEmpresaObject = (state, action) => {
  if (action.payload.key) {
    const { key, value } = action.payload;
    state.empresa[key] = value;
  } else {
    state.empresa = {};
  }
};

export const createEmpresa = createAsyncThunk(
  "empresas/createEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.empresasUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateEmpresa = createAsyncThunk(
  "empresa/updateEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const dataFinal = {
      name: data.name,
      description: data.description,
    };
    try {
      return await apiService
        .setUrl(apiConfig.empresasUrl.url + "/" + data.id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteEmpresa = createAsyncThunk(
  "empresa/deleteEmpresa",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.empresasUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerEmpresas = createAsyncThunk(
  "empresas/obtenerEmpresas",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.empresasUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit })
        .setData({ name: data.search })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerOptionsEmpresas = createAsyncThunk(
  "empresas/obtenerOptionsEmpresas",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.empresasUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//cargos de la empresa
export const obtenerCargosEmpresa = createAsyncThunk(
  "cargos/obtenerCargosEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.cargosEmpresaUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit })
        .setData({ name: data.search, companyId: data.companyId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerTodosCargosEmpresa = createAsyncThunk(
  "cargos/obtenerTodosCargosEmpresa",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const companyId = state.empresa?.idEmpresaSeleccionada || null;
    try {
      return await apiService
        .setUrl(apiConfig.cargosEmpresaUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({ companyId: companyId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCargoEmpresa = createAsyncThunk(
  "cargos/updateCargoEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const dataFinal = {
      name: data.name,
      description: data.description,
      salaryBase: data.salaryBase,
      isStoreSize: data.isStoreSize,
    };
    try {
      return await apiService
        .setUrl(apiConfig.cargosEmpresaUrl.url + "/" + data.id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCargoEmpresa = createAsyncThunk(
  "cargos/createCargoEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.cargosEmpresaUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCargoEmpresa = createAsyncThunk(
  "cargos/deleteCargoEmpresa",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.cargosEmpresaUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//configuracion de la empresa
export const obtenerTamanosTiendaEmpresa = createAsyncThunk(
  "configuracion/obtenerTamanosTiendaEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storeSizeUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page || null, limit: data.limit || null })
        .setData({ companyId: data.companyId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTamanosTiendaEmpresa = createAsyncThunk(
  "configuracion/createTamanosTiendaEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storeSizeUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTamanosTiendaEmpresa = createAsyncThunk(
  "configuracion/updateTamanosTiendaEmpresa",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.storeSizeUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTamanosTiendaEmpresa = createAsyncThunk(
  "configuracion/deleteTamanosTiendaEmpresa",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storeSizeUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerEmpresas.fulfilled, (state, action) => {
      if (action.payload.items.length > 0) {
        state.empresas = action.payload.items;
        state.totalEmpresas = action.payload.total;
      } else {
        state.empresas = [];
        state.totalEmpresas = 0;
      }
    })
    .addCase(obtenerEmpresas.rejected, (state, action) => {
      state.empresas = [];
      state.totalEmpresas = 0;
    })
    .addCase(obtenerCargosEmpresa.fulfilled, (state, action) => {
      if (action.payload) {
        state.cargos = action.payload.items;
        state.totalCargos = action.payload.total;
      } else {
        state.cargos = [];
        state.totalCargos = 0;
      }
    })
    .addCase(obtenerCargosEmpresa.rejected, (state, action) => {
      state.cargos = [];
      state.totalCargos = 0;
    })
    .addCase(obtenerOptionsEmpresas.fulfilled, (state, action) => {
      if (action.payload) {
        state.optionsEmpresas = action.payload.items.map((empresa) => ({
          id: empresa.id,
          label: empresa.name,
        }));
      } else {
        state.optionsEmpresas = [];
      }
    })
    .addCase(obtenerOptionsEmpresas.rejected, (state, action) => {
      state.optionsEmpresas = [];
    })
    .addCase(obtenerTodosCargosEmpresa.fulfilled, (state, action) => {
      if (action.payload) {
        state.cargos = action.payload.items;
        state.optionsCargosEmpresa = action.payload.items.map((cargo) => ({
          id: cargo.id,
          label: cargo.name,
        }));
      } else {
        state.cargos = [];
        state.optionsCargosEmpresa = [];
      }
    })
    .addCase(obtenerTamanosTiendaEmpresa.fulfilled, (state, action) => {
      if (action.payload) {
        state.tamanosTienda = action.payload.items;
        state.totalTamanosTienda = action.payload.total;
        state.optionsTamanosTienda = action.payload.items.map(
          (tamanosTienda) => ({
            id: tamanosTienda.id,
            label: tamanosTienda.name,
          })
        );
      } else {
        state.tamanosTienda = [];
        state.totalTamanosTienda = 0;
        state.optionsTamanosTienda = [];
      }
    })
    .addCase(obtenerTamanosTiendaEmpresa.rejected, (state, action) => {
      state.tamanosTienda = [];
      state.totalTamanosTienda = 0;
      state.optionsTamanosTienda = [];
    });
};

const empresasSlice = createSlice({
  name: "empresas",
  initialState,
  reducers: {
    updateEmpresaObject: setEmpresaObject,
    setIdEmpresaSeleccionada: (state, action) => {
      if (action.payload) {
        state.idEmpresaSeleccionada = action.payload;
        state.empresaSeleccionada = state.optionsEmpresas.find(
          (empresa) => empresa.id === action.payload
        );
      } else {
        state.idEmpresaSeleccionada = null;
        state.empresaSeleccionada = {};
      }
    },
  },
  extraReducers,
});

export const { updateEmpresaObject, setIdEmpresaSeleccionada } =
  empresasSlice.actions;

export default empresasSlice.reducer;
