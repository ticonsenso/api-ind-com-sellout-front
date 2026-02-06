import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";
import pako from "pako";

const initialState = {
  dataMaestrosProducts: [],
  dataMaestrosStores: [],
  totalMaestrosProducts: 0,
  totalMaestrosStores: 0,
  configuracionExtraccionSelloutId: null,
  totalExtracciones: 0,
  configExtracciones: [],
  totalConfigExtracciones: 0,
  idEmpresaIndurama: null,
  columnsExtracciones: [],
  totalColumnsExtracciones: 0,
  dataStoresSic: [],
  totalStoresSic: 0,
  dataProductsSic: [],
  totalProductsSic: 0,
  optionsConfiguracionSellout: [],
  totalOptionsConfiguracionSellout: 0,
  dataColumnsSearch: [],
  dataConsolidatedSellout: [],
  totalConsolidatedSellout: 0,
  dataConsolidatedAlert: null,
  busquedaDistribuidor: [],
  busquedaAlmacen: [],
  dataMatriculacion: [],
  totalMatriculacion: 0,
  dataMatriculacionRegistrados: [],
  totalMatriculacionRegistrados: 0,
  optionsMatriculacion: [],
  calculateDate: null,
  dataLines: [],
  totalLines: 0,
};

//maestrosProducts
export const createMaestrosProducts = createAsyncThunk(
  "configSellout/createMaestrosProducts",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMaestrosProducts = createAsyncThunk(
  "configSellout/updateMaestrosProducts",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerMaestrosProducts = createAsyncThunk(
  "configSellout/obtenerMaestrosProducts",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMaestrosProducts = createAsyncThunk(
  "configSellout/deleteMaestrosProducts",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const maestrosProductsSic = createAsyncThunk(
  "configSellout/maestrosProductsSic",
  async (productSic, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url + "/model/" + productSic)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const guardarProductSicBulk = createAsyncThunk(
  "configSellout/guardarProductSicBulk",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.bulkConsolidatedUrl.url)
        .setMethod("PUT")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//maestrosStores
export const obtenerMaestrosStores = createAsyncThunk(
  "configSellout/obtenerMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const busquedaDistribuidorMaestrosStores = createAsyncThunk(
  "configSellout/busquedaDistribuidorMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/unique")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const busquedaAlmacenMaestrosStores = createAsyncThunk(
  "configSellout/busquedaAlmacenMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/unique")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMaestrosStores = createAsyncThunk(
  "configSellout/deleteMaestrosStores",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMaestrosStores = createAsyncThunk(
  "configSellout/updateMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMaestrosStores = createAsyncThunk(
  "configSellout/createMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const maestrosStoresSic = createAsyncThunk(
  "configSellout/maestrosStoresSic",
  async (storeSic, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(
          apiConfig.maestrosStoresUrl.url +
          "/distribuidor-store-name/" +
          storeSic
        )
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//storesSic
export const obtenerStoresSic = createAsyncThunk(
  "configSellout/obtenerStoresSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storesSicUrl.url + "/filters")
        .setMethod("POST")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStoresSic = createAsyncThunk(
  "configSellout/createStoresSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storesSicUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStoresSic = createAsyncThunk(
  "configSellout/updateStoresSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.storesSicUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStoresSic = createAsyncThunk(
  "configSellout/deleteStoresSic",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storesSicUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//productsSic
export const obtenerProductsSic = createAsyncThunk(
  "configSellout/obtenerProductsSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.productsSicUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createProductsSic = createAsyncThunk(
  "configSellout/createProductsSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.productsSicUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProductsSic = createAsyncThunk(
  "configSellout/deleteProductsSic",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.productsSicUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateProductsSic = createAsyncThunk(
  "configSellout/updateProductsSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.productsSicUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelStoresSic = createAsyncThunk(
  "configSellout/subirExcelStoresSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.storesSicUrl.url + "/bulk")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelProductsSic = createAsyncThunk(
  "configSellout/subirExcelProductsSic",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.productsSicUrl.url + "/bulk")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelMaestrosProducts = createAsyncThunk(
  "configSellout/subirExcelMaestrosProducts",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const json = JSON.stringify(data);
      const gzip = pako.gzip(json);

      const response = await apiService
        .setUrl(apiConfig.maestrosProductsUrl.url + "/bulk")
        .setMethod("POST")
        .setHeaders({ Accept: "application/json" })
        .setData(gzip)
        .send(token);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelMaestrosStores = createAsyncThunk(
  "configSellout/subirExcelMaestrosStores",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const json = JSON.stringify(data);
      const gzip = pako.gzip(json);

      const response = await apiService
        .setUrl(apiConfig.maestrosStoresUrl.url + "/bulk")
        .setMethod("POST")
        .setHeaders({ Accept: "application/json" })
        .setData(gzip)
        .send(token);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//extractions
export const obtenerExtractionsConfig = createAsyncThunk(
  "configSellout/obtenerExtractionsConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extractionsConfigUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createExtractionsConfig = createAsyncThunk(
  "configSellout/createExtractionsConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extractionsConfigUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExtractionsConfig = createAsyncThunk(
  "configSellout/updateExtractionsConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.extractionsConfigUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteExtractionsConfig = createAsyncThunk(
  "configSellout/deleteExtractionsConfig",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.extractionsConfigUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//columns extraccion
export const createColumnSellout = createAsyncThunk(
  "configSellout/createColumnSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createColumnArraySellout = createAsyncThunk(
  "configSellout/createColumnArraySellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url + "/batch")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExtractionsColumn = createAsyncThunk(
  "configSellout/updateExtractionsColumn",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteExtractionsColumn = createAsyncThunk(
  "configSellout/deleteExtractionsColumn",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerColumnsExtractionsConfig = createAsyncThunk(
  "configSellout/obtenerColumnsExtractionsConfig",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerColumnsSearch = createAsyncThunk(
  "configSellout/obtenerColumnsSearch",
  async (search, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.columnsExtraccionSelloutUrl.url + "/filters")
        .setMethod("GET")
        .setParams(search)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//sendSellout
export const sendSellout = createAsyncThunk(
  "configSellout/sendSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const json = JSON.stringify(data);
      const gzip = pako.gzip(json);

      const response = await apiService
        .setUrl(apiConfig.sendSelloutUrl.url)
        .setMethod("POST")
        .setHeaders({ Accept: "application/json" })
        .setData(gzip)
        .send(token);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


//consolidatedSellout

export const updateArraySellout = createAsyncThunk(
  "configSellout/updateArraySellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const guardarConsolidatedSellout = createAsyncThunk(
  "configSellout/guardarConsolidatedSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerConsolidatedSellout = createAsyncThunk(
  "configSellout/obtenerConsolidatedSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { page, limit, calculateDate, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url + "/filters-mod")
        .setMethod("POST")
        .setParams({ page, limit, calculateDate })
        .setData(rest || {})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editStatusConsolidatedSellout = createAsyncThunk(
  "configSellout/editStatusConsolidatedSellout",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url + "/status/" + id)
        .setMethod("PUT")
        .setData(rest || {})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerConsolidatedSelloutUnique = createAsyncThunk(
  "configSellout/obtenerConsolidatedSelloutUnique",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { page, limit, calculateDate, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url + "/values-null-unique")
        .setMethod("POST")
        .setParams({ page, limit, calculateDate })
        .setData(rest || {})
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getConsolidatedAlert = createAsyncThunk(
  "configSellout/getConsolidatedAlert",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.consolidatedSelloutUrl.url + "/detail-null-fields")
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const sincronizarDatosConsolidated = createAsyncThunk(
  "configSellout/sincronizarDatosConsolidated",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(
          apiConfig.consolidatedSelloutUrl.url +
          "/sync/" +
          data.year +
          "/" +
          data.month
        )
        .setMethod("PUT")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//confLines
export const obtenerLines = createAsyncThunk(
  "configSellout/obtenerLines",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { sortBy = "id", sortOrder = "ASC", ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.confLinesUrl.url + "/paginated/all")
        .setMethod("GET")
        .setParams({ sortBy, sortOrder, ...rest })
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLines = createAsyncThunk(
  "configSellout/createLines",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.confLinesUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLines = createAsyncThunk(
  "configSellout/updateLines",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.confLinesUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLines = createAsyncThunk(
  "configSellout/deleteLines",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.confLinesUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const subirExcelLines = createAsyncThunk(
  "configSellout/subirExcelLines",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const response = await apiService
        .setUrl(apiConfig.confLinesUrl.url + "/charge/all")
        .setMethod("POST")
        .setHeaders({ Accept: "application/json" })
        .setData(data)
        .send(token);

      return response?.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//matriculacion
export const obtenerMatriculacion = createAsyncThunk(
  "configSellout/obtenerMatriculacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url)
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMasivaMatriculacion = createAsyncThunk(
  "configSellout/deleteMasivaMatriculacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/delete-all")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerMatriculacionRegistrados = createAsyncThunk(
  "configSellout/obtenerMatriculacionRegistrados",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/filters")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const verificarMatriculacion = createAsyncThunk(
  "configSellout/verificarMatriculacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionLogsUrl.url + "/verfication")
        .setMethod("GET")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMatriculacion = createAsyncThunk(
  "configSellout/createMatriculacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMatriculacionBulk = createAsyncThunk(
  "configSellout/createMatriculacionBulk",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/bulk")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMatriculationBeforeMonth = createAsyncThunk(
  "configSellout/createMatriculationBeforeMonth",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/before-month")
        .setMethod("POST")
        .setParams(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMatriculacion = createAsyncThunk(
  "configSellout/updateMatriculacion",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMatriculacion = createAsyncThunk(
  "configSellout/deleteMatriculacion",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.matriculacionUrl.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const exportarExcel = createAsyncThunk(
  "configSellout/exportarExcel",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { excel_name, nombre, calculateDate } = data;

    try {
      const response = await fetch(
        `${apiConfig.exportarExcelUrl.url}${excel_name}?calculate_date=${calculateDate}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("❌ Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${nombre}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const exportarExcelAvanced = createAsyncThunk(
  "configSellout/exportarExcelAvanced",
  async (calculateDate, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const response = await fetch(
        `${apiConfig.exportarExcelUrl.url}avanced?calculate_date=${calculateDate}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("❌ Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.download = `sellout_mercado_${calculateDate}.xlsx`;
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message || "Error inesperado");
    }
  }
);

export const cargarExcel = createAsyncThunk(
  "config/cargarExcel",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;

    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("type", data.type);
      return await apiService
        .setUrl(apiConfig.exportarExcelUrl.url + "import")
        .setMethod("POST")
        .setData(formData)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


const extraReducers = (builder) => {
  builder
    .addCase(obtenerMaestrosStores.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataMaestrosStores = action.payload.items;
        state.totalMaestrosStores = action.payload.total;
      } else {
        state.dataMaestrosStores = [];
        state.totalMaestrosStores = 0;
      }
    })
    .addCase(obtenerMaestrosStores.rejected, (state, action) => {
      state.dataMaestrosStores = [];
      state.totalMaestrosStores = 0;
    })
    .addCase(obtenerMaestrosProducts.rejected, (state, action) => {
      state.dataMaestrosProducts = [];
      state.totalMaestrosProducts = 0;
    })
    .addCase(obtenerMaestrosProducts.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataMaestrosProducts = action.payload.items;
        state.totalMaestrosProducts = action.payload.total;
      } else {
        state.dataMaestrosProducts = [];
        state.totalMaestrosProducts = 0;
      }
    })
    .addCase(createExtractionsConfig.fulfilled, (state, action) => {
      if (action.payload) {
        state.configuracionExtraccionSelloutId =
          action.payload.selloutConfiguration.id;
      } else {
        state.configuracionExtraccionSelloutId = null;
      }
    })
    .addCase(createExtractionsConfig.rejected, (state, action) => {
      state.configuracionExtraccionSelloutId = null;
    })
    .addCase(obtenerColumnsExtractionsConfig.fulfilled, (state, action) => {
      if (action.payload) {
        state.columnsExtracciones = action.payload.items;
        state.totalColumnsExtracciones = action.payload.total;
      } else {
        state.columnsExtracciones = [];
        state.totalColumnsExtracciones = 0;
      }
    })
    .addCase(obtenerColumnsExtractionsConfig.rejected, (state, action) => {
      state.columnsExtracciones = [];
      state.totalColumnsExtracciones = 0;
    })
    .addCase(obtenerColumnsSearch.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataColumnsSearch = action.payload.items;
      } else {
        state.dataColumnsSearch = [];
      }
    })
    .addCase(obtenerColumnsSearch.rejected, (state, action) => {
      state.dataColumnsSearch = [];
    })
    .addCase(obtenerExtractionsConfig.fulfilled, (state, action) => {
      if (action.payload) {
        state.configExtracciones = action.payload.items;
        state.totalExtracciones = action.payload.total;
        state.optionsConfiguracionSellout = action.payload.items.map(
          (item) => ({
            id: item.id,
            label: item.name,
            sheetName: item.sheetName,
            distributor: item?.distributorCompanyName || "",
            codeStoreDistributor: item?.codeStoreDistributor || "",
            ...item,
          })
        );
      } else {
        state.configExtracciones = [];
        state.totalExtracciones = 0;
        state.optionsConfiguracionSellout = [];
      }
    })
    .addCase(obtenerStoresSic.rejected, (state, action) => {
      state.dataStoresSic = [];
      state.totalStoresSic = 0;
    })
    .addCase(obtenerStoresSic.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataStoresSic = action.payload.items;
        state.totalStoresSic = action.payload.total;
      } else {
        state.dataStoresSic = [];
        state.totalStoresSic = 0;
      }
    })
    .addCase(obtenerProductsSic.rejected, (state, action) => {
      state.dataProductsSic = [];
      state.totalProductsSic = 0;
    })
    .addCase(obtenerProductsSic.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataProductsSic = action.payload.items;
        state.totalProductsSic = action.payload.total;
      } else {
        state.dataProductsSic = [];
        state.totalProductsSic = 0;
      }
    })
    .addCase(obtenerConsolidatedSellout.rejected, (state, action) => {
      state.dataConsolidatedSellout = [];
      state.totalConsolidatedSellout = 0;
    })
    .addCase(obtenerConsolidatedSellout.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataConsolidatedSellout = action.payload.items;
        state.totalConsolidatedSellout = action.payload.total;
      } else {
        state.dataConsolidatedSellout = [];
        state.totalConsolidatedSellout = 0;
      }
    })
    .addCase(getConsolidatedAlert.rejected, (state, action) => {
      state.dataConsolidatedAlert = null;
    })
    .addCase(getConsolidatedAlert.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataConsolidatedAlert = action.payload;
      } else {
        state.dataConsolidatedAlert = null;
      }
    })
    .addCase(busquedaDistribuidorMaestrosStores.rejected, (state, action) => {
      state.busquedaDistribuidor = [];
    })
    .addCase(busquedaDistribuidorMaestrosStores.fulfilled, (state, action) => {
      if (action.payload) {
        state.busquedaDistribuidor = action.payload.values.map((item) => ({
          id: item.distributor,
          label: item.distributor,
        }));
      } else {
        state.busquedaDistribuidor = [];
      }
    })
    .addCase(busquedaAlmacenMaestrosStores.rejected, (state, action) => {
      state.busquedaAlmacen = [];
    })
    .addCase(busquedaAlmacenMaestrosStores.fulfilled, (state, action) => {
      if (action.payload) {
        state.busquedaAlmacen = action.payload.values.map((item) => ({
          id: item.storeDistributor,
          label: item.storeDistributor,
        }));
      } else {
        state.busquedaAlmacen = [];
      }
    })
    .addCase(obtenerMatriculacion.rejected, (state, action) => {
      state.dataMatriculacion = [];
      state.totalMatriculacion = 0;
      state.optionsMatriculacion = [];
    })
    .addCase(obtenerMatriculacion.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataMatriculacion = action.payload.items;
        state.totalMatriculacion = action.payload.total;
        state.optionsMatriculacion = action.payload.items.map((item) => ({
          id: item.id,
          label: item.distributor + " - " + item.storeName,
          codeStoreDistributor: item.storeName,
          distributor: item.distributor,
        }));
      } else {
        state.dataMatriculacion = [];
        state.totalMatriculacion = 0;
        state.optionsMatriculacion = [];
      }
    })
    .addCase(obtenerMatriculacionRegistrados.rejected, (state, action) => {
      state.dataMatriculacionRegistrados = [];
      state.totalMatriculacionRegistrados = 0;
    })
    .addCase(obtenerMatriculacionRegistrados.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataMatriculacionRegistrados = action.payload;
        state.totalMatriculacionRegistrados = action.payload.total;
      } else {
        state.dataMatriculacionRegistrados = [];
        state.totalMatriculacionRegistrados = 0;
      }
    })
    .addCase(obtenerLines.rejected, (state, action) => {
      state.dataLines = [];
      state.totalLines = 0;
    })
    .addCase(obtenerLines.fulfilled, (state, action) => {
      if (action.payload) {
        state.dataLines = action.payload.data;
        state.totalLines = action.payload.total;
      } else {
        state.dataLines = [];
        state.totalLines = 0;
      }
    });
};

const configSelloutSlice = createSlice({
  name: "configSellout",
  initialState,
  reducers: {
    setIdEmpresaIndurama: (state, action) => {
      if (action.payload) {
        state.idEmpresaIndurama = action.payload;
      } else {
        state.idEmpresaIndurama = null;
      }
    },
    setConfiguracionSeleccionada: (state, action) => {
      if (action.payload) {
        state.configuracionExtraccionSelloutId = action.payload;
      } else {
        state.configuracionExtraccionSelloutId = null;
      }
    },
    setDataColumnsSearch: (state, action) => {
      if (action.payload) {
        state.dataColumnsSearch = action.payload;
      } else {
        state.dataColumnsSearch = null;
      }
    },
    setCalculateDate: (state, action) => {
      if (action.payload) {
        state.calculateDate = action.payload;
      } else {
        state.calculateDate = null;
      }
    },
  },
  extraReducers,
});

export const {
  setIdEmpresaIndurama,
  setConfiguracionSeleccionada,
  setDataColumnsSearch,
  setCalculateDate,
} = configSelloutSlice.actions;

export default configSelloutSlice.reducer;
