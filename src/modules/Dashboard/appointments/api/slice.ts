import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppointmentState {

}

const initialState: AppointmentState = {

};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
 
  },
});

export const { } = appointmentSlice.actions;
export default appointmentSlice.reducer;
