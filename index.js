/**
 * ValifyJS - A lightweight validation and auto-formatting library
 */

const Valify = {
  // ==========================================
  // 1. VALIDATION RULES
  // ==========================================
  required: (value) => value !== undefined && value !== null && String(value).trim() !== '',
  minLength: (value, min) => String(value).length >= min,
  maxLength: (value, max) => String(value).length <= max,

  email: (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(value));
  },
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch (_) {
      return false;
    }
  },

  cnic: (value) => /^\d{5}-\d{7}-\d{1}$/.test(String(value)),
  phone: (value) => /^\+?[0-9\s\-()]{7,15}$/.test(String(value).trim()),

  number: (value) => typeof value === 'number' && !isNaN(value),
  range: (value, min, max) => typeof value === 'number' && value >= min && value <= max,

  date: (value) => {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d);
  },
  futureDate: (value) => {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d) && d > new Date();
  },
  pastDate: (value) => {
    const d = new Date(value);
    return d instanceof Date && !isNaN(d) && d < new Date();
  },
  dateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return false;
    return start <= end;
  },
  time24: (value) => /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/.test(String(value)),
  time12: (value) => /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM|[am|pm]+)$/i].test(String(value)),

  strongPassword: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(String(value)),
  creditCard: (value) => {
    const num = String(value).replace(/\D/g, '');
    if (!num || num.length < 13 || num.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  },

  // ==========================================
  // 2. AUTO-FORMATTERS (Strict Maximum Length Caps)
  // ==========================================
  format: {
    // Limits and formats to exactly 13 digits (15 characters total: XXXXX-XXXXXXX-X)
    cnic: (value) => {
      let v = String(value).replace(/\D/g, '').substring(0, 13);
      if (v.length > 5 && v.length <= 12) {
        v = `${v.substring(0, 5)}-${v.substring(5)}`;
      } else if (v.length > 12) {
        v = `${v.substring(0, 5)}-${v.substring(5, 12)}-${v.substring(12, 13)}`;
      }
      return v;
    },

    // Strict formatting for Pakistani phone numbers, capped at 11 or 12 digits (+92 XXX XXXXXXX)
    phone: (value) => {
      let v = String(value).trim();
      if (!v) return '';

      // Strip everything except numbers and '+' sign
      v = v.replace(/[^\d+]/g, '');

      // Check if it's attempting a Pakistani format
      const isPak = v.startsWith('+92') || v.startsWith('92') || v.startsWith('03') || v.startsWith('3');
      
      if (!isPak) {
        // Fallback for general international strings: just limit length to 15 characters total
        return v.substring(0, 15); 
      }

      let digits = v.replace(/\D/g, '');

      // Standardize input prefix to 92
      if (digits.startsWith('03')) digits = '92' + digits.substring(1);
      if (digits.startsWith('3')) digits = '92' + digits;
      if (!digits.startsWith('92') && digits.length > 0) digits = '92' + digits;

      // Absolute limit to standard PK number length (92 + 10 digits = 12 total digits max)
      digits = digits.substring(0, 12); 

      if (digits.length > 5) {
        return `+${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
      } else if (digits.length > 2) {
        return `+${digits.substring(0, 2)} ${digits.substring(2)}`;
      }
      return digits.length > 0 ? `+${digits}` : '';
    },

    // Formats credit card text into 4-digit groups, strictly capped at 16 digits
    creditCard: (value) => {
      let v = String(value).replace(/\D/g, '').substring(0, 16);
      let matches = v.match(/\d{1,4}/g);
      return matches ? matches.join(' ') : v;
    },

    // Blocks non-numeric keys completely for general numeric setups
    numericOnly: (value) => {
      return String(value).replace(/\D/g, '');
    }
  }
};

if (typeof window !== 'undefined') {
  window.Valify = Valify;
}
