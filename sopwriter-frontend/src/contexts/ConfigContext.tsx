import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/core/api/client";
import type { AppConfig } from "@/types/config";
import { ENDPOINTS } from "@/core/config/endpoints";
import { SERVICE_MAP, PRICING_MAP, SERVICE_DESCRIPTIONS } from "@/core/config/constants";

// Default Fallback Config (derived from current constants)
const defaultConfig: AppConfig = {
    contact: {
        phone: "+1234567890", // Generic placeholder
        whatsapp: "1234567890",
        email: "info@example.com",
        supportEmail: "support@example.com"
    },
    payment: {
        upiId: "example@upi",
    },
    categories: [
        {
            key: "documents",
            label: "Application Documents",
            description: "SOP, LOR, Essays, Article",
            services: SERVICE_MAP["documents"].map((s: string) => ({
                name: s,
                price: PRICING_MAP[s] || 0,
                description: SERVICE_DESCRIPTIONS[s] || ""
            }))
        },
        {
            key: "profile",
            label: "Profile Building",
            description: "Resume, Interview Prep",
            services: SERVICE_MAP["profile"].map((s: string) => ({
                name: s,
                price: PRICING_MAP[s] || 0,
                description: SERVICE_DESCRIPTIONS[s] || ""
            }))
        },
        {
            key: "visa",
            label: "Visa Preparation",
            description: "USA Visa, Australia GTE",
            services: SERVICE_MAP["visa"].map((s: string) => ({
                name: s,
                price: PRICING_MAP[s] || 0,
                description: SERVICE_DESCRIPTIONS[s] || ""
            }))
        }
    ]
};

interface ConfigContextType {
    config: AppConfig;
    isLoading: boolean;
    refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType>({
    config: defaultConfig,
    isLoading: true,
    refreshConfig: async () => { },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useConfig = () => useContext(ConfigContext);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<AppConfig>(defaultConfig);
    const [isLoading, setIsLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            // Attempt to fetch from backend
            const { data } = await api.get(ENDPOINTS.CONFIG);
            if (data.success && data.data) {
                setConfig(data.data);
            } else {
                console.warn("Using default config due to API structure mismatch");
            }
        } catch (error) {
            console.error("Failed to fetch config, using fallback:", error);
            // We keep the defaultConfig which was set initially
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, isLoading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}
