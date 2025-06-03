import type { SocialContributionItem } from "./types/components/selbstaendig/socialContributions/socialContributions";

/**
 * Rounds a number to a specified number of decimal places
 * @param num Number to round
 * @param decimals Number of decimal places to round to (default: 2)
 * @returns The rounded number
 */
export function round(num: number, decimals: number = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Parses a string to a number, applying optional min and max constraints
 * @param value String to parse
 * @param min Minimum value (default: 0)
 * @param max Maximum value (default: null, no maximum)
 * @returns The parsed number, constrained by min and max
 */
export function parseNumber(value: string, min: number | null = 0, max: number | null = null): number {
    let amount = parseFloat(value)

    if (isNaN(amount)) {
        amount = 0;
    }
    if (min !== null && amount < min) {
        amount = min;
    }
    else if (max !== null && amount > max) {
        amount = max;
    }

    return amount;
}

/**
 * Validates and adjusts a social contribution amount based on its defined limits
 * @param item The contribution item containing limits
 * @param brutto The gross income used to calculate the contribution
 * @param amount The amount to validate
 * @returns The adjusted contribution amount, respecting defined limits
 * */
export function validateSocialContributionLimits(item: SocialContributionItem, amount: number): number {
    const minMonthly = item.minMonthly;
    const maxMonthly = item.maxMonthly;

    if (minMonthly === null || maxMonthly === null) {
        // If no limits are set, return the original amount
        return amount;
    }

    // adjust if above maximum monthly contribution 
    if (maxMonthly !== undefined && (amount > maxMonthly)) {
        amount = maxMonthly;
    }

    // adjust if below minimum monthly contribution
    if (minMonthly !== undefined && (amount < minMonthly && amount > 0)) {
        amount = minMonthly;
    }

    return amount;
}

/**
 * Validates the brutto income against the contribution ceiling
 * @param item The contribution item containing the ceiling
 * @param brutto The gross income to validate
 * @returns The adjusted brutto income, respecting the ceiling
 */
export function validateSocialContributionBrutto(item: SocialContributionItem, brutto: number): number {
    const ceiling = item.ceiling;
    if (ceiling !== undefined && (ceiling !== null && brutto > ceiling)) {
        // if income exceeds the ceiling, use the ceiling value for calculations
        return ceiling;
    }
    return brutto;
}