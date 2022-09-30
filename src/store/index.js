import { configureStore } from "@reduxjs/toolkit";
import reduxLogger from "redux-logger";
import { userSlice, singleUserSlice, loginSlice } from "../components";

const store = configureStore({
  reducer: {
    users: userSlice,
    singleUser: singleUserSlice,
    login: loginSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxLogger),
});

export default store;
