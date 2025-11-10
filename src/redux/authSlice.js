import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  eliminarRegistros: true,
  idPermisoRol: null,
  tokenExpired: false,
  isAuthenticated: false,
  loading: false,
  token: null,
  permisos: [],
  rolSelected: {},
  rolesUsuario: [],
  person: {},
  userEmpresa: false,
  idEmpresaSeleccionada: null,
  empresaSeleccionadaUser: {},
};

export const getRolesUsuarioLogin = createAsyncThunk(
  "login/data",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.users.url + "/roles/login")
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getPermisos = createAsyncThunk(
  "login/getPermisos",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.getPermisos.url.replace(":id", id))
        .setMethod(apiConfig.getPermisos.method)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const actionLogout = (state) => {
  state.token = null;
  state.permisos = [];
  state.rolSelected = {};
  state.rolesUsuario = [];
};

const extraReducers = (builder) => {
  builder
    .addCase(getRolesUsuarioLogin.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.rolesUsuario = action.payload;
      } else {
        state.rolesUsuario = [];
      }
    })
    .addCase(getRolesUsuarioLogin.rejected, (state) => {
      state.rolesUsuario = [];
    });
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    actionLogoutReducer: actionLogout,
    setToken: (state, action) => {
      if (action.payload) {
        state.token = action.payload;
        state.eliminarRegistros = true;
      } else {
        state.token = null;
      }
    },
    setRolesUsuario: (state, action) => {
      if (action.payload) {
        state.rolSelected = action.payload;
        state.permisos = action.payload.permissions;
        state.person = action.payload.user;
        if (action.payload.user.company) {
          state.userEmpresa = true;
          state.idEmpresaSeleccionada = action.payload.user.company.id;
          state.empresaSeleccionadaUser = action.payload.user.company;
        } else {
          state.userEmpresa = false;
          state.idEmpresaSeleccionada = null;
          state.empresaSeleccionadaUser = {};
        }
      } else {
        state.rolSelected = {};
        state.permisos = [];
        state.userEmpresa = false;
        state.idEmpresaSeleccionada = null;
        state.empresaSeleccionadaUser = {};
      }
    },
  },
  extraReducers: (builder) => extraReducers(builder),
});

export const { logout, setToken, setRolesUsuario, actionLogoutReducer } =
  authSlice.actions;
export const auth = (state) => state.auth;
export default authSlice.reducer;
