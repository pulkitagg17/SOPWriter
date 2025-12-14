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
    <div className="flex-1 p-6 lg:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-white/5 relative">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide uppercase">
          <ShieldCheck className="w-3 h-3" /> Secure Payment
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Complete your order
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          You're just one step away from finalizing your application.
        </p>
      </div>

      {/* Amount Card */}
      <div className="relative group overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 transition-all hover:border-primary/30">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="w-16 h-16 text-primary/20 rotate-12" />
        </div>

        <div className="relative z-10">
          <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">Total Payable</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
              {formatCurrency(amountToPay)}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-primary/10 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-background border border-primary/20 flex items-center justify-center shadow-sm">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Service Selected</p>
              <p className="font-semibold text-lg leading-tight">{serviceName}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Reference ID */}
      <div className="bg-muted/30 rounded-xl p-4 border border-white/5 mx-auto w-full">
        <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">Application Reference ID</p>
        <div className="flex items-center gap-3 bg-background/50 rounded-lg p-3 border border-border/50 group hover:border-primary/30 transition-colors">
          <code className="flex-1 font-mono text-base font-bold text-foreground px-2">
            {leadId}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={() => onCopyClick(leadId, "Reference ID")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
