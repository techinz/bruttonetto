export type MetaTagsType = {
    [key: string]: {
        title: string;
        description: string;
        keywords: string;
        ogTitle: string;
        ogDescription: string;
        ogLocale: string;
        twitterTitle: string;
        twitterDescription: string;
        structuredData: {
            name: string;
            description: string;
        };
    };
};