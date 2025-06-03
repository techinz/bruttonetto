export type ContributionType = 'mandatory' | 'voluntary';

export interface SocialContributionItem {
    /** Whether this contribution is selected (will be included in calculation) */
    checked: boolean;
    /** Display label for the contribution */
    label: string;
    /** Current percentage rate for the contribution */
    percent: number;
    /** Calculated amount based on percentage and brutto income */
    amount: number;
    /** Maximum income ceiling for contribution calculation */
    ceiling?: number;
    /** Minimum monthly contribution amount if applicable */
    minMonthly?: number;
    /** Maximum monthly contribution amount if applicable */
    maxMonthly?: number;
    /** Optional reduced percentage rate for first 3 years (for new businesses) */
    reducedPercentForFirst3Years?: number;
}

export interface SocialContributionsData {
    mandatory: {
        [key: string]: SocialContributionItem;
    };
    voluntary: {
        [key: string]: SocialContributionItem;
    };
}

export interface SocialContributionsProps {
    socialContributions: SocialContributionsData;
    brutto: number;
    onSubmit: (socialContributions: SocialContributionsData) => void;
    onBack: () => void;
}