export const sanitizeText = (value) => value.trim().replace(/\s+/g, ' ');

export const sanitizeEmail = (value) => value.trim().toLowerCase();

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const getApiError = (error, fallback) => {
  const details = error.response?.data?.details;

  if (Array.isArray(details) && details.length > 0) {
    return details.map((item) => item.message).join(', ');
  }

  return error.response?.data?.error || fallback;
};
