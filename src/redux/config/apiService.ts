import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { BASE_URI, VERSION, API_TIMEOUT } from "../constants";
import { persistor, store } from '../store/store';
import { logout } from '@/src/modules/Authentication/auth/api/slice';


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
                const state = store.getState();
                const token = state.auth.token

                if (token) {
                    config.headers = config.headers || {}
                    config.headers.Authorization = `Bearer ${token}`
                }

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

                console.log('🚀 API Request:', {
                    method: config.method?.toUpperCase(),
                    url: config.url,
                    baseURL: config.baseURL,
                    fullURL: `${config.baseURL}${config.url}`,
                    headers: config.headers,
                });

                return config;
            },
            (error) => {
                console.error('❌ Request Interceptor Error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for API calls
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`📥 ${response.status} ${response.config.url}`, response.data);
                }
                return response
            },
            async (error: AxiosError) => {
                console.log('❌ Axios Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    message: error.message || error.message,
                    data: error.response?.data,
                });
                // Handle 401 Unauthorized errors - Auto logout
                if (error.response?.status === 401) {
                    await this.handleUnauthorized();
                }

                return Promise.reject(error);
            }
        );
    }

    private async handleUnauthorized() {
        try {
            console.log('🚪 Unauthorized access detected, logging out user...');

            // Dispatch logout action
            store.dispatch(logout());

            // Clear persisted state
            if (persistor) {
                await persistor.purge();
            }

            // Redirect to login page
            // Note: You might need to handle routing differently based on your setup
            if (typeof window !== 'undefined') {
                window.location.href = '/';
                // Or if using Next.js router:
                // const { default: Router } = await import('next/router');
                // Router.push('/');
            }

        } catch (logoutError) {
            console.error('Error during auto logout:', logoutError);
        }
    }

    private formatError(error: AxiosError) {
        const errorInfo = {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
            responseData: error.response?.data,
            requestData: error.config?.data,
            headers: error.config?.headers,
        };

        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            errorInfo.message = 'Request timeout - Server took too long to respond';
        } else if (error.code === 'ERR_NETWORK') {
            errorInfo.message = 'Network error - Check your internet connection or server status';
        } else if (error.code === 'ERR_CANCELED') {
            errorInfo.message = 'Request was canceled';
        } else if (!error.response) {
            errorInfo.message = 'No response from server - Server might be down';
        }

        return errorInfo;
    }

    private async handleRequest<T>(requestFn: () => Promise<AxiosResponse<T>>): Promise<T> {
        try {
            const response = await requestFn();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const formattedError = this.formatError(error);
                console.log('❌ Axios Error Details:', formattedError);


                // Create a more informative error that preserves the API response message
                let errorMessage = formattedError.message;

                // Check if there's a message in the response data (your API error message)
                if (error.response?.data && typeof error.response.data === 'object') {
                    const responseData = error.response.data as any;
                    if (responseData.message) {
                        errorMessage = responseData.message;
                    }
                }

                const enhancedError = new Error(errorMessage);

                // Attach additional error information
                (enhancedError as any).axiosError = formattedError;
                (enhancedError as any).response = error.response;
                (enhancedError as any).responseData = error.response?.data;
                (enhancedError as any).status = error.response?.status;
                (enhancedError as any).statusText = error.response?.statusText;

                throw enhancedError;
            } else {
                console.error('❌ Non-Axios Error:', error);
                throw error;
            }
        }
    }

    // HTTP method helpers
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.handleRequest(() => this.axiosInstance.get<T>(url, config));
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.handleRequest(() => this.axiosInstance.post<T>(url, data, config));
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.handleRequest(() => this.axiosInstance.put<T>(url, data, config));
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.handleRequest(() => this.axiosInstance.delete<T>(url, config));
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.handleRequest(() => this.axiosInstance.patch<T>(url, data, config));
    }
    async downloadFile(url: string, config: AxiosRequestConfig = {}): Promise<Blob> {
        try {
            const response = await this.axiosInstance.get<Blob>(url, {
                ...config,
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const formattedError = this.formatError(error);
                console.error('❌ Download Error:', formattedError);

                const enhancedError = new Error(formattedError.message);
                (enhancedError as any).axiosError = formattedError;
                throw enhancedError;
            }
            throw error;
        }
    }

    // Utility method to check if server is reachable
    async healthCheck(): Promise<boolean> {
        try {
            const response = await this.axiosInstance.get('/health', { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            console.error('❌ Health check failed:', this.formatError(error as AxiosError));
            return false;
        }
    }

    // Get current configuration for debugging
    getConfig() {
        return {
            baseURL: `${BASE_URI}${VERSION}`,
            timeout: API_TIMEOUT,
            timestamp: new Date().toISOString(),
        };
    }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;

// You can also export the class if you need multiple instances
export { ApiService };