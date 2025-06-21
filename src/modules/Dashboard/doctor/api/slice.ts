import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DoctorState {

}

const initialState: DoctorState = {

};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {

  },
});

export const { } = doctorSlice.actions;
export default doctorSlice.reducer;
