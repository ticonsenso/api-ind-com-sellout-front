import { createSlice } from "@reduxjs/toolkit";
import initialStateMenu from "../containers/dashboard/data.js";
const initialState = {
  state: false,
  initialStateMenu,
  selectMenu: initialStateMenu[0],
  value: 0,
  menuAbierto: false,
  cerrarSesionAutomaticamente: false,
  currentTab: 0,
};

const handleMenuClick = (state, action) => {
  const payload = action.payload;

  if (!payload) {
    state.state = !state.state;
    return;
  }

  // If payload is partial (e.g., from home.jsx cards), enrich it with full menu data
  let fullItem = payload;
  if (payload.id !== undefined && !payload.name) {
    const found = state.initialStateMenu.find(item => item.id === payload.id);
    if (found) {
      fullItem = { ...found, ...payload };
    }
  }

  state.selectMenu = fullItem;
  state.currentTab = fullItem.tab ?? 0;
  
  if (fullItem.subMenu && fullItem.subMenu.length > 0) {
    state.menuAbierto = true;
    state.state = true;
  } else {
    state.menuAbierto = false;
    state.state = false;
  }
};

export const navigatorSlice = createSlice({
  name: "navigator",
  initialState,
  reducers: {
    handleMenu: handleMenuClick,
  },
});

export const { handleMenu } = navigatorSlice.actions;

export default navigatorSlice.reducer;
