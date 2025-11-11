import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiService } from "../service/apiService.js";
import { apiConfig } from "../service/apiConfig.js";

const initialState = {
  users: [],
  user: {},
  roles: [],
  role: {},
  permissions: [],
  permiso: {},
  asignarPermiso: [],
  asignarRol: [],
  optionsRoles: [],
  optionsPermisos: [],
};

const setUserObject = (state, action) => {
  if (action.payload.key) {
    const { key, value } = action.payload;
    state.user[key] = value;
  } else {
    state.user = {};
  }
};

//users
export const createUser = createAsyncThunk(
  "users/createUser",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const data = state.user;
    try {
      return await apiService
        .setUrl(apiConfig.users.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    const dataToSend = {
      dni: rest.dni,
      name: rest.name,
      email: rest.email,
      status: rest.status,
      phone: rest.phone,
    };
    try {
      return await apiService
        .setUrl(apiConfig.users.url + "/" + id)
        .setMethod("PUT")
        .setData(dataToSend)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerUsuarios = createAsyncThunk(
  "users/obtenerUsuarios",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.users.url)
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserCompany = createAsyncThunk(
  "users/updateUserCompany",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { userId, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.users.url + "/" + userId + "/company")
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//roles
const setRoleObject = (state, action) => {
  if (action.payload.key) {
    const { key, value } = action.payload;
    state.role[key] = value;
  } else {
    state.role = {};
  }
};

export const createRole = createAsyncThunk(
  "users/createRole",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.roles.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateRole = createAsyncThunk(
  "users/updateRole",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.roles.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "users/deleteRole",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.roles.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const obtenerRoles = createAsyncThunk(
  "users/obtenerRoles",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.roles.url)
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//permissions
const setPermissionObject = (state, action) => {
  if (action.payload.key) {
    const { key, value } = action.payload;
    state.permiso[key] = value;
  } else {
    state.permiso = {};
  }
};

export const createPermission = createAsyncThunk(
  "users/createPermission",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.permissions.url)
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePermission = createAsyncThunk(
  "users/updatePermission",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    const { id, ...rest } = data;
    try {
      return await apiService
        .setUrl(apiConfig.permissions.url + "/" + id)
        .setMethod("PUT")
        .setData(rest)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "users/deletePermission",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.permissions.url + "/" + id)
        .setMethod("DELETE")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const obtenerPermissions = createAsyncThunk(
  "users/obtenerPermissions",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.permissions.url)
        .setMethod("GET")
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asignarPermisoRol = createAsyncThunk(
  "users/asignarPermisoRol",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.roles.url + "/" + data.rolId + "/permissions")
        .setMethod("POST")
        .setData(data)
        .send(token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const asignarRolUsuario = createAsyncThunk(
  "users/asignarRolUsuario",
  async (data, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.auth.token;
    try {
      return await apiService
        .setUrl(apiConfig.users.url + "/" + data.userId + "/roles")
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
    .addCase(obtenerUsuarios.fulfilled, (state, action) => {
      state.users = action.payload;
    })
    .addCase(obtenerUsuarios.rejected, (state, action) => {
      state.users = [];
    })
    .addCase(obtenerRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
      state.optionsRoles = action.payload.map((rol) => ({
        id: rol.id,
        label: rol.name,
      }));
    })
    .addCase(obtenerRoles.rejected, (state, action) => {
      state.roles = [];
      state.optionsRoles = [];
    })
    .addCase(obtenerPermissions.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.permissions = action.payload;
        state.optionsPermisos = action.payload.map((permiso) => ({
          id: permiso.id,
          label: permiso?.name || "",
          description: permiso?.description || "",
          shortDescription: permiso?.shortDescription || "",
          status: permiso?.status || "",
        }));
      } else {
        state.permissions = [];
        state.optionsPermisos = [];
      }
    })
    .addCase(obtenerPermissions.rejected, (state, action) => {
      state.permissions = [];
      state.optionsPermisos = [];
    });
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateUserObject: setUserObject,
    clearUserObject: (state) => {
      state.user = {};
    },
    updateEditUser: (state, action) => {
      state.user = action.payload;
    },
    updateRoleObject: setRoleObject,
    updatePermissionObject: setPermissionObject,
    updateAsignarRol: (state, action) => {
      state.asignarRol = action.payload;
    },
    updateAsignarPermiso: (state, action) => {
      state.asignarPermiso = action.payload;
    },
  },
  extraReducers: (builder) => extraReducers(builder),
});

export const {
  updateUserObject,
  clearUserObject,
  updateRoleObject,
  updatePermissionObject,
  updateAsignarRol,
  updateAsignarPermiso,
  updateEditUser,
} = userSlice.actions;

export default userSlice.reducer;
