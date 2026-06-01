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
  // 2. AUTO-FORMATTERS (Transforms raw strings instantly)
  // ==========================================
  format: {
    // Converts input into 42101-1234567-1 format dynamically
    cnic: (value) => {
      let v = String(value).replace(/\D/g, '').substring(0, 13);
      if (v.length > 5 && v.length <= 12) {
        v = `${v.substring(0, 5)}-${v.substring(5)}`;
      } else if (v.length > 12) {
        v = `${v.substring(0, 5)}-${v.substring(5, 12)}-${v.substring(12, 13)}`;
      }
      return v;
    },

    // Forces Pakistani phone number into standard block spacings +92 3XX XXXXXXX
    phone: (value) => {
      let v = String(value);
      const isPak = v.startsWith('+92') || v.startsWith('92') || v.startsWith('03');
      
      if (!isPak) return v; // Leave international numbers raw

      let digits = v.replace(/\D/g, '');
      if (digits.startsWith('03')) digits = '92' + digits.substring(1);
      if (!digits.startsWith('92')) digits = '92' + digits;
      
      digits = digits.substring(0, 12); // Limit to standard count

      if (digits.length > 5) {
        return `+${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
      } else if (digits.length > 2) {
        return `+${digits.substring(0, 2)} ${digits.substring(2)}`;
      }
      return digits.length > 0 ? `+${digits}` : '';
    },

    // Formats credit card text into 4-digit numeric chunks (XXXX XXXX XXXX XXXX)
    creditCard: (value) => {
      let v = String(value).replace(/\D/g, '').substring(0, 16);
      let matches = v.match(/\d{1,4}/g);
      return matches ? matches.join(' ') : v;
    },

    // Formats numbers automatically to raw digits only
    numericOnly: (value) => {
      return String(value).replace(/\D/g, '');
    }
  }
};

if (typeof window !== 'undefined') {
  window.Valify = Valify;
}
