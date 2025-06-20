import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { BASE_URI, VERSION, API_TIMEOUT } from "../constants";

class ApiService {
    private axiosInstance: AxiosInstance;


    constructor() {
        // Create axios instance
        this.axiosInstance = axios.create({
            baseURL: `${BASE_URI}${VERSION}`,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        this.setupInterceptors()

    }

    private setupInterceptors() {
        // Request interceptor for API calls
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // const state = store.getState();
                // const token = state.login.user?.token;

                // if (token) {
                //     config.headers = config.headers || {}
                //     config.headers.Authorization = `Bearer ${token}`
                // }

                // Handle FormData content type
                if (config.data instanceof FormData) {
                    config.headers = config.headers || {}
                    config.headers['Content-Type'] = 'multipart/form-data'
                }

                // Add timestamp for cache busting if needed
                if (config.params?.bustCache) {
                    config.params._t = Date.now()
                    delete config.params.bustCache
                }

                console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data)

                return config;
            },
            (error) => {
                console.error('Request interceptor error:', error)
                return Promise.reject(error)
            }
        );

        // Response interceptor for API calls
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log(`📥 ${response.status} ${response.config.url}`, response.data)
                return response
            },
            async (error: AxiosError) => {
                const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

                // Handle 401 Unauthorized errors
                if (error.response?.status === 401 && !originalRequest._retry) {
                    // Could implement token refresh logic here
                    // originalRequest._retry = true;
                    // After refreshing token, retry the original request
                }

                return Promise.reject(error);
            }
        );
    }

    // HTTP method helpers
    async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            // throw error as CustomApiError;
            throw error;
        }
    }

    async post<T>(url: string, data?: unknown, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.post<T>(url, data, config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async put<T>(url: string, data?: unknown, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.put<T>(url, data, config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.delete<T>(url, config);
            console.log(response.data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async patch<T>(url: string, data?: unknown, config: AxiosRequestConfig = {}): Promise<T> {
        try {
            const response = await this.axiosInstance.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async downloadFile(url: string, config: AxiosRequestConfig = {}): Promise<Blob> {
        try {
            const response = await this.axiosInstance.get<Blob>(url, {
                ...config,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    private handleError(error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(error);
            throw {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                data: error.response?.data
            };
        }
        throw error;
    }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// You can also export the class if you need multiple instances
export { ApiService };