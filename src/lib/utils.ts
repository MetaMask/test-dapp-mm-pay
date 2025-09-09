/* eslint-disable jsdoc/match-description */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Address } from 'viem';

import dynamicIcon from '../assets/dynamic-icon.svg';
import privyIcon from '../assets/privy-icon.png';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trims a number or number string to appropriate decimal places
 * @param value - The number or string to trim
 * @returns Trimmed number as a string
 */
export function trimNumber(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  // Handle invalid numbers
  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return '0.00';
  }

  // Handle zero
  if (numericValue === 0) {
    return '0.00';
  }

  // Handle negative numbers by working with absolute value
  const isNegative = numericValue < 0;
  const absoluteValue = Math.abs(numericValue);

  let result: string;

  if (absoluteValue >= 1) {
    // For numbers >= 1, trim to 2 decimal places
    result = absoluteValue.toFixed(2);
  } else {
    // For numbers < 1, find 4 significant decimal places
    result = formatSmallNumber(absoluteValue);
  }

  return isNegative ? `-${result}` : result;
}

/**
 * Formats small numbers (< 1) to show 4 significant decimal places
 * @param absoluteValue - The absolute value of the number to format
 * @returns Formatted number string with appropriate decimal places
 */
function formatSmallNumber(absoluteValue: number): string {
  const stringValue = absoluteValue.toString();

  if (stringValue.includes('e')) {
    // Handle scientific notation
    return formatScientificNotation(absoluteValue);
  }

  // Regular decimal number
  const decimalPart = stringValue.split('.')[1] ?? '';
  let significantCount = 0;
  let endIndex = 0;

  for (let i = 0; i < decimalPart.length; i += 1) {
    if (decimalPart[i] !== '0') {
      significantCount += 1;
      endIndex = i + 1;
      if (significantCount === 4) {
        break;
      }
    } else if (significantCount > 0) {
      // Count zeros after we've found significant digits
      significantCount += 1;
      endIndex = i + 1;
      if (significantCount === 4) {
        break;
      }
    }
  }

  if (significantCount === 0) {
    return '0.0000';
  }

  // Ensure we have at least 4 decimal places for display
  const trimmedDecimal = decimalPart.substring(0, Math.max(endIndex, 4));
  return `0.${trimmedDecimal.padEnd(4, '0')}`;
}

/**
 * Formats numbers in scientific notation to show 4 significant decimal places
 * @param absoluteValue - The absolute value of the number to format
 * @returns Formatted number string
 */
function formatScientificNotation(absoluteValue: number): string {
  const formatted = absoluteValue.toFixed(20); // Get enough precision
  const match = formatted.match(/^0\.0*([1-9]\d{0,3})/u);

  if (match?.[1] && match[1].length > 0) {
    const significantPart = match[1];
    const firstChar = significantPart.charAt(0);
    const firstDigitIndex = formatted.indexOf(firstChar);
    const leadingZeros = firstDigitIndex > 0 ? firstDigitIndex - 2 : 0; // -2 for "0."
    return `0.${'0'.repeat(Math.max(0, leadingZeros))}${significantPart}`;
  }

  return '0.0000';
}

export function trimAddress(address?: string | Address, length = 4) {
  if (!address) {
    return '';
  }
  return `${address.slice(0, 2 + length)}...${address.slice(-Math.abs(length))}`;
}

export function getChainLogo(chainId: number) {
  return `https://raw.githubusercontent.com/SmolDapp/tokenAssets/main/chains/${chainId}/logo-128.png`;
}

export function getConnectorLogo(name: string) {
  return name.includes('Dynamic') ? dynamicIcon : privyIcon;
}

const permissionMessages = {
  hasBalance: 'Insufficient balance',
  isWrongChain: 'Switch to the correct network',
};

/**
 * Filters an object of boolean values and returns an array of mapped strings where the value is true
 * @param booleanMap - Object where keys are strings and values are booleans
 * @param stringMap - Object that maps the same keys to their corresponding string values
 * @returns Array of mapped strings where the corresponding boolean value is true
 */
export function getErrorMessages<T extends Record<string, boolean>>(
  booleanMap: T,
  stringMap: Record<keyof T, string> = permissionMessages as Record<
    keyof T,
    string
  >,
): string[] {
  return Object.entries(booleanMap)
    .filter(([, value]) => value)
    .map(([key]) => stringMap[key as keyof T]);
}
