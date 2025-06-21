import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { invoiceApi } from "./api"; // Adjust path as needed
import { InvoicePostRequest, InvoicePostResponse, InvoicePostErrorResponse } from "./types";

// Async thunk for creating invoice
export const createInvoice = createAsyncThunk(
  'billing/createInvoice',
  async (payload: InvoicePostRequest, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.create(payload);
      
      // Check if the response is successful
      if (response.success) {
        return response as InvoicePostResponse;
      } else {
        return rejectWithValue(response as InvoicePostErrorResponse);
      }
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to create invoice',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

interface BillingState {
  // Loading states
  isCreatingInvoice: boolean;
  
  // Error states
  createInvoiceError: string | null;
  
  // Success states
  createInvoiceSuccess: boolean;
  
  // Data
  lastCreatedInvoice: InvoicePostResponse['data'] | null;
}

const initialState: BillingState = {
  isCreatingInvoice: false,
  createInvoiceError: null,
  createInvoiceSuccess: false,
  lastCreatedInvoice: null,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // Clear create invoice states
    clearCreateInvoiceState: (state) => {
      state.createInvoiceError = null;
      state.createInvoiceSuccess = false;
      state.lastCreatedInvoice = null;
    },
    
    // Reset error state
    clearCreateInvoiceError: (state) => {
      state.createInvoiceError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.isCreatingInvoice = true;
        state.createInvoiceError = null;
        state.createInvoiceSuccess = false;
      })
      .addCase(createInvoice.fulfilled, (state, action: PayloadAction<InvoicePostResponse>) => {
        state.isCreatingInvoice = false;
        state.createInvoiceSuccess = true;
        state.createInvoiceError = null;
        state.lastCreatedInvoice = action.payload.data;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isCreatingInvoice = false;
        state.createInvoiceSuccess = false;
        state.createInvoiceError = action.payload?.message || 'Failed to create invoice';
      });
  },
});

export const { 
  clearCreateInvoiceState, 
  clearCreateInvoiceError 
} = billingSlice.actions;

export default billingSlice.reducer;