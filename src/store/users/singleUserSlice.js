import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {};

axios.defaults.headers.common["authorization"] =
  window.localStorage.getItem("token");

export const getSingleUser = createAsyncThunk("/singleUser", async (id) => {
  try {
    const token = window.localStorage.getItem("token");
    const { data } = await axios.get(`/api/users/single`, {
      headers: { authorization: token },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
});

export const updateUser = createAsyncThunk(
  "/updateUser",
  async (updatedUserObject) => {
    try {
      const { id } = updatedUserObject;
      const { data } = await axios.put(`/api/users/${id}`, updatedUserObject);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

export const singleUserSlice = createSlice({
  name: "singleUser",
  initialState,
  reducers: {},
  extraReducers: {
    [getSingleUser.fulfilled]: (state, action) => {
      return action.payload;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.users = action.payload;
    },
  },
});

export default singleUserSlice.reducer;
