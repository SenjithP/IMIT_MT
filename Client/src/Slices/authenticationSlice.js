import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: (() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || null;
    } catch (error) {
      console.error("Error parsing userInfo from localStorage:", error);
      return null;
    }
  })(),
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    userLogout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setUserCredentials, userLogout } = authenticationSlice.actions;
export default authenticationSlice.reducer;
