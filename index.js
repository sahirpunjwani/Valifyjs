/**
 * ValifyJS - A lightweight validation library
 */

const Valify = {
  // 1. Text & Basic Validations
  required: (value) => value !== undefined && value !== null && String(value).trim() !== '',
  minLength: (value, min) => String(value).length >= min,
  maxLength: (value, max) => String(value).length <= max,

  // 2. Format Validations
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

  // 3. Regional & Input Validations
  // CNIC Format: 5 digits, hyphen, 7 digits, hyphen, 1 digit (e.g., 42101-1234567-1)
  cnic: (value) => {
    const regex = /^\d{5}-\d{7}-\d{1}$/;
    return regex.test(String(value));
  },

  // Phone Number Format: Supports standard local formats, spaces, dashes, or global E.164 (+1234567890)
  phone: (value) => {
    const regex = /^\+?[0-9\s\-()]{7,15}$/;
    return regex.test(String(value).trim());
  },

  // 4. Number Validations
  number: (value) => typeof value === 'number' && !isNaN(value),
  range: (value, min, max) => typeof value === 'number' && value >= min && value <= max,

  // 5. Date & Time Validations
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
  // Date Picker Range Validation (Ensures a start date picker is before an end date picker)
  dateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || !Valify.date(startDate)) return false;
    if (isNaN(end) || !Valify.date(endDate)) return false;
    return start <= end;
  },
  time24: (value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
    return regex.test(String(value));
  },
  time12: (value) => {
    const regex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM|[am|pm]+)$/i;
    return regex.test(String(value));
  },

  // 6. Security & Finance Validations
  strongPassword: (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(String(value));
  },
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
  }
};

if (typeof window !== 'undefined') {
  window.Valify = Valify;
}

export default Valify;
