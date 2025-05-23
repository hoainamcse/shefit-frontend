export type AboutUsData = {
    description: string;
    'thumbnail image': string;
};

export type ConfigurationItem = {
    id: number;
    type: string;
    data: AboutUsData | Record<string, unknown>;
    created_at: string;
    updated_at: string;
};

export type ConfigurationsResponse = {
    status: string;
    data: ConfigurationItem[];
    paging: {
        page: number | null;
        per_page: number | null;
        total: number;
    };
};

export type Configurations = {
    about_us: AboutUsData | null;
};
