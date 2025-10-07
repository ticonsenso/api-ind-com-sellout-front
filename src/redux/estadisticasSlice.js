import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  aplicaBono: [],
  dataEstadisticas: [],
  totalAplicaBono: null,
  dataCumplimiento: {},
  dataEstadisticasComisiones: [],
  optionsEstadisticasComisiones: [],
};

export const obtenerAplicaBono = createAsyncThunk(
  "estadisticas/obtenerAplicaBono",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.aplicaBonoUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerEstadisticasAnual = createAsyncThunk(
  "estadisticas/obtenerEstadisticasAnual",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.eatadisticasUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerAplicaCumplimiento = createAsyncThunk(
  "estadisticas/obtenerAplicaCumplimiento",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.eatadisticasCumplimientoUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerEstadisticasComisiones = createAsyncThunk(
  "estadisticas/obtenerEstadisticasComisiones",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { year, month, index, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.estadisticasComisionesUrl.url)
        .setMethod("POST")
        .setParams({ year, month, index })
        .setData({ ...rest })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerOpcionesEstadisticasComisiones = createAsyncThunk(
  "estadisticas/obtenerOpcionesEstadisticasComisiones",
  async (companyId, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.optionEstadisticasComisionesUrl.url)
        .setMethod("GET")
        .setParams({ companyId })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerAplicaBono.fulfilled, (state, action) => {
      if (action.payload) {
        state.aplicaBono = action?.payload?.details || {};
        state.totalAplicaBono = action?.payload?.total || 0;
      } else {
        state.aplicaBono = [];
        state.totalAplicaBono = 0;
      }
    })
    .addCase(obtenerAplicaBono.rejected, (state, action) => {
      state.aplicaBono = [];
      state.totalAplicaBono = 0;
    })
    .addCase(obtenerEstadisticasAnual.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataEstadisticas = action.payload;
      } else {
        state.dataEstadisticas = [];
      }
    })
    .addCase(obtenerEstadisticasAnual.rejected, (state, action) => {
      state.dataEstadisticas = [];
    })
    .addCase(obtenerAplicaCumplimiento.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataCumplimiento = action.payload;
      } else {
        state.dataCumplimiento = {};
      }
    })
    .addCase(obtenerAplicaCumplimiento.rejected, (state, action) => {
      state.dataCumplimiento = {};
    })
    .addCase(obtenerEstadisticasComisiones.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataEstadisticasComisiones = action.payload;
      } else {
        state.dataEstadisticasComisiones = [];
      }
    })
    .addCase(obtenerEstadisticasComisiones.rejected, (state, action) => {
      state.dataEstadisticasComisiones = [];
    })
    .addCase(
      obtenerOpcionesEstadisticasComisiones.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.optionsEstadisticasComisiones = action.payload;
        } else {
          state.optionsEstadisticasComisiones = [];
        }
      }
    )
    .addCase(
      obtenerOpcionesEstadisticasComisiones.rejected,
      (state, action) => {
        state.optionsEstadisticasComisiones = [];
      }
    );
};

export const estadisticasSlice = createSlice({
  name: "estadisticas",
  initialState,
  reducers: {},
  extraReducers,
});

export const {} = estadisticasSlice.actions;

export default estadisticasSlice.reducer;
