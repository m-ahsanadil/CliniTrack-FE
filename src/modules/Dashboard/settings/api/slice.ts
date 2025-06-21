import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingState {

}

const initialState: SettingState = {

};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {

  },
});

export const { } = settingSlice.actions;
export default settingSlice.reducer;