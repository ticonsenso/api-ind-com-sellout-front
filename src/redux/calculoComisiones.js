import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  nomina: [],
  totalNomina: 0,
  comisiones: [],
  totalComisiones: 0,
  productosKpi: [],
  totalProductosKpi: 0,
  consolidado: [],
  totalConsolidado: 0,
  detailCommission: [],
};

export const updateEmployee = createAsyncThunk(
  "calculoComisiones/updateEmployee",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.nominaUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerNomina = createAsyncThunk(
  "calculoComisiones/obtenerNomina",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { page, limit, calculateDate, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.nominaUrl.url + "/search")
        .setMethod("POST")
        .setParams({ page, limit, calculateDate })
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerComisiones = createAsyncThunk(
  "calculoComisiones/obtenerComisiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.calculoComisionesUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerProductosKpi = createAsyncThunk(
  "calculoComisiones/obtenerProductosKpi",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.productosKpiUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerConsolidado = createAsyncThunk(
  "calculoComisiones/obtenerConsolidado",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.consolidadoUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerDetalleComision = createAsyncThunk(
  "calculoComisiones/obtenerDetalleComision",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.detalleComisionUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteConsolidado = createAsyncThunk(
  "calculoComisiones/deleteConsolidado",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.deleteConsolidadoUrl.url)
        .setMethod("DELETE")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerNomina.fulfilled, (state, action) => {
      if (action.payload) {
        state.nomina = action.payload.items;
        state.totalNomina = action.payload.total;
      } else {
        state.nomina = [];
        state.totalNomina = 0;
      }
    })
    .addCase(obtenerNomina.rejected, (state, action) => {
      state.nomina = [];
      state.totalNomina = 0;
    })
    .addCase(obtenerComisiones.fulfilled, (state, action) => {
      if (action.payload) {
        state.comisiones = action.payload.data;
        state.totalComisiones = action.payload.total;
      } else {
        state.comisiones = [];
        state.totalComisiones = 0;
      }
    })
    .addCase(obtenerComisiones.rejected, (state, action) => {
      state.comisiones = [];
      state.totalComisiones = 0;
    })
    .addCase(obtenerProductosKpi.fulfilled, (state, action) => {
      if (action.payload) {
        state.productosKpi = action.payload.data;
        state.totalProductosKpi = action.payload.total;
      } else {
        state.productosKpi = [];
        state.totalProductosKpi = 0;
      }
    })
    .addCase(obtenerProductosKpi.rejected, (state, action) => {
      state.productosKpi = [];
      state.totalProductosKpi = 0;
    })
    .addCase(obtenerConsolidado.fulfilled, (state, action) => {
      if (action.payload) {
        state.consolidado = action.payload.data;
        state.totalConsolidado = action.payload.total;
      } else {
        state.consolidado = [];
        state.totalConsolidado = 0;
      }
    })
    .addCase(obtenerConsolidado.rejected, (state, action) => {
      state.consolidado = [];
      state.totalConsolidado = 0;
    })
    .addCase(obtenerDetalleComision.fulfilled, (state, action) => {
      if (action.payload) {
        state.detailCommission = action.payload;
      } else {
        state.detailCommission = [];
      }
    })
    .addCase(obtenerDetalleComision.rejected, (state, action) => {
      state.detailCommission = [];
    });
};

const calculoComisionesSlice = createSlice({
  name: "calculoComisiones",
  initialState,
  reducers: {},
  extraReducers,
});

export const {} = calculoComisionesSlice.actions;

export default calculoComisionesSlice.reducer;
