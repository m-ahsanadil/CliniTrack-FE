import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BillingState {

}

const initialState: BillingState = {

};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
 
  },
});

export const { } = billingSlice.actions;
export default billingSlice.reducer;
