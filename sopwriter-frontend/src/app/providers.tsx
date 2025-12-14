import { ConfigProvider } from "@/contexts/ConfigContext";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ConfigProvider>
        {children}
    </ConfigProvider>
  );
}