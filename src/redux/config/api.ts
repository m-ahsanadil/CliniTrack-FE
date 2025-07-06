// CliniTrack API Endpoints Constants

export const ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        REGISTER: `/auth/register`, // POST
        SUPER_ADMIN_LOGIN: '/auth/super-admin/login', //POST
        LOGIN: `/auth/login`, // POST
        GET_PHOTO: (id: string | number) => `/auth/photo/${id}`,
        UPDATE: '/auth/profile',
        UPLOAD_PHOTO: '/auth/upload-photo',
    },

    DASHBOARD: {
        GET_SUPER_ADMIN: '/dashboards/super-admin', // GET
        CREATE_SUPER_ADMIN: '/dashboards/super-admin/create', // POST
        UPDATE_SUPER_ADMIN: (id: string | number) => `/dashboards/super-admin/users/${id}/password`, // UPDATE PASSWORD FOR ADMIN
        GET_SUPER_ADMIN_USER: '/dashboards/super-admin/users', // GET ADMIN USERS BY SUPER ADMIN

        GET_ADMIN: '/dashboards/admin',
        GET_DOCTOR: '/dashboards/doctor',
        GET_STAFF: '/dashboards/staff',
        GET_STATS: '/dashboards/stats',
        GET_COUNT: '/dashboards/count'
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
        GET_SELECTED: '/medical-records/patients-providers', // GET
    },

    // Patient endpoints
    PATIENT: {
        GET_ALL: `/patients`, // GET
        GET_BY_ID: (id: string | number) => `/patients/${id}`, // GET
        CREATE: `/patients`, // POST
        UPDATE: (id: string | number) => `/patients/${id}`, // PUT
        DELETE: (id: string | number) => `/patients/${id}`, // DELETE
        GET_PATIENT_NAME: '/patients/names/patient' // GET
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
        GET_ALL: `/appointments`, // GET
        GET_BY_ID: (id: string | number) => `/appointments/${id}`, // GET
        CREATE: `/appointments`, // POST
        UPDATE: (id: string | number) => `/appointments/${id}`, // PUT
        CANCEL_APPOINTMENT: (id: string | number) => `/appointments/${id}/cancel`, //PATCH
        RESCHEDULE_APPOINTMENT: (id: string | number) => `/appointments/${id}/reschedule`, //PATCH
        DELETE: (id: string | number) => `/appointments/${id}`, // DELETE
    },


} as const;