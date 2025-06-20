const setCookie = (name: string, value: string, days = 7) => {
         if (typeof window === 'undefined') return false;
         try {
                  const expires = new Date(Date.now() + days * 864e5).toUTCString();
                  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
                  return true;
         } catch (error) {
                  console.warn('Cookie set error:', error);
                  return false;
         }
};

const getCookie = (name: string) => {
         if (typeof window === 'undefined') return null; 
         try {
                  const value = `; ${document.cookie}`;
                  const parts = value.split(`; ${name}=`);
                  if (parts.length === 2) {
                           const part = parts.pop();
                           if (!part) return null;
                           return decodeURIComponent(part.split(';').shift() || '');
                  }
                  return null;
         } catch (error) {
                  console.warn('Cookie get error:', error);
                  return null;
         }
};

const deleteCookie = (name: string) => {
         if (typeof window === 'undefined') return false; 
         try {
                  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
                  return true;
         } catch (error) {
                  console.warn('Cookie delete error:', error);
                  return false;
         }
};

// Memory storage fallback (in-memory object that persists during the session)
const memoryStorage: Record<string, string> = {};

// Storage interface with multiple fallbacks
const reduxStorage = {
         async getItem(key: string): Promise<string | null> {
                  try {
                           // Try localStorage first
                           if (typeof window !== 'undefined' && window.localStorage) {
                                    const value = localStorage.getItem(key);
                                    if (value !== null) {
                                             return value;
                                    }
                           }
                  } catch (error) {
                           console.warn('localStorage access error:', error);
                  }

                  try {
                           // Try sessionStorage second
                           if (typeof window !== 'undefined' && window.sessionStorage) {
                                    const value = sessionStorage.getItem(key);
                                    if (value !== null) {
                                             return value;
                                    }
                           }
                  } catch (error) {
                           console.warn('sessionStorage access error:', error);
                  }

                  // Try cookies third
                  const cookieValue = getCookie(key);
                  if (cookieValue) {
                           return cookieValue;
                  }

                  // Finally, use memory storage
                  return memoryStorage[key] || null;
         },

         async setItem(key: string, value: string): Promise<boolean> {
                  let success = false;

                  try {
                           // Try localStorage
                           if (typeof window !== 'undefined' && window.localStorage) {
                                    localStorage.setItem(key, value);
                                    success = true;
                           }
                  } catch (error) {
                           console.warn('localStorage set error:', error);
                  }

                  try {
                           // Try sessionStorage
                           if (typeof window !== 'undefined' && window.sessionStorage) {
                                    sessionStorage.setItem(key, value);
                                    success = true;
                           }
                  } catch (error) {
                           console.warn('sessionStorage set error:', error);
                  }

                  // Set cookie as additional fallback
                  const cookieSuccess = setCookie(key, value);

                  // Always update memory storage
                  memoryStorage[key] = value;

                  return success || cookieSuccess || true; // memory storage always works
         },

         async removeItem(key: string): Promise<boolean> {
                  let success = false;

                  try {
                           // Try localStorage
                           if (typeof window !== 'undefined' && window.localStorage) {
                                    localStorage.removeItem(key);
                                    success = true;
                           }
                  } catch (error) {
                           console.warn('localStorage remove error:', error);
                  }

                  try {
                           // Try sessionStorage
                           if (typeof window !== 'undefined' && window.sessionStorage) {
                                    sessionStorage.removeItem(key);
                                    success = true;
                           }
                  } catch (error) {
                           console.warn('sessionStorage remove error:', error);
                  }

                  // Remove from cookie
                  const cookieSuccess = deleteCookie(key);

                  // Always remove from memory storage
                  delete memoryStorage[key];

                  return success || cookieSuccess || true; // memory storage always works
         }
};

export default reduxStorage;