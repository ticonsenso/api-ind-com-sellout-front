import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  dataPresupuestoSellout: [],
  totalPresupuestoSellout: 0,
  dataValoresSellout: [],
  totalValoresSellout: 0,
  dataMatriculacionConfig: [],
  totalMatriculacionConfig: 0,
};

//PRESUPUESTO SELLOUT
export const createPresupuestoSellout = createAsyncThunk(
  "configSellout/createPresupuestoSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.datosPresupuestoSelloutUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePresupuestoSellout = createAsyncThunk(
  "configSellout/updatePresupuestoSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.datosPresupuestoSelloutUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePresupuestoSellout = createAsyncThunk(
  "configSellout/deletePresupuestoSellout",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.datosPresupuestoSelloutUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerPresupuestoSellout = createAsyncThunk(
  "configSellout/obtenerPresupuestoSellout",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.datosPresupuestoSelloutUrl.url + "/" + id)
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelPresupuestoSellout = createAsyncThunk(
  "configSellout/subirExcelPresupuestoSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.datosPresupuestoSelloutUrl.url + "/bulk")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//valores
export const obtenerValoresSellout = createAsyncThunk(
  "configSellout/obtenerValoresSellout",
  async (params, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.valoresSelloutUrl.url + "/filters")
        .setMethod("GET")
        .setParams(params)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createValoresSellout = createAsyncThunk(
  "configSellout/createValoresSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.valoresSelloutUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateValoresSellout = createAsyncThunk(
  "configSellout/updateValoresSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.valoresSelloutUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteValoresSellout = createAsyncThunk(
  "configSellout/deleteValoresSellout",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.valoresSelloutUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelValoresSellout = createAsyncThunk(
  "configSellout/subirExcelValoresSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.valoresSelloutUrl.url + "/bulk")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//MATRICULACION config
export const createMatriculacionConfig = createAsyncThunk(
  "selloutDatos/createMatriculacionConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionCierreUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMatriculacionConfig = createAsyncThunk(
  "selloutDatos/updateMatriculacionConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionCierreUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMatriculacionConfig = createAsyncThunk(
  "selloutDatos/deleteMatriculacionConfig",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionCierreUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerMatriculacionConfig = createAsyncThunk(
  "selloutDatos/obtenerMatriculacionConfig",
  async (params, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.configuracionCierreUrl.url)
        .setMethod("GET")
        .setParams(params)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const extraReducers = (builder) => {
  builder
    .addCase(obtenerPresupuestoSellout.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataPresupuestoSellout = action.payload;
        state.totalPresupuestoSellout = action.payload.total;
      } else {
        state.dataPresupuestoSellout = [];
        state.totalPresupuestoSellout = 0;
      }
    })
    .addCase(obtenerPresupuestoSellout.rejected, (state, action) => {
      state.dataPresupuestoSellout = [];
      state.totalPresupuestoSellout = 0;
    })
    .addCase(obtenerValoresSellout.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataValoresSellout = action.payload.items;
        state.totalValoresSellout = action.payload.total;
      } else {
        state.dataValoresSellout = [];
        state.totalValoresSellout = 0;
      }
    })
    .addCase(obtenerValoresSellout.rejected, (state, action) => {
      state.dataValoresSellout = [];
      state.totalValoresSellout = 0;
    })
    .addCase(obtenerMatriculacionConfig.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataMatriculacionConfig = action.payload.items;
        state.totalMatriculacionConfig = action.payload.total;
      } else {
        state.dataMatriculacionConfig = [];
        state.totalMatriculacionConfig = 0;
      }
    })
    .addCase(obtenerMatriculacionConfig.rejected, (state, action) => {
      state.dataMatriculacionConfig = [];
      state.totalMatriculacionConfig = 0;
    });
};

const selloutDatosSlice = createSlice({
  name: "selloutDatos",
  initialState,
  reducers: {},
  extraReducers,
});

export const {} = selloutDatosSlice.actions;
export default selloutDatosSlice.reducer;
