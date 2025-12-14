import { Button } from "@/shared/components/ui/button";
import { Copy, ShieldCheck, Wallet, Sparkles } from "lucide-react";
import type { Lead } from "@/types/config";
import type { AppConfig } from "@/types/config";
import { useMemo } from "react";

import { formatCurrency } from "@/shared/utils/formatters";

interface OrderDetailsPanelProps {
  leadId: string;
  leadDetails: Lead | null;
  config: AppConfig;
  onCopyClick: (text: string, label?: string) => void;
}

export default function OrderDetailsPanel({
  leadId,
  leadDetails,
  config,
  onCopyClick
}: OrderDetailsPanelProps) {
  const serviceName = leadDetails?.service;

  // Find price dynamically with useMemo
  const amountToPay = useMemo(() => {
    if (!serviceName) return 0;

    for (const cat of config.categories) {
      const found = cat.services.find(s => s.name === serviceName);
      if (found) {
        return found.price;
      }
    }
    return 0;
  }, [serviceName, config.categories]);




  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8 border-b lg:border-b-0 lg:border-r border-white/5 relative">
      <div className="space-y-1 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-medium tracking-wide uppercase">
          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Secure Payment
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Complete your order
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
          You're just one step away from finalizing your application.
        </p>
      </div>

      {/* Amount Card */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all hover:border-primary/30">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-primary/20 rotate-12" />
        </div>

        <div className="relative z-10">
          <p className="text-xs sm:text-sm font-semibold text-primary/80 uppercase tracking-wider mb-1 sm:mb-2">Total Payable</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(amountToPay)}
            </span>
          </div>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-primary/10 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-background border border-primary/20 flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Service Selected</p>
              <p className="font-semibold text-base sm:text-lg leading-tight truncate">{serviceName}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Reference ID */}
      <div className="bg-muted/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 mx-auto w-full">
        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1.5 sm:mb-2 uppercase tracking-wide">Application Reference ID</p>
        <div className="flex items-center gap-2 sm:gap-3 bg-background/50 rounded-lg p-2 sm:p-3 border border-border/50 group hover:border-primary/30 transition-colors">
          <code className="flex-1 font-mono text-xs sm:text-base font-bold text-foreground px-1 sm:px-2 truncate">
            {leadId}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 flex-shrink-0"
            onClick={() => onCopyClick(leadId, "Reference ID")}
          >
            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
