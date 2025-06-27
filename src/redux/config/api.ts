// CliniTrack API Endpoints Constants

export const ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: `/auth/register`, // POST
        LOGIN: `/auth/login`, // POST
    },

    // Invoice endpoints
    INVOICE: {
        GET_ALL: `/invoices`, // GET
        GET_BY_ID: (id: string | number) => `/invoices/${id}`, // GET
        CREATE: `/invoices`, // POST
        UPDATE: (id: string | number) => `/invoices/${id}`, // PUT
        DELETE: (id: string | number) => `/invoices/${id}`, // DELETE
        MARK_PAID: (id: string | number) => `/invoices/${id}/pay`, // PATCH
    },

    // Medical Records endpoints
    MEDICAL_RECORDS: {
        GET_ALL: `/medical-records`, // GET
        GET_BY_ID: (id: string | number) => `/medical-records/${id}`, // GET
        CREATE: `/medical-records`, // POST
        UPDATE: (id: string | number) => `/medical-records/${id}`, // PUT
        DELETE: (id: string | number) => `/medical-records/${id}`, // DELETE
    },

    // Patient endpoints
    PATIENT: {
        GET_ALL: `/patients`, // GET
        GET_BY_ID: (id: string | number) => `/patients/${id}`, // GET
        CREATE: `/patients`, // POST
        UPDATE: (id: string | number) => `/patients/${id}`, // PUT
        DELETE: (id: string | number) => `/patients/${id}`, // DELETE
    },

    // Provider endpoints
    PROVIDER: {
        GET_ALL: `/providers`, // GET
        GET_BY_ID: (id: string | number) => `/providers/${id}`, // GET
        CREATE: `/providers`, // POST
        UPDATE: (id: string | number) => `/providers/${id}`, // PUT
        DELETE: (id: string | number) => `/providers/${id}`, // DELETE
    },

    // Report endpoints
    REPORT: {
        GET_ALL: `/reports`, // GET
        GET_BY_ID: (id: string | number) => `/reports/${id}`, // GET
        CREATE: `/reports`, // POST
        UPDATE: (id: string | number) => `/reports/${id}`, // PUT
        DELETE: (id: string | number) => `/reports/${id}`, // DELETE
    },

    // Appointment endpoints
    APPOINTMENT: {
        GET_COUNT: `/appointments/count`,
        GET_STATS: `/appointments/stats`,
        GET_ALL: `/appointments`, // GET
        GET_BY_ID: (id: string | number) => `/appointments/${id}`, // GET
        CREATE: `/appointments`, // POST
        UPDATE: (id: string | number) => `/appointments/${id}`, // PUT
        DELETE: (id: string | number) => `/appointments/${id}`, // DELETE
    },


} as const;