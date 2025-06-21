import { FORMAT_OPTIONS } from '../constants';

/**
 * Format a number as currency with appropriate decimal places
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  compact: boolean = false
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    ...FORMAT_OPTIONS.CURRENCY,
  };

  if (compact && value >= 1000) {
    options.notation = FORMAT_OPTIONS.LARGE_NUMBER.notation;
    options.maximumFractionDigits = FORMAT_OPTIONS.LARGE_NUMBER.maximumFractionDigits;
  }

  return new Intl.NumberFormat('en-US', options).format(value);
};

/**
 * Format a percentage value
 */
export const formatPercentage = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    ...FORMAT_OPTIONS.PERCENTAGE,
  }).format(value / 100);
};

/**
 * Format large numbers with compact notation (1.2M, 1.5B, etc.)
 */
export const formatLargeNumber = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', FORMAT_OPTIONS.LARGE_NUMBER).format(value);
};

/**
 * Format time ago (1m, 1h, 1d, etc.)
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo`;
  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

/**
 * Truncate wallet address for display
 */
export const truncateAddress = (address: string, chars: number = 6): string => {
  if (!address || address.length <= chars * 2) {
    return address;
  }
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Validate wallet address format
 */
export const isValidAddress = (address: string): boolean => {
  // Basic validation for Solana addresses (base58, 32-44 chars)
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return solanaAddressRegex.test(address);
};

/**
 * Get color for percentage change
 */
export const getChangeColor = (change: number, colors: any): string => {
  if (change > 0) return colors.success;
  if (change < 0) return colors.error;
  return colors.textSecondary;
};

/**
 * Debounce function for search and other rapid calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function for scroll events and animations
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Check if value is a valid number
 */
export const isValidNumber = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

/**
 * Clamp a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Convert string to title case
 */
export const toTitleCase = (str: string): string => {
  return str.toLowerCase().replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};