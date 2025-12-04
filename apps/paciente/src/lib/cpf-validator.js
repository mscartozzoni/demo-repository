import React from 'react';

/**
 * Validates a Brazilian CPF number.
 * @param {string} cpf - The CPF number as a string of digits.
 * @returns {boolean} - True if the CPF is valid, false otherwise.
 */
export const validateCPF = (cpf) => {
    const cpfClean = String(cpf).replace(/[^\d]/g, '');

    if (cpfClean.length !== 11 || /^(\d)\1+$/.test(cpfClean)) {
        return false;
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpfClean.substring(9, 10))) {
        return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpfClean.substring(10, 11))) {
        return false;
    }

    return true;
};