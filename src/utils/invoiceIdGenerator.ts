interface InvoiceIdGeneratorConfig {
  prefix?: string;
  storageKey?: string;
  resetPeriod?: 'monthly' | 'yearly';
}

class InvoiceIdGenerator {
  private prefix: string;
  private storageKey: string;
  private resetPeriod: 'monthly' | 'yearly';

  constructor(config: InvoiceIdGeneratorConfig = {}) {
    this.prefix = config.prefix || "INV";
    this.storageKey = config.storageKey || 'invoiceCounter';
    this.resetPeriod = config.resetPeriod || 'yearly';
  }
  
  // Generate new invoice ID
  generate(): string {
    try {
      const currentPeriod = this.getCurrentPeriod();
      const lastPeriod = localStorage.getItem(`${this.storageKey}_period`);
      
      // Reset counter if period changed
      if (lastPeriod !== currentPeriod) {
        this.resetCounter();
        localStorage.setItem(`${this.storageKey}_period`, currentPeriod);
      }
      
      // Get current counter
      const currentCount = parseInt(localStorage.getItem(this.storageKey) || '0');
      const newCount = currentCount + 1;
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, newCount.toString());
      
      // Generate ID with current year
      const today = new Date();
      const year = today.getFullYear();
      const sequence = newCount.toString().padStart(5, '0');
      
      return `${this.prefix}-${year}-${sequence}`;
    } catch (error) {
      console.error('Error generating invoice ID:', error);
      // Fallback ID if localStorage fails
      const year = new Date().getFullYear();
      return `${this.prefix}-${year}-${Date.now().toString().slice(-5)}`;
    }
  }
  
  // Get current period string
  private getCurrentPeriod(): string {
    const today = new Date();
    if (this.resetPeriod === 'yearly') {
      return today.getFullYear().toString();
    } else {
      return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  }
  
  // Get current counter value
  getCurrentCounter(): number {
    return parseInt(localStorage.getItem(this.storageKey) || '0');
  }
  
  // Reset counter
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
    const year = today.getFullYear();
    const sequence = nextCount.toString().padStart(5, '0');
    
    return `${this.prefix}-${year}-${sequence}`;
  }

  // Get prefix
  getPrefix(): string {
    return this.prefix;
  }

  // Update prefix
  setPrefix(newPrefix: string): void {
    this.prefix = newPrefix;
  }

  // Get reset period
  getResetPeriod(): 'monthly' | 'yearly' {
    return this.resetPeriod;
  }

  // Set reset period
  setResetPeriod(period: 'monthly' | 'yearly'): void {
    this.resetPeriod = period;
  }

  // Validate invoice ID format
  static validateInvoiceId(invoiceId: string): boolean {
    const pattern = /^[A-Z]+-\d{4}-\d{5}$/;
    return pattern.test(invoiceId);
  }

  // Parse invoice ID to get information
  static parseInvoiceId(invoiceId: string): {
    isValid: boolean;
    prefix?: string;
    year?: number;
    sequence?: number;
  } {
    if (!this.validateInvoiceId(invoiceId)) {
      return { isValid: false };
    }

    const parts = invoiceId.split('-');
    if (parts.length !== 3) {
      return { isValid: false };
    }

    const [prefix, yearStr, sequenceStr] = parts;
    const year = parseInt(yearStr);
    const sequence = parseInt(sequenceStr);

    return {
      isValid: true,
      prefix,
      year,
      sequence
    };
  }

  // Get current period info
  getCurrentPeriodInfo(): {
    period: string;
    year: number;
    month?: number;
    resetPeriod: 'monthly' | 'yearly';
  } {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    
    return {
      period: this.getCurrentPeriod(),
      year,
      month: this.resetPeriod === 'monthly' ? month : undefined,
      resetPeriod: this.resetPeriod
    };
  }

  // Force period reset (for admin use)
  forcePeriodReset(): boolean {
    try {
      const currentPeriod = this.getCurrentPeriod();
      localStorage.setItem(`${this.storageKey}_period`, currentPeriod);
      this.resetCounter();
      return true;
    } catch (error) {
      console.error('Error forcing period reset:', error);
      return false;
    }
  }
}

// Export singleton instances for different invoice types
const invoiceIdGenerator = new InvoiceIdGenerator({ 
  prefix: "INV",
  resetPeriod: 'yearly'
});

const receiptIdGenerator = new InvoiceIdGenerator({ 
  prefix: "RCP",
  storageKey: 'receiptCounter',
  resetPeriod: 'yearly'
});

const quotationIdGenerator = new InvoiceIdGenerator({ 
  prefix: "QUO",
  storageKey: 'quotationCounter',
  resetPeriod: 'yearly'
});

export default invoiceIdGenerator;

// Export other generators
export { receiptIdGenerator, quotationIdGenerator };

// Export class for custom instances
export { InvoiceIdGenerator };

// Export types
export type { InvoiceIdGeneratorConfig };