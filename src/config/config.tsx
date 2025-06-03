
import type { SocialContributionsData } from '../types/components/selbstaendig/socialContributions/socialContributions';
import type { Deductions } from '../types/components/selbstaendig/taxDeductions/taxDeductions';
import type { LanguageOption } from '../types/components/ui/languageSelector/languageSelector';
import type { MetaTagsType } from '../types/config';
import type { Language } from '../types/context/languageContext';
import GermanFlag from '/assets/icons/flags/de.svg';
import BritishFlag from '/assets/icons/flags/gb.svg';
import RussianFlag from '/assets/icons/flags/ru.svg';
import UkrainianFlag from '/assets/icons/flags/ua.svg';

export const INITIAL_LANGUAGE: Language = 'de';

export const DEFAULT_SOCIAL_CONTRIBUTIONS: SocialContributionsData = {
    mandatory: {
        krankenversicherung: {
            checked: true,
            percent: 16.7,
            minMonthly: 200, // minimum monthly contribution (EUR, approx) - you can't pay less than this amount
            maxMonthly: 844, // maximum monthly contribution (EUR, approx) - you won't pay more than this amount
            ceiling: 5175, // contribution ceiling (EUR, approx) - there is no difference if you earn more than this amount
            amount: 0,
            label: "Krankenversicherung"
        },
        pflegeversicherung: {
            checked: true,
            percent: 3.6,
            minMonthly: 40, // minimum monthly contribution (EUR, approx) - you can't pay less than this amount
            maxMonthly: 200, // maximum monthly contribution (EUR, approx) - you won't pay more than this amount
            ceiling: 5512, // contribution ceiling (EUR, approx) - there is no difference if you earn more than this amount 
            amount: 0,
            label: "Pflegeversicherung"
        },
    },
    voluntary: {
        rentenversicherung: {
            checked: false,
            percent: 18.6,
            minMonthly: 103,  // minimum monthly contribution (EUR, approx) - you can't pay less than this amount
            maxMonthly: 1404, // maximum monthly contribution (EUR, approx) - you won't pay more than this amount
            ceiling: 7550, // contribution ceiling (EUR, approx) - there is no difference if you earn more than this amount
            reducedPercentForFirst3Years: 9.3, // half percent for first 3 years as new self-employed
            amount: 0,
            label: "Rentenversicherung"
        },
        arbeitslosenversicherung: {
            checked: false,
            percent: 2.6,
            minMonthly: 88, // minimum monthly contribution (EUR, approx) - you can't pay less than this amount
            maxMonthly: 210, // maximum monthly contribution (EUR, approx) - you won't pay more than this amount
            ceiling: 8050, // contribution ceiling (EUR, approx) - there is no difference if you earn more than this amount
            amount: 0,
            label: "Arbeitslosenversicherung"
        },
        unfallversicherung: { checked: false, percent: 1.3, amount: 0, label: "Unfallversicherung" },
        kuenstlersozialkasse: { checked: false, percent: 4.2, amount: 0, label: "Künstlersozialkasse" },
        solidaritaetszuschlag: { checked: false, percent: 5.5, amount: 0, label: "Solidaritätszuschlag" },
        kirchensteuer: { checked: false, percent: 9, amount: 0, label: "Kirchensteuer" }
    }
};

export const DEFAULT_TAX_DEDUCTIONS: Deductions = {
    monthly: {
        krankenversicherung: { amount: 800, type: 'full' }, // will be copied from social contributions if checked
        buero: {
            amount: 0,
            warmmiete: 0,
            wholeSqm: 0,
            officeSqm: 0,
            isCalculated: false
        },
        internet: { amount: 50, type: 'half' },
        custom: []
    },
    oneTime: {
        custom: []
    },
    depreciation: {
        custom: []
    }
};

export const DEDUCTION_TYPES = [
    { value: 'full', label: '100%' },
    { value: 'half', label: '50%' },
];

export const LANGUAGES: LanguageOption[] = [
    { code: 'de', title: 'Deutsch', flag: GermanFlag, alt: 'German Flag' },
    { code: 'en', title: 'English', flag: BritishFlag, alt: 'British Flag' },
    { code: 'ru', title: 'Русский', flag: RussianFlag, alt: 'Russian Flag' },
    { code: 'uk', title: 'Українська', flag: UkrainianFlag, alt: 'Ukrainian Flag' },
];


export const ONE_BILLION = 1000000000;
export const HUNDRED_MILLION = 100000000;
export const INPUTS_DATA = {
    bruttoInput: {
        brutto: { min: 0, max: ONE_BILLION, step: 1 },
        spouseIncome: { min: 0, max: ONE_BILLION, step: 1 }
    },

    socialContributions: {
        percent: { min: 0, max: 100, step: 0.01 },
        amount: { min: 0, max: ONE_BILLION, step: 0.01 }
    },

    taxDeductions: {
        monthly: {
            krankenversicherung: { amount: { min: 0, max: ONE_BILLION, step: 0.01 } },
            buero: {
                amount: { min: 0, max: HUNDRED_MILLION, step: 0.01 },
                warmmiete: { min: 0, max: HUNDRED_MILLION, step: 0.01 },
                wholeSqm: { min: 0, max: 10000, step: 0.01 },
                officeSqm: { min: 0, max: 10000, step: 0.01 }
            },
            internet: { amount: { min: 0, max: 1000000, step: 0.01 } },
            custom: { amount: { min: 0, max: ONE_BILLION, step: 0.01 } }
        },

        oneTime: {
            custom: {
                amount: { min: 0, max: ONE_BILLION, step: 0.01 },
            }
        },

        depreciationItemsList: {
            amount: { min: 0, max: ONE_BILLION, step: 0.01 },
            usefulLifeYears: { min: 1, max: 150, step: 1 },
            degressiveRatePercent: { min: 1, max: 100, step: 0.01 }
        },
    }
}

