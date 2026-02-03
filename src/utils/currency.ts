/**
 * Currency utility functions for VND
 */

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
};
