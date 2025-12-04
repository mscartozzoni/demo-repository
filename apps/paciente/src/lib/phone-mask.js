import React from 'react';

/**
 * A simple, non-comprehensive phone number formatter.
 * This is a basic implementation and does not cover all international formats.
 * It's designed to provide a better user experience for common formats.
 *
 * Formats based on the start of the number:
 * - Brazil (+55): +55 (XX) XXXXX-XXXX
 * - USA/Canada (+1): +1 (XXX) XXX-XXXX
 * - Others: Adds a space after the country code and formats in groups.
 */
export const formatPhoneNumber = (value) => {
    if (!value) return value;

    // Remove all non-digit characters, but keep the leading '+' if present
    const digitsOnly = value.replace(/[^\d+]/g, '');
    let number = digitsOnly.replace(/(?!^)\+/g, ''); // Remove '+' if not at the start

    if (number.startsWith('+55')) { // Brazil
        number = number.substring(3);
        let formatted = '+55';
        if (number.length > 0) {
            formatted += ` (${number.substring(0, 2)}`;
        }
        if (number.length > 2) {
            formatted += `) ${number.substring(2, 7)}`;
        }
        if (number.length > 7) {
            formatted += `-${number.substring(7, 11)}`;
        }
        return formatted;
    } else if (number.startsWith('+1')) { // USA/Canada
        number = number.substring(2);
        let formatted = '+1';
        if (number.length > 0) {
            formatted += ` (${number.substring(0, 3)}`;
        }
        if (number.length > 3) {
            formatted += `) ${number.substring(3, 6)}`;
        }
        if (number.length > 6) {
            formatted += `-${number.substring(6, 10)}`;
        }
        return formatted;
    } else {
        // Generic formatter for other international codes
        if (!number.startsWith('+')) {
            number = '+' + number;
        }
        
        const parts = number.split(/(\+\d{1,3})/g).filter(Boolean);
        if (parts.length > 1) {
            const countryCode = parts[0];
            let rest = parts.slice(1).join('').replace(/\D/g, '');
            
            if (rest.length > 0) {
                // Simple grouping by 3 or 4
                const groups = rest.match(/.{1,4}/g) || [];
                return `${countryCode} ${groups.join(' ')}`;
            }
            return countryCode;
        }
        return number;
    }
};