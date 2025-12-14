import { Button } from "@/shared/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/contexts/ConfigContext";
import { IndianRupee } from "lucide-react";
import { useCallback } from "react";

interface StepServiceProps {
    wizard: {
        state: {
            category: string | null;
            service: string | null;
        };
        setService: (service: string) => void;
    };
    onNext: () => void;
    onBack: () => void;
}

export default function StepService({
    wizard,
    onNext,
    onBack,
}: StepServiceProps) {
    const { config } = useConfig();

    // Find the current category configuration
    const currentCategory = config.categories.find(c => c.key === wizard.state.category);

    // Get services associated with this category
    const services = currentCategory ? currentCategory.services : [];

    const canProceed = wizard.state.service && wizard.state.service !== "";

    const currentService = currentCategory?.services.find(s => s.name === wizard.state.service);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (canProceed) {
                onNext();
            }
        }
    }, [canProceed, onNext]);

    return (
        <div className="space-y-8 h-full flex flex-col">
            {/* Title */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Select the specific service you need</h2>
                <p className="text-muted-foreground">We offer a range of specialized services in this category</p>
            </div>

            {/* Dropdown */}
            <div className="relative">
                <Select
                    onValueChange={wizard.setService}
                    defaultValue={wizard.state.service || ""}
                >
                    <SelectTrigger
                        className="w-full py-6 text-base font-medium transition-all hover:border-primary/50 cursor-pointer"
                        aria-label="Select a service"
                    >
                        <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                        {services.map((svc) => (
                            <SelectItem
                                key={svc.name}
                                value={svc.name}
                                className="py-3 cursor-pointer"
                            >
                                <div className="flex items-center justify-between w-full gap-4">
                                    <span>{svc.name}</span>
                                    <span className="text-primary font-semibold flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" aria-hidden="true" />
                                        {svc.price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Description text with animation */}
            <div className="flex-1 min-h-[120px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={wizard.state.service || "default"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-muted/30 p-6 rounded-xl border border-border/50 h-full"
                        role="region"
                        aria-live="polite"
                        aria-label="Service details"
                    >
                        {currentService ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-foreground">Service Inclusions:</h4>
                                    <div className="flex items-center gap-1 text-primary font-bold text-lg">
                                        <IndianRupee className="h-5 w-5" aria-hidden="true" />
                                        <span>{currentService.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {currentService.description || "Premium service with expert guidance and quality assurance."}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2">Why choose us?</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    We tailor each document according to your university and profile. Our expert writers ensure your application stands out with personalized content and rigorous quality checks.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex justify-between gap-4 pt-4 mt-auto">
                <Button
                    variant="outline"
                    onClick={onBack}
                    size="lg"
                    className="px-8"
                    aria-label="Go back to previous step"
                >
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!canProceed}
                    size="lg"
                    className="px-8 shadow-md"
                    aria-label="Continue to next step"
                    onKeyDown={handleKeyDown}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
