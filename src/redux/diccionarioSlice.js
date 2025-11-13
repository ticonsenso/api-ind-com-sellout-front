import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
    listaCategorias: [],
    totalCategorias: 0,
    listaColumnsCategorias: [],
    totalColumnsCategorias: 0,
};



export const obtenerListaCategorias = createAsyncThunk(
    "diccionario/obtenerListaCategorias",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaCategoriasUrl.url + "/search")
                .setMethod("POST")
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createCategorias = createAsyncThunk(
    "diccionario/createCategorias",
    async (data, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaCategoriasUrl.url)
                .setMethod("POST")
                .setData(data)
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateCategorias = createAsyncThunk(
    "diccionario/updateCategorias",
    async (data, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        const dataFinal = {
            name: data.name,
            description: data.description,
        };
        try {
            return await apiService
                .setUrl(apiConfig.listaCategoriasUrl.url + "/" + data.id)
                .setMethod("PUT")
                .setData(dataFinal)
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteCategorias = createAsyncThunk(
    "diccionario/deleteCategorias",
    async (id, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaCategoriasUrl.url + "/" + id)
                .setMethod("DELETE")
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

//palabras
export const obtenerColumns = createAsyncThunk(
    "diccionario/obtenerColumns",
    async (_, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaColumnsCategoriasUrl.url + "/search")
                .setMethod("POST")
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createColumns = createAsyncThunk(
    "diccionario/createColumns",
    async (data, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaColumnsCategoriasUrl.url)
                .setMethod("POST")
                .setData(data)
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateColumns = createAsyncThunk(
    "diccionario/updateColumns",
    async (data, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        const dataFinal = {
            name: data.name,
            description: data.description,
        };
        try {
            return await apiService
                .setUrl(apiConfig.listaColumnsCategoriasUrl.url + "/" + data.id)
                .setMethod("PUT")
                .setData(dataFinal)
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteColumns = createAsyncThunk(
    "diccionario/deleteColumns",
    async (id, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth.auth.token;
        try {
            return await apiService
                .setUrl(apiConfig.listaColumnsCategoriasUrl.url + "/" + id)
                .setMethod("DELETE")
                .send(token);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


const extraReducers = (builder) => {
    builder
        .addCase(obtenerListaCategorias.fulfilled, (state, action) => {
            if (action.payload.items.length > 0) {
                state.listaCategorias = action.payload.items;
                state.totalCategorias = action.payload.total
            } else {
                state.listaCategorias = [];
            }
        })
        .addCase(obtenerListaCategorias.rejected, (state) => {
            state.listaCategorias = [];
        });
};

const diccSlice = createSlice({
    name: "diccionario",
    initialState,
    reducers: {
        setListaColumns: (state, action) => {
            if (action.payload) {
                state.listaColumnsCategorias = action.payload;
                state.totalColumnsCategorias = action.payload.length
            } else {
                state.listaColumnsCategorias = [];
                state.totalColumnsCategorias = 0
            }
        },
    },
    extraReducers: (builder) => extraReducers(builder),
});

export const { setListaColumns } = diccSlice.actions;
export default diccSlice.reducer;
