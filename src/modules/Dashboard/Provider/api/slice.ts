import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PatientState {

}

const initialState: PatientState = {

};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
 
  },
});

export const { } = patientSlice.actions;
export default patientSlice.reducer;
