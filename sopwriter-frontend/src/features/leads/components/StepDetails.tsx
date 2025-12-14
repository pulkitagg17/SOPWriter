import { useState, useCallback } from "react";
import { detailsSchema } from "@/shared/utils/validations";
import { Button } from "@/shared/components/ui/button";
import type { WizardDetails } from "@/types/wizard";
import { Loader2, User, Mail, Phone } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";

interface StepDetailsProps {
    wizard: {
        state: {
            details: WizardDetails;
        };
        setDetails: (details: Partial<WizardDetails>) => void;
    };
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

export default function StepDetails({
    wizard,
    onBack,
    onSubmit,
    isSubmitting = false,
}: StepDetailsProps) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = useCallback((field: keyof WizardDetails, value: string) => {
        wizard.setDetails({
            [field]: value,
        });
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [wizard, errors]);

    const handleSubmit = useCallback(() => {
        // Validation Logic for Phone
        const currentPhone = wizard.state.details.phone || "";
        let prefix = "+91";
        let numberPart = "";

        if (currentPhone.includes(' ')) {
            const parts = currentPhone.split(' ');
            prefix = parts[0];
            numberPart = parts.slice(1).join('');
        } else {
            // Fallback
            numberPart = currentPhone.replace(/^\+91/, '');
        }

        // Clean number
        numberPart = numberPart.replace(/\D/g, '');
        numberPart = numberPart.replace(/^0+/, '');

        // Check constraints
        if (!numberPart) {
            setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
            return;
        }

        const fullPhoneToValidate = `${prefix}${numberPart}`;

        // 1. LibPhoneNumber Global Validation
        // This handles length, format, and validity for ALL countries including India.
        if (!isValidPhoneNumber(fullPhoneToValidate)) {
            setErrors((prev) => ({ ...prev, phone: "Invalid phone number for the selected country code" }));
            return;
        }

        const cleanPhone = `${prefix} ${numberPart}`;
        wizard.setDetails({
            phone: cleanPhone
        });

        const result = detailsSchema.safeParse({
            ...wizard.state.details,
            // Override phone in validation check just in case, though we updated state
            phone: cleanPhone
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            // TS sometimes struggles with Result discrimination in simple if
            const issues = (result as { error: { issues: { path: (string | number)[]; message: string }[] } }).error.issues;
            issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        onSubmit();
    }, [wizard, onSubmit]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <div className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your details</h2>
                <p className="text-muted-foreground">
                    We'll use this information to get in touch with you
                </p>
            </div>

            {/* Form - Single Column */}
            <div className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground"
                    >
                        Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={wizard.state.details.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full pl-10 border-2 px-4 py-3 rounded-xl text-base bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all ${errors.name ? "border-destructive" : "border-border"
                                }`}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            required
                        />
                    </div>
                    {errors.name && (
                        <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground"
                    >
                        Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={wizard.state.details.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className={`w-full pl-10 border-2 px-4 py-3 rounded-xl text-base bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all ${errors.email ? "border-destructive" : "border-border"
                                }`}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            required
                        />
                    </div>
                    {errors.email && (
                        <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground"
                    >
                        Phone <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="w-24 px-3 py-3 border-2 border-border rounded-xl text-base text-center bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                            value={wizard.state.details.phone?.includes(' ') ? wizard.state.details.phone.split(' ')[0] : "+91"}
                            onChange={(e) => {
                                let val = e.target.value;
                                // Automatically add + if missing and not empty
                                if (val && !val.startsWith('+')) val = '+' + val;

                                const currentNumber = wizard.state.details.phone?.includes(' ')
                                    ? wizard.state.details.phone.split(' ').slice(1).join(' ')
                                    : "";
                                handleChange("phone", `${val} ${currentNumber}`);
                            }}
                            placeholder="+91"
                            aria-label="Country code"
                        />
                        <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                            <input
                                id="phone"
                                type="tel"
                                placeholder="98765 43210"
                                value={wizard.state.details.phone?.includes(' ') ? wizard.state.details.phone.split(' ').slice(1).join(' ') : ""}
                                onChange={(e) => {
                                    const currentPrefix = wizard.state.details.phone?.includes(' ')
                                        ? wizard.state.details.phone.split(' ')[0]
                                        : "+91";
                                    let val = e.target.value;
                                    // Remove leading zero immediately
                                    if (val.startsWith('0')) {
                                        val = val.replace(/^0+/, '');
                                    }
                                    handleChange("phone", `${currentPrefix} ${val}`);
                                }}
                                className={`w-full pl-10 border-2 px-4 py-3 rounded-xl text-base bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all ${errors.phone ? "border-destructive" : "border-border"
                                    }`}
                                aria-invalid={!!errors.phone}
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                                required
                            />
                        </div>
                    </div>
                    {errors.phone && (
                        <p id="phone-error" className="text-sm text-destructive">{errors.phone}</p>
                    )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-foreground"
                    >
                        Additional notes{" "}
                        <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                        id="notes"
                        placeholder="Tell us about your requirements..."
                        value={wizard.state.details.notes || ""}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        rows={4}
                        className="w-full border-2 border-border px-4 py-3 rounded-xl text-base bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all resize-none"
                        maxLength={1000}
                        aria-describedby="notes-help"
                    />
                    <p id="notes-help" className="text-xs text-muted-foreground">Maximum 1000 characters</p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1 py-6 text-lg rounded-xl hover:bg-secondary/80 border-2"
                    aria-label="Go back to previous step"
                >
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    aria-label="Submit your request"
                    onKeyDown={handleKeyDown}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                            Submitting...
                        </>
                    ) : (
                        "Submit Request"
                    )}
                </Button>
            </div>
        </div>
    );
}
