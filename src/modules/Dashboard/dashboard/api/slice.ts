import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {

}

const initialState: DashboardState = {

};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {

  },
});

export const { } = dashboardSlice.actions;
export default dashboardSlice.reducer;
