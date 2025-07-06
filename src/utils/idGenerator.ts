export interface PatientIdOptions {
  prefix?: string;      // e.g., "P" or "PT"
  suffix?: string;      // e.g., "CLINICS" or "MAIN"
  useRandom?: boolean;  // default true, if false can later allow sequence
}


export function generateId(options: PatientIdOptions = {}): string {
  const {
    prefix = "P",           // default prefix
    suffix = "CLINICS",     // default suffix
    useRandom = true        // default to random
  } = options;

  const today = new Date();
  const year = today.getFullYear().toString().slice(-2); 
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); 

  const randomNumber = useRandom
    ? Math.floor(1000 + Math.random() * 9000)
    : 1; // or handle sequence logic later

  return `${prefix}-${year}${month}-${randomNumber}-${suffix}`;
}
