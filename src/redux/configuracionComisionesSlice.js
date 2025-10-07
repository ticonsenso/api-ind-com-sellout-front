import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  initialStep: 0,
  configuraciones: [],
  optionsConfiguraciones: [],
  categorias: [],
  optionsCategorias: [],
  parametros: [],
  optionsParametros: [],
  versiones: [],
  optionsVersiones: [],
  reglasComision: [],
  lineasProductos: [],
  escalas: [],
  optionsEscalas: [],
  lineasParametros: [],
  configuracionId: null,
  kpiConfig: [],
  totalLineasParametros: 0,
  totalParametros: 0,
  totalVersiones: 0,
  totalCategorias: 0,
  totalConfiguraciones: 0,
  totalReglasComision: 0,
  rotacionComisiones: [],
  totalRotacionComisiones: 0,
};

//configuraciones
export const obtenerConfiguracionesComisiones = createAsyncThunk(
  "configuraciones/obtenerConfiguracionesComisiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      return await apiService
        .setUrl(apiConfig.configuracionesComisionesUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit })
        .setData({ name: data.search, companyId: data.companyId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createConfiguracion = createAsyncThunk(
  "configuraciones/createConfiguracion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionesComisionesUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateConfiguracion = createAsyncThunk(
  "configuraciones/updateConfiguracion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionesComisionesUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteConfiguracion = createAsyncThunk(
  "configuraciones/deleteConfiguracion",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionesComisionesUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//categorias
export const obtenerTodasCategorias = createAsyncThunk(
  "categorias/obtenerTodasCategorias",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.categoriasUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerCategorias = createAsyncThunk(
  "categorias/obtenerCategorias",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.categoriasUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit })
        .setData({ name: data.search })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createCategoria = createAsyncThunk(
  "categorias/createCategoria",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.categoriasUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCategoria = createAsyncThunk(
  "categorias/updateCategoria",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.categoriasUrl.url + "/" + data.id)
        .setMethod("PUT")
        .setData({ name: data.name, description: data.description })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCategoria = createAsyncThunk(
  "categorias/deleteCategoria",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.categoriasUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//parametros
export const obtenerParametros = createAsyncThunk(
  "configuracionComisiones/obtenerParametros",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId;
    const dataFinal = {
      commissionConfigurationId: configuracionId,
    };
    try {
      return await apiService
        .setUrl(apiConfig.parametrosUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit })
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createParametro = createAsyncThunk(
  "parametros/createParametro",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.parametrosUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateParametro = createAsyncThunk(
  "parametros/updateParametro",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.parametrosUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteParametro = createAsyncThunk(
  "parametros/deleteParametro",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.parametrosUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//versiones

export const obtenerTodasVersiones = createAsyncThunk(
  "versiones/obtenerTodasVersiones",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.versionesUrl.url + "/search")
        .setParams({})
        .setData({})
        .setMethod("POST")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerVersiones = createAsyncThunk(
  "versiones/obtenerVersiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { page, limit, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.versionesUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: page, limit: limit } || {})
        .setData(dataFinal || {})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createVersion = createAsyncThunk(
  "versiones/createVersion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.versionesUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateVersion = createAsyncThunk(
  "versiones/updateVersion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const dataFinal = {
      version: data.version,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
      configurationId: data.configurationId,
    };
    try {
      return await apiService
        .setUrl(apiConfig.versionesUrl.url + "/" + data.id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteVersion = createAsyncThunk(
  "versiones/deleteVersion",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.versionesUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//reglas

export const obtenerReglas = createAsyncThunk(
  "configuracionComisiones/obtenerReglas",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId;
    const { page, limit } = data;
    try {
      return await apiService
        .setUrl(apiConfig.reglasComisionesUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page, limit })
        .setData({ commissionConfigurationId: configuracionId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createRegla = createAsyncThunk(
  "reglas/createRegla",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.reglasComisionesUrl.url + "/batch")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateRegla = createAsyncThunk(
  "configuracionComisiones/updateRegla",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.reglasComisionesUrl.url + "/batch")
        .setMethod("PUT")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteRegla = createAsyncThunk(
  "reglas/deleteRegla",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.reglasComisionesUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//lineas productos

export const obtenerLineasProductos = createAsyncThunk(
  "configuracionComisiones/obtenerLineasProductos",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId;
    try {
      return await apiService
        .setUrl(apiConfig.lineasProductosUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({ commissionConfigurationId: configuracionId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLineaProducto = createAsyncThunk(
  "configuracionComisiones/createLineaProducto",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.lineasProductosUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLineaProducto = createAsyncThunk(
  "lineasProductos/updateLineaProducto",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.lineasProductosUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLineaProducto = createAsyncThunk(
  "lineasProductos/deleteLineaProducto",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.lineasProductosUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//escalas

export const obtenerEscalas = createAsyncThunk(
  "configuracionComisiones/obtenerEscalas",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId || 0;
    try {
      return await apiService
        .setUrl(apiConfig.escalasUrl.url + "/search")
        .setMethod("POST")
        .setData({ commissionConfigurationId: configuracionId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createEscala = createAsyncThunk(
  "escalas/createEscala",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.escalasUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateEscala = createAsyncThunk(
  "escalas/updateEscala",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.escalasUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteEscala = createAsyncThunk(
  "escalas/deleteEscala",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.escalasUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//lineas parametros
export const obtenerLineasParametros = createAsyncThunk(
  "configuracionComisiones/obtenerLineasParametros",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const body = data.search
      ? {
          name: data.search,
        }
      : {};
    try {
      return await apiService
        .setUrl(apiConfig.lineasParametrosUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page: data.page, limit: data.limit } || {})
        .setData(body || {})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLineaParametro = createAsyncThunk(
  "lineasParametros/createLineaParametro",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.lineasParametrosUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLineaParametro = createAsyncThunk(
  "lineasParametros/updateLineaParametro",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const dataFinal = {
      name: data.name,
      description: data.description,
      groupProductLine: data.groupProductLine,
    };
    try {
      return await apiService
        .setUrl(apiConfig.lineasParametrosUrl.url + "/" + data.id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLineaParametro = createAsyncThunk(
  "lineasParametros/deleteLineaParametro",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.lineasParametrosUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//kpi config
export const obtenerKpiConfig = createAsyncThunk(
  "configuracionComisiones/obtenerKpiConfig",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId;
    try {
      return await apiService
        .setUrl(apiConfig.kpiConfigUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({ commissionConfigurationId: configuracionId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createKpiConfig = createAsyncThunk(
  "kpiConfig/createKpiConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.kpiConfigUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateKpiConfig = createAsyncThunk(
  "kpiConfig/updateKpiConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.kpiConfigUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMonthKpiConfig = createAsyncThunk(
  "kpiConfig/updateMonthKpiConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url + "/configurations")
        .setMethod("PUT")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteKpiConfig = createAsyncThunk(
  "kpiConfig/deleteKpiConfig",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.kpiConfigUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//ROTACION DE VENTA

export const obtenerRotacionComisiones = createAsyncThunk(
  "configuracionComisiones/obtenerRotacionComisiones",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const configuracionId = state.configuracionComisiones.configuracionId;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url + "/search")
        .setMethod("POST")
        .setParams({})
        .setData({ commissionConfigurationId: configuracionId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createRotacionComisiones = createAsyncThunk(
  "rotacionComisiones/createRotacionComisiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createRotacionComisionesArray = createAsyncThunk(
  "rotacionComisiones/createRotacionComisionesArray",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url + "/configurations")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateRotacionComisiones = createAsyncThunk(
  "rotacionComisiones/updateRotacionComisiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...dataFinal } = data;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(dataFinal)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteRotacionComisiones = createAsyncThunk(
  "rotacionComisiones/deleteRotacionComisiones",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.rotacionComisionesUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerCategorias.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.categorias = action.payload.items;
        state.totalCategorias = action.payload.total;
      } else {
        state.categorias = [];
        state.totalCategorias = 0;
      }
    })
    .addCase(obtenerCategorias.rejected, (state, action) => {
      state.categorias = [];
      state.totalCategorias = 0;
    })
    .addCase(obtenerKpiConfig.fulfilled, (state, action) => {
      if (action.payload) {
        state.kpiConfig = action.payload.data;
        state.totalKpiConfig = action.payload.total;
      } else {
        state.kpiConfig = [];
        state.totalKpiConfig = 0;
      }
    })
    .addCase(obtenerKpiConfig.rejected, (state, action) => {
      state.kpiConfig = [];
      state.totalKpiConfig = 0;
    })
    .addCase(createConfiguracion.fulfilled, (state, action) => {
      if (action.payload) {
        state.configuracionId = action.payload.commissionConfiguration.id;
      } else {
        state.configuracionId = null;
      }
    })
    .addCase(createConfiguracion.rejected, (state, action) => {
      state.configuracionId = null;
    })
    .addCase(obtenerConfiguracionesComisiones.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.configuraciones = action.payload.items;
        state.totalConfiguraciones = action.payload.total;
      } else {
        state.configuraciones = [];
        state.totalConfiguraciones = 0;
      }
    })
    .addCase(obtenerConfiguracionesComisiones.rejected, (state, action) => {
      state.configuraciones = [];
      state.totalConfiguraciones = 0;
    })
    .addCase(obtenerVersiones.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.versiones = action.payload.items;
        state.totalVersiones = action.payload.total;
        state.optionsVersiones = action.payload.items.map((item) => ({
          label: item.version,
          id: item.id,
        }));
      } else {
        state.versiones = [];
        state.totalVersiones = 0;
        state.optionsVersiones = [];
      }
    })
    .addCase(obtenerVersiones.rejected, (state, action) => {
      state.versiones = [];
      state.totalVersiones = 0;
      state.optionsVersiones = [];
    })
    .addCase(obtenerTodasVersiones.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.optionsVersiones = action.payload.items.map((item) => ({
          label: item.version,
          id: item.id,
        }));
      } else {
        state.optionsVersiones = [];
      }
    })
    .addCase(obtenerTodasVersiones.rejected, (state, action) => {
      state.optionsVersiones = [];
    })
    .addCase(obtenerTodasCategorias.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.optionsCategorias = action.payload.items.map((item) => ({
          label: item.name,
          id: item.id,
        }));
      } else {
        state.optionsCategorias = [];
      }
    })
    .addCase(obtenerTodasCategorias.rejected, (state, action) => {
      state.optionsCategorias = [];
    })
    .addCase(obtenerParametros.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.parametros = action.payload.items;
        state.totalParametros = action.payload.total;
      } else {
        state.parametros = [];
        state.totalParametros = 0;
      }
    })
    .addCase(obtenerParametros.rejected, (state, action) => {
      state.parametros = [];
      state.totalParametros = 0;
    })
    .addCase(obtenerReglas.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.reglasComision = action.payload.items;
        state.totalReglasComision = action.payload.total;
      } else {
        state.reglasComision = [];
        state.totalReglasComision = 0;
      }
    })
    .addCase(obtenerReglas.rejected, (state, action) => {
      state.reglasComision = [];
      state.totalReglasComision = 0;
    })
    .addCase(obtenerLineasProductos.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.lineasProductos = action.payload.items;
        state.totalLineasProductos = action.payload.total;
      } else {
        state.lineasProductos = [];
        state.totalLineasProductos = 0;
      }
    })
    .addCase(obtenerLineasProductos.rejected, (state, action) => {
      state.lineasProductos = [];
      state.totalLineasProductos = 0;
    })
    .addCase(obtenerEscalas.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.escalas = action.payload.items;
        state.totalEscalas = action.payload.total;
      } else {
        state.escalas = [];
        state.totalEscalas = 0;
      }
    })
    .addCase(obtenerEscalas.rejected, (state, action) => {
      state.escalas = [];
      state.totalEscalas = 0;
    })
    .addCase(obtenerLineasParametros.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.lineasParametros = action.payload.items;
        state.totalLineasParametros = action.payload.total;
        state.optionsLineasParametros = action.payload.items.map((item) => ({
          id: item.id,
          label: item.name,
        }));
      } else {
        state.lineasParametros = [];
        state.optionsLineasParametros = [];
        state.totalLineasParametros = 0;
      }
    })
    .addCase(obtenerLineasParametros.rejected, (state, action) => {
      state.lineasParametros = [];
      state.optionsLineasParametros = [];
      state.totalLineasParametros = 0;
    })
    .addCase(obtenerRotacionComisiones.fulfilled, (state, action) => {
      if (action.payload.items) {
        state.rotacionComisiones = action.payload.items;
        // state.totalRotacionComisiones = action.payload.total;
      } else {
        state.rotacionComisiones = [];
        // state.totalRotacionComisiones = 0;
      }
    })
    .addCase(obtenerRotacionComisiones.rejected, (state, action) => {
      state.rotacionComisiones = [];
      // state.totalRotacionComisiones = 0;
    });
};

const configuracionComisionesSlice = createSlice({
  name: "configuracionComisiones",
  initialState,
  reducers: {
    setInitialStep: (state, action) => {
      if (action.payload) {
        state.initialStep = action.payload;
      } else {
        state.initialStep = 0;
      }
    },
    setConfiguracionId: (state, action) => {
      if (action.payload) {
        state.configuracionId = action.payload;
      } else {
        state.configuracionId = null;
      }
    },
    setClearData: (state) => {
      state.configuracionId = null;
      state.kpiConfig = [];
      state.lineasProductos = [];
      state.reglasComision = [];
      state.lineasParametros = [];
      state.parametros = [];
      state.versiones = [];
      state.escalas = [];
    },
  },
  extraReducers,
});

export const { setInitialStep, setConfiguracionId, setClearData } =
  configuracionComisionesSlice.actions;

export default configuracionComisionesSlice.reducer;
