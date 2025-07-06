interface PatientIdGeneratorConfig {
  clinicCode?: string;
  storageKey?: string;
}

class PatientIdGenerator {
  private clinicCode: string;
  private storageKey: string;

  constructor(config: PatientIdGeneratorConfig = {}) {
    this.clinicCode = config.clinicCode || "CLINICS";
    this.storageKey = config.storageKey || 'patientCounter';
  }
  
  // Generate new patient ID
  generate(): string {
    try {
      // Get current counter from localStorage
      const currentCount = parseInt(localStorage.getItem(this.storageKey) || '0');
      const newCount = currentCount + 1;
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, newCount.toString());
      
      // Generate ID with current date
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const sequence = newCount.toString().padStart(4, '0');
      
      return `P-${year}${month}-${sequence}-${this.clinicCode}`;
    } catch (error) {
      console.error('Error generating patient ID:', error);
      // Fallback ID if localStorage fails
      return `P-${Date.now()}-${this.clinicCode}`;
    }
  }
  
  // Get current counter value
  getCurrentCounter(): number {
    return parseInt(localStorage.getItem(this.storageKey) || '0');
  }
  
  // Reset counter (use at month/year end)
  resetCounter(): boolean {
    try {
      localStorage.setItem(this.storageKey, '0');
      return true;
    } catch (error) {
      console.error('Error resetting counter:', error);
      return false;
    }
  }
  
  // Set counter to specific value
  setCounter(value: number): boolean {
    try {
      if (value < 0) {
        throw new Error('Counter value must be non-negative');
      }
      localStorage.setItem(this.storageKey, value.toString());
      return true;
    } catch (error) {
      console.error('Error setting counter:', error);
      return false;
    }
  }
  
  // Preview next ID without generating
  previewNextId(): string {
    const currentCount = parseInt(localStorage.getItem(this.storageKey) || '0');
    const nextCount = currentCount + 1;
    
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const sequence = nextCount.toString().padStart(4, '0');
    
    return `P-${year}${month}-${sequence}-${this.clinicCode}`;
  }

  // Get clinic code
  getClinicCode(): string {
    return this.clinicCode;
  }

  // Update clinic code
  setClinicCode(newClinicCode: string): void {
    this.clinicCode = newClinicCode;
  }

  // Validate patient ID format
  static validatePatientId(patientId: string): boolean {
    const pattern = /^P-\d{4}-\d{4}-[A-Z0-9]+$/;
    return pattern.test(patientId);
  }

  // Parse patient ID to get information
  static parsePatientId(patientId: string): {
    isValid: boolean;
    year?: number;
    month?: number;
    sequence?: number;
    clinicCode?: string;
  } {
    if (!this.validatePatientId(patientId)) {
      return { isValid: false };
    }

    const parts = patientId.split('-');
    if (parts.length !== 4) {
      return { isValid: false };
    }

    const [, yearMonth, sequence, clinicCode] = parts;
    const year = 2000 + parseInt(yearMonth.slice(0, 2));
    const month = parseInt(yearMonth.slice(2, 4));

    return {
      isValid: true,
      year,
      month,
      sequence: parseInt(sequence),
      clinicCode
    };
  }
}

// Export singleton instance
const patientIdGenerator = new PatientIdGenerator({ clinicCode: "CLINICS" });

export default patientIdGenerator;

// Export class for custom instances
export { PatientIdGenerator };

// Export types
export type { PatientIdGeneratorConfig };