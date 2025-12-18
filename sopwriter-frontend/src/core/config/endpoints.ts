export const ENDPOINTS = {
    LEADS: "/v1/leads",
    TRANSACTIONS: (leadId: string) => `/v1/leads/${leadId}/transactions`,
    CONFIG: "/v1/config",
    HEALTH: "/health",
} as const;
