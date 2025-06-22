import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { invoiceApi } from "./api";
import { 
  Invoice,
  InvoicePostRequest, 
  InvoicePostResponse, 
  InvoicePostErrorResponse,
  InvoicePostApiResponse,
  InvoiceGetResponse,
  InvoiceGetErrorResponse,
  InvoiceGetApiResponse,
  InvoiceGetByIdResponse,
  InvoiceGetByIdErrorResponse,
  InvoiceGetByIdApiResponse,
  InvoiceDeleteResponse,
  InvoiceDeleteErrorResponse,
  InvoiceDeleteApiResponse
} from "./types";

// Async thunk for getting all invoices
export const fetchAllInvoices = createAsyncThunk<
  InvoiceGetResponse,
  void,
  { rejectValue: InvoiceGetErrorResponse }
>(
  'billing/getAllInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response: InvoiceGetApiResponse = await invoiceApi.getAll();
      
      if (!response.success) {
        return rejectWithValue(response as InvoiceGetErrorResponse);
      }
      
      return response as InvoiceGetResponse;
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to fetch invoices',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

// Async thunk for getting invoice by ID
export const getInvoiceById = createAsyncThunk<
  InvoiceGetByIdResponse,
  string | number,
  { rejectValue: InvoiceGetByIdErrorResponse }
>(
  'billing/getInvoiceById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response: InvoiceGetByIdApiResponse = await invoiceApi.getById(id);
      
      if (!response.success) {
        return rejectWithValue(response as InvoiceGetByIdErrorResponse);
      }
      
      return response as InvoiceGetByIdResponse;
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to fetch invoice',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

// Async thunk for creating invoice
export const createInvoice = createAsyncThunk<
  InvoicePostResponse,
  InvoicePostRequest,
  { rejectValue: InvoicePostErrorResponse }
>(
  'billing/createInvoice',
  async (payload: InvoicePostRequest, { rejectWithValue }) => {
    try {
      const response: InvoicePostApiResponse = await invoiceApi.create(payload);
      
      if (!response.success) {
        return rejectWithValue(response as InvoicePostErrorResponse);
      }
      
      return response as InvoicePostResponse;
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to create invoice',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

// Async thunk for updating invoice
export const updateInvoice = createAsyncThunk<
  InvoicePostResponse,
  { id: string | number; payload: InvoicePostRequest },
  { rejectValue: InvoicePostErrorResponse }
>(
  'billing/updateInvoice',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response: InvoicePostApiResponse = await invoiceApi.update(id, payload);
      
      if (!response.success) {
        return rejectWithValue(response as InvoicePostErrorResponse);
      }
      
      return response as InvoicePostResponse;
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to update invoice',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

// Async thunk for deleting invoice
export const deleteInvoice = createAsyncThunk<
  InvoiceDeleteResponse & { deletedId: string | number },
  string | number,
  { rejectValue: InvoiceDeleteErrorResponse }
>(
  'billing/deleteInvoice',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response: InvoiceDeleteApiResponse = await invoiceApi.delete(id);
      
      if (!response.success) {
        return rejectWithValue(response as InvoiceDeleteErrorResponse);
      }
      
      return { ...(response as InvoiceDeleteResponse), deletedId: id };
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to delete invoice',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

// Async thunk for marking invoice as paid
export const markInvoiceAsPaid = createAsyncThunk<
  InvoicePostResponse,
  string | number,
  { rejectValue: InvoicePostErrorResponse }
>(
  'billing/markInvoiceAsPaid',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response: InvoicePostApiResponse = await invoiceApi.markAsPaid(id);
      
      if (!response.success) {
        return rejectWithValue(response as InvoicePostErrorResponse);
      }
      
      return response as InvoicePostResponse;
    } catch (error: any) {
      return rejectWithValue({
        success: false,
        message: error.message || 'Failed to mark invoice as paid',
        data: error.response?.data || 'Unknown error'
      });
    }
  }
);

interface BillingState {
  // Data
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  lastCreatedInvoice: InvoicePostResponse['data'] | null;
  lastUpdatedInvoice: InvoicePostResponse['data'] | null;
  totalCount: number;
  
  // Loading states
  isLoadingInvoices: boolean;
  isLoadingCurrentInvoice: boolean;
  isCreatingInvoice: boolean;
  isUpdatingInvoice: boolean;
  isDeletingInvoice: boolean;
  isMarkingAsPaid: boolean;
  
  // Error states
  getInvoicesError: string | null;
  getCurrentInvoiceError: string | null;
  createInvoiceError: string | null;
  updateInvoiceError: string | null;
  deleteInvoiceError: string | null;
  markAsPaidError: string | null;
  
  // Success states
  createInvoiceSuccess: boolean;
  updateInvoiceSuccess: boolean;
  deleteInvoiceSuccess: boolean;
  markAsPaidSuccess: boolean;
}

const initialState: BillingState = {
  // Data
  invoices: [],
  currentInvoice: null,
  lastCreatedInvoice: null,
  lastUpdatedInvoice: null,
  totalCount: 0,
  
  // Loading states
  isLoadingInvoices: false,
  isLoadingCurrentInvoice: false,
  isCreatingInvoice: false,
  isUpdatingInvoice: false,
  isDeletingInvoice: false,
  isMarkingAsPaid: false,
  
  // Error states
  getInvoicesError: null,
  getCurrentInvoiceError: null,
  createInvoiceError: null,
  updateInvoiceError: null,
  deleteInvoiceError: null,
  markAsPaidError: null,
  
  // Success states
  createInvoiceSuccess: false,
  updateInvoiceSuccess: false,
  deleteInvoiceSuccess: false,
  markAsPaidSuccess: false,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    // Clear all states
    clearAllStates: (state) => {
      return { ...initialState };
    },
    
    // Clear create invoice states
    clearCreateInvoiceState: (state) => {
      state.createInvoiceError = null;
      state.createInvoiceSuccess = false;
      state.lastCreatedInvoice = null;
    },
    
    // Clear update invoice states
    clearUpdateInvoiceState: (state) => {
      state.updateInvoiceError = null;
      state.updateInvoiceSuccess = false;
      state.lastUpdatedInvoice = null;
    },
    
    // Clear delete invoice states
    clearDeleteInvoiceState: (state) => {
      state.deleteInvoiceError = null;
      state.deleteInvoiceSuccess = false;
    },
    
    // Clear mark as paid states
    clearMarkAsPaidState: (state) => {
      state.markAsPaidError = null;
      state.markAsPaidSuccess = false;
    },
    
    // Clear current invoice
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
      state.getCurrentInvoiceError = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      state.getInvoicesError = null;
      state.getCurrentInvoiceError = null;
      state.createInvoiceError = null;
      state.updateInvoiceError = null;
      state.deleteInvoiceError = null;
      state.markAsPaidError = null;
    },
    
    // Clear specific errors
    clearGetInvoicesError: (state) => {
      state.getInvoicesError = null;
    },
    
    clearGetCurrentInvoiceError: (state) => {
      state.getCurrentInvoiceError = null;
    },
    
    clearCreateInvoiceError: (state) => {
      state.createInvoiceError = null;
    },
    
    clearUpdateInvoiceError: (state) => {
      state.updateInvoiceError = null;
    },
    
    clearDeleteInvoiceError: (state) => {
      state.deleteInvoiceError = null;
    },
    
    clearMarkAsPaidError: (state) => {
      state.markAsPaidError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Invoices
      .addCase(fetchAllInvoices.pending, (state) => {
        state.isLoadingInvoices = true;
        state.getInvoicesError = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action: PayloadAction<InvoiceGetResponse>) => {
        state.isLoadingInvoices = false;
        state.getInvoicesError = null;
        state.invoices = action.payload.data;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.isLoadingInvoices = false;
        if (action.payload) {
          state.getInvoicesError = action.payload.message;
        } else {
          state.getInvoicesError = action.error.message || 'Failed to fetch invoices';
        }
      })
      
      // Get Invoice By ID
      .addCase(getInvoiceById.pending, (state) => {
        state.isLoadingCurrentInvoice = true;
        state.getCurrentInvoiceError = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action: PayloadAction<InvoiceGetByIdResponse>) => {
        state.isLoadingCurrentInvoice = false;
        state.getCurrentInvoiceError = null;
        state.currentInvoice = action.payload.data;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.isLoadingCurrentInvoice = false;
        if (action.payload) {
          state.getCurrentInvoiceError = action.payload.message;
        } else {
          state.getCurrentInvoiceError = action.error.message || 'Failed to fetch invoice';
        }
      })
      
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
        // Add the new invoice to the list if it's not already there
        const existingIndex = state.invoices.findIndex(invoice => invoice._id === action.payload.data._id);
        if (existingIndex === -1) {
          state.invoices.unshift({
            ...action.payload.data,
            patientId: { _id: action.payload.data.patientId, fullName: '' }, // You might need to populate this properly
            providerId: { _id: action.payload.data.providerId, name: '' }, // You might need to populate this properly
          } as Invoice);
          state.totalCount += 1;
        }
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.isCreatingInvoice = false;
        state.createInvoiceSuccess = false;
        if (action.payload) {
          state.createInvoiceError = action.payload.message;
        } else {
          state.createInvoiceError = action.error.message || 'Failed to create invoice';
        }
      })
      
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.isUpdatingInvoice = true;
        state.updateInvoiceError = null;
        state.updateInvoiceSuccess = false;
      })
      .addCase(updateInvoice.fulfilled, (state, action: PayloadAction<InvoicePostResponse>) => {
        state.isUpdatingInvoice = false;
        state.updateInvoiceSuccess = true;
        state.updateInvoiceError = null;
        state.lastUpdatedInvoice = action.payload.data;
        // Update the invoice in the list
        const index = state.invoices.findIndex(invoice => invoice._id === action.payload.data._id);
        if (index !== -1) {
          state.invoices[index] = {
            ...state.invoices[index],
            ...action.payload.data,
            patientId: state.invoices[index].patientId, // Keep the populated patient data
            providerId: state.invoices[index].providerId, // Keep the populated provider data
          } as Invoice;
        }
        // Update current invoice if it's the same
        if (state.currentInvoice && state.currentInvoice._id === action.payload.data._id) {
          state.currentInvoice = {
            ...state.currentInvoice,
            ...action.payload.data,
          } as Invoice;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.isUpdatingInvoice = false;
        state.updateInvoiceSuccess = false;
        if (action.payload) {
          state.updateInvoiceError = action.payload.message;
        } else {
          state.updateInvoiceError = action.error.message || 'Failed to update invoice';
        }
      })
      
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.isDeletingInvoice = true;
        state.deleteInvoiceError = null;
        state.deleteInvoiceSuccess = false;
      })
      .addCase(deleteInvoice.fulfilled, (state, action: PayloadAction<InvoiceDeleteResponse & { deletedId: string | number }>) => {
        state.isDeletingInvoice = false;
        state.deleteInvoiceSuccess = true;
        state.deleteInvoiceError = null;
        // Remove the invoice from the list
        state.invoices = state.invoices.filter(invoice => invoice._id !== action.payload.deletedId);
        state.totalCount = Math.max(0, state.totalCount - 1);
        // Clear current invoice if it was deleted
        if (state.currentInvoice && state.currentInvoice._id === action.payload.deletedId) {
          state.currentInvoice = null;
        }
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.isDeletingInvoice = false;
        state.deleteInvoiceSuccess = false;
        if (action.payload) {
          state.deleteInvoiceError = action.payload.message;
        } else {
          state.deleteInvoiceError = action.error.message || 'Failed to delete invoice';
        }
      })
      
      // Mark Invoice as Paid
      .addCase(markInvoiceAsPaid.pending, (state) => {
        state.isMarkingAsPaid = true;
        state.markAsPaidError = null;
        state.markAsPaidSuccess = false;
      })
      .addCase(markInvoiceAsPaid.fulfilled, (state, action: PayloadAction<InvoicePostResponse>) => {
        state.isMarkingAsPaid = false;
        state.markAsPaidSuccess = true;
        state.markAsPaidError = null;
        // Update the invoice status in the list
        const index = state.invoices.findIndex(invoice => invoice._id === action.payload.data._id);
        if (index !== -1) {
          state.invoices[index] = {
            ...state.invoices[index],
            ...action.payload.data,
            patientId: state.invoices[index].patientId, // Keep the populated patient data
            providerId: state.invoices[index].providerId, // Keep the populated provider data
          } as Invoice;
        }
        // Update current invoice if it's the same
        if (state.currentInvoice && state.currentInvoice._id === action.payload.data._id) {
          state.currentInvoice = {
            ...state.currentInvoice,
            ...action.payload.data,
          } as Invoice;
        }
      })
      .addCase(markInvoiceAsPaid.rejected, (state, action) => {
        state.isMarkingAsPaid = false;
        state.markAsPaidSuccess = false;
        if (action.payload) {
          state.markAsPaidError = action.payload.message;
        } else {
          state.markAsPaidError = action.error.message || 'Failed to mark invoice as paid';
        }
      });
  },
});

export const { 
  clearAllStates,
  clearCreateInvoiceState, 
  clearUpdateInvoiceState,
  clearDeleteInvoiceState,
  clearMarkAsPaidState,
  clearCurrentInvoice,
  clearAllErrors,
  clearGetInvoicesError,
  clearGetCurrentInvoiceError,
  clearCreateInvoiceError,
  clearUpdateInvoiceError,
  clearDeleteInvoiceError,
  clearMarkAsPaidError
} = billingSlice.actions;

export default billingSlice.reducer;