// SEO tags for multiple languages
export const metaTags: MetaTagsType = {
    de: {
        title: "Brutto-Netto-Rechner für Selbständige & Angestellte - bruttonetto.tools",
        description: "Kostenloser Brutto-Netto-Rechner für Deutschland - mit Steuern, Sozialabgaben und Abzügen für Selbständige und Angestellte.",
        keywords: "Brutto Netto Rechner, Steuerrechner, Selbständige, Angestellte, Einkommensteuer, Sozialabgaben, Steuerklasse, Steuererklärung, Deutschland, Nettolohn, Gewerbesteuer",
        ogTitle: "Brutto-Netto-Rechner für Selbständige & Angestellte",
        ogDescription: "Berechnen Sie Ihr Nettoeinkommen mit unserem kostenlosen Steuerrechner - Einkommensteuer, Gewerbesteuer und Sozialabgaben für Deutschland.",
        ogLocale: "de_DE",
        twitterTitle: "Brutto-Netto-Rechner für Selbständige & Angestellte",
        twitterDescription: "Berechnen Sie Ihr Nettoeinkommen mit unserem kostenlosen Steuerrechner - Einkommensteuer, Gewerbesteuer und Sozialabgaben für Deutschland.",
        structuredData: {
            name: "Brutto-Netto-Rechner",
            description: "Kostenloser Brutto-Netto-Rechner für Deutschland - mit Steuern, Sozialabgaben und Abzügen für Selbständige und Angestellte."
        }
    },
    en: {
        title: "German Tax Calculator for Self-employed & Employees - bruttonetto.tools",
        description: "Free German gross-to-net calculator - with taxes, social security contributions and deductions for self-employed and employees.",
        keywords: "German Tax Calculator, Self-employed, Employee, Income Tax, Social Security, Tax Class, Tax Return, Germany, Net Income, Trade Tax",
        ogTitle: "German Tax Calculator for Self-employed & Employees",
        ogDescription: "Calculate your net income with our free German tax calculator - income tax, trade tax, and social security contributions.",
        ogLocale: "en_US",
        twitterTitle: "German Tax Calculator for Self-employed & Employees",
        twitterDescription: "Calculate your net income with our free German tax calculator - income tax, trade tax, and social security contributions.",
        structuredData: {
            name: "German Tax Calculator",
            description: "Free German gross-to-net calculator - with taxes, social security contributions and deductions for self-employed and employees."
        }
    },
    ru: {
        title: "Калькулятор налогов Германии для самозанятых и наёмных работников - bruttonetto.tools",
        description: "Бесплатный калькулятор расчёта чистого дохода в Германии - с учётом налогов, социальных взносов и вычетов для самозанятых и наёмных работников.",
        keywords: "Калькулятор налогов Германии, Самозанятые, Наёмные работники, Подоходный налог, Социальные отчисления, Налоговый класс, Налоговая декларация, Германия, Чистый доход, Промысловый налог",
        ogTitle: "Калькулятор налогов Германии для самозанятых и наёмных работников",
        ogDescription: "Рассчитайте свой чистый доход с помощью нашего бесплатного калькулятора налогов Германии - подоходный налог, промысловый налог и социальные отчисления.",
        ogLocale: "ru_RU",
        twitterTitle: "Калькулятор налогов Германии для самозанятых и наёмных работников",
        twitterDescription: "Рассчитайте свой чистый доход с помощью нашего бесплатного калькулятора налогов Германии - подоходный налог, промысловый налог и социальные отчисления.",
        structuredData: {
            name: "Калькулятор налогов Германии",
            description: "Бесплатный калькулятор расчёта чистого дохода в Германии - с учётом налогов, социальных взносов и вычетов для самозанятых и наёмных работников."
        }
    },
    uk: {
        title: "Калькулятор податків Німеччини для самозайнятих та найманих працівників - bruttonetto.tools",
        description: "Безкоштовний калькулятор розрахунку чистого доходу в Німеччині - з урахуванням податків, соціальних внесків та відрахувань для самозайнятих та найманих працівників.",
        keywords: "Калькулятор податків Німеччини, Самозайняті, Наймані працівники, Прибутковий податок, Соціальні відрахування, Податковий клас, Податкова декларація, Німеччина, Чистий дохід, Промисловий податок",
        ogTitle: "Калькулятор податків Німеччини для самозайнятих та найманих працівників",
        ogDescription: "Розрахуйте свій чистий дохід за допомогою нашого безкоштовного калькулятора податків Німеччини - прибутковий податок, промисловий податок та соціальні відрахування.",
        ogLocale: "uk_UA",
        twitterTitle: "Калькулятор податків Німеччини для самозайнятих та найманих працівників",
        twitterDescription: "Розрахуйте свій чистий дохід за допомогою нашого безкоштовного калькулятора податків Німеччини - прибутковий податок, промисловий податок та соціальні відрахування.",
        structuredData: {
            name: "Калькулятор податків Німеччини",
            description: "Безкоштовний калькулятор розрахунку чистого доходу в Німеччині - з урахуванням податків, соціальних внесків та відрахувань для самозайнятих та найманих працівників."
        }
    }
};