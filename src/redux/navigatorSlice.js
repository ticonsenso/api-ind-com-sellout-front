import { createSlice } from "@reduxjs/toolkit";
import initialStateMenu from "../containers/dashboard/data.js";
import { useSelector } from "react-redux";
const initialState = {
  state: false,
  initialStateMenu,
  selectMenu: initialStateMenu[0],
  value: 0,
  menuAbierto: false,
  cerrarSesionAutomaticamente: false,
};

const handleMenuClick = (state, item) => {
  const payload = item.payload;

  if (!payload) {
    state.state = !state.state;
    return;
  }
  state.selectMenu = payload;
  if (payload.subMenu && payload.subMenu.length > 0) {
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
