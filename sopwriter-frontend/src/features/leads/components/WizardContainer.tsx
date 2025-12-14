import { useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWizard } from "@/features/leads/hooks/useWizard";
import { useCreateLead } from "@/features/leads/hooks/useCreateLead";
import { useConfig } from "@/contexts/ConfigContext";
import WizardUI from "@/features/leads/components/WizardUI";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export default function WizardContainer() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(0);
    const wizard = useWizard();
    const navigate = useNavigate();
    const { createLead, isLoading } = useCreateLead();
    const { config, isLoading: configLoading } = useConfig();

    // Check if any services are available
    const hasActiveServices = useMemo(() => {
        return config.categories.some(cat => cat.services && cat.services.length > 0);
    }, [config.categories]);

    const next = useCallback(() => {
        setDirection(1);
        setStep((s) => s + 1);
    }, []);

    const back = useCallback(() => {
        setDirection(-1);
        setStep((s) => s - 1);
    }, []);

    // Memoize the payload to avoid recalculation on every render
    const payload = useMemo(() => ({
        service: wizard.state.service || "General Inquiry",
        name: wizard.state.details.name,
        email: wizard.state.details.email,
        phone: wizard.state.details.phone,
        notes: wizard.state.details.notes,
    }), [wizard.state]);

    const handleSubmit = useCallback(async () => {
        try {
            const leadId = await createLead(payload);
            if (leadId) {
                navigate(`/payment?leadId=${leadId}`);
            }
        } catch (error) {
            console.error("Failed to submit lead:", error);
        }
    }, [payload, createLead, navigate]);

    const handleStepClick = useCallback((s: number) => {
        setDirection(s > step ? 1 : -1);
        setStep(s);
    }, [step]);

    // Show loading state while config is being fetched
    if (configLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="p-12 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading services...</p>
                    </div>
                </Card>
            </div>
        );
    }

    // Show message if no services are available
    if (!hasActiveServices) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="p-8 lg:p-12 border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
                        <div className="p-4 rounded-full bg-amber-500/10">
                            <AlertTriangle className="h-12 w-12 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Services Temporarily Unavailable</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                We are not currently accepting new service requests.
                                Please check back later or contact us for more information.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <Button variant="outline" asChild>
                                <Link to="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
                            {config.contact?.email && (
                                <Button asChild>
                                    <a href={`mailto:${config.contact.email}`}>
                                        Contact Us
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <WizardUI
            step={step}
            direction={direction}
            wizard={wizard}
            onNext={next}
            onBack={back}
            onSubmit={handleSubmit}
            onStepClick={handleStepClick}
            isSubmitting={isLoading}
        />
    );
}
