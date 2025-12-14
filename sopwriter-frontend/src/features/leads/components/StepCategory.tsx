import type { Category } from "@/types/wizard";
import { FileText, UserCircle2, Plane, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useConfig } from "@/contexts/ConfigContext";
import { useCallback } from "react";

interface StepCategoryProps {
    wizard: {
        state: {
            category: Category | null;
            service: string | null;
        };
        setCategory: (category: Category) => void;
        setService: (service: string) => void;
    };
    onNext: () => void;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

export default function StepCategory({ wizard, onNext }: StepCategoryProps) {
    const { config } = useConfig();

    type IconConfig = {
        icon: typeof FileText;
        color: string;
        bg: string;
    };

    const iconMap: Record<string, IconConfig> = {
        documents: { icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
        profile: { icon: UserCircle2, color: "text-purple-500", bg: "bg-purple-500/10" },
        visa: { icon: Plane, color: "text-orange-500", bg: "bg-orange-500/10" },
        default: { icon: Sparkles, color: "text-primary", bg: "bg-primary/10" }
    };

    const categories = config.categories.map(cat => ({
        ...cat,
        ...(iconMap[cat.key] || iconMap.default),
        key: cat.key as Category // Cast to ensure type compatibility with existing wizard state
    }));

    const handleSelect = useCallback((category: Category) => {
        if (wizard.state.category !== category) {
            wizard.setService("");
        }
        wizard.setCategory(category);
        onNext();
    }, [wizard, onNext]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, category: Category) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect(category);
        }
    }, [handleSelect]);

    return (
        <div className="space-y-6">
            <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold">Choose your requirement</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Select the category that matches your needs
                </p>
            </div>

            <motion.div
                className="grid gap-4"
                variants={container}
                initial="hidden"
                animate="show"
                role="radiogroup"
                aria-label="Select a service category"
            >
                {categories.map((c) => {
                    const isSelected = wizard.state.category === c.key;
                    /* Using div for motion, acting as button */
                    return (
                        <motion.div key={c.key} variants={item}>
                            <button
                                onClick={() => handleSelect(c.key)}
                                onKeyDown={(e) => handleKeyDown(e, c.key)}
                                className={`cursor-pointer group relative w-full text-left p-4 sm:p-6 border-2 rounded-xl transition-all duration-300 flex items-center gap-4 sm:gap-6
                                ${isSelected
                                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    }`}
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={isSelected ? 0 : -1}
                            >
                                <div className={`p-3 sm:p-4 rounded-xl ${c.bg} ${c.color} transition-transform group-hover:scale-110`} aria-hidden="true">
                                    <c.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-base sm:text-lg mb-0.5 sm:mb-1">{c.label}</div>
                                    <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{c.description}</div>
                                </div>

                                <div className={`w-4 h-4 rounded-full border-2 transition-colors
                                    ${isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground/30 group-hover:border-primary/50"
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
