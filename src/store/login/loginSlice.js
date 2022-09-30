import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.headers.common["authorization"] =
  window.localStorage.getItem("token");

export const loginSlice = createSlice({
    name: "login",
    initialState: {
        value: false,
    },
    reducers: {
        toggle: (state) => {state.value = !state.value}
    },
    extraReducers: {},
});

export const { toggle } = loginSlice.actions
export default loginSlice.reducer;