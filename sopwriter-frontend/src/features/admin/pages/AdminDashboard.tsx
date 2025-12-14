import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";
import { useAdminTransactions } from "@/features/admin/hooks/useAdminTransactions";
import { useAdminLeads } from "@/features/admin/hooks/useAdminLeads";
import { auth } from "@/core/auth/auth.service";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { LogOut, RefreshCcw, Download, Search, Settings, FileSpreadsheet, Users, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import TransactionTable from "@/features/admin/components/TransactionTable";
import LeadTable from "@/features/admin/components/LeadTable";
import VerifyTransactionModal from "@/features/admin/components/VerifyTransactionModal";
import LeadDetailsModal from "@/features/admin/components/LeadDetailsModal";
import type { Lead } from "@/features/admin/hooks/useAdminLeads";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    useAdminAuth(true); // Protects route

    const { transactions, isLoading: txLoading, refetch: refetchTx, filterStatus, setFilterStatus } = useAdminTransactions();
    const { leads, isLoading: leadsLoading, refetch: refetchLeads, search, setSearch, statusFilter, setStatusFilter } = useAdminLeads();

    // Transaction search
    const [txSearch, setTxSearch] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
    const [action, setAction] = useState<'VERIFY' | 'REJECT' | null>(null);

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // Helper to get lead data from transaction (handles string or object)
    const getLeadData = (leadId: typeof transactions[0]['leadId']) => {
        if (typeof leadId === 'object' && leadId !== null) {
            return leadId;
        }
        return null;
    };

    // Filter transactions by search
    const filteredTransactions = useMemo(() => {
        if (!txSearch.trim()) return transactions;
        const query = txSearch.toLowerCase();
        return transactions.filter(tx => {
            const lead = getLeadData(tx.leadId);
            return (
                tx._id?.toLowerCase().includes(query) ||
                lead?.name?.toLowerCase().includes(query) ||
                lead?.email?.toLowerCase().includes(query) ||
                tx.utrNumber?.toLowerCase().includes(query)
            );
        });
    }, [transactions, txSearch]);


    const handleAction = (txId: string, actionType: 'VERIFY' | 'REJECT') => {
        setSelectedTxId(txId);
        setAction(actionType);
        setIsModalOpen(true);
    };

    const handleViewLead = (lead: Lead) => {
        setSelectedLead(lead);
        setIsLeadModalOpen(true);
    };

    const handleDownloadLeads = () => {
        const headers = ["Ref ID", "Name", "Email", "Phone", "Service", "Status", "Created At"];
        const csvContent = [
            headers.join(","),
            ...leads.map(lead => [
                lead._id,
                `"${lead.name}"`,
                lead.email,
                lead.phone || "",
                `"${lead.service}"`,
                lead.status,
                new Date(lead.createdAt).toISOString()
            ].join(","))
        ].join("\n");

        downloadFile(csvContent, `leads_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    };

    const handleDownloadTransactions = () => {
        const headers = ["Transaction ID", "Lead Name", "Lead Email", "Service", "Amount", "UTR Number", "Status", "Created At"];
        const csvContent = [
            headers.join(","),
            ...filteredTransactions.map(tx => {
                const lead = getLeadData(tx.leadId);
                return [
                    tx._id,
                    `"${lead?.name || 'N/A'}"`,
                    lead?.email || 'N/A',
                    `"${lead?.service || 'N/A'}"`,
                    tx.amount || 0,
                    tx.utrNumber || '',
                    tx.status,
                    tx.createdAt ? new Date(tx.createdAt).toISOString() : tx.submittedAt
                ].join(",");
            })
        ].join("\n");

        downloadFile(csvContent, `transactions_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type: `${type};charset=utf-8;` });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRefresh = () => {
        refetchTx();
        refetchLeads();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/settings")}>
                            <Settings className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Settings</span>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => auth.logout()} className="text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                {/* Header with Refresh */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Management</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">Verify payments and manage leads</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="w-full sm:w-auto"
                    >
                        <RefreshCcw className={`mr-2 h-4 w-4 ${txLoading || leadsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <Tabs defaultValue="transactions" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="transactions" className="gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Transactions</span>
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="gap-2">
                            <Users className="h-4 w-4" />
                            <span>All Leads</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                                            <CreditCard className="h-5 w-5 text-primary" />
                                            Payment Verification
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            Review and verify payment declarations from users
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadTransactions}
                                        className="shrink-0"
                                    >
                                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                                        Export Excel
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Search & Filters */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-4 border-b">
                                    <div className="relative flex-1 w-full sm:max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search by name, email, UTR..."
                                            className="pl-9"
                                            value={txSearch}
                                            onChange={(e) => setTxSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {[
                                            { value: 'DECLARED', label: 'Pending', color: 'text-amber-500' },
                                            { value: 'VERIFIED', label: 'Verified', color: 'text-green-500' },
                                            { value: 'REJECTED', label: 'Rejected', color: 'text-red-500' }
                                        ].map((status) => (
                                            <Button
                                                key={status.value}
                                                variant={filterStatus === status.value ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setFilterStatus(status.value)}
                                                className={filterStatus !== status.value ? status.color : ''}
                                            >
                                                {status.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {txLoading && transactions.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Loading transactions...</p>
                                    </div>
                                ) : filteredTransactions.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">
                                            {txSearch ? 'No transactions match your search' : 'No transactions found'}
                                        </p>
                                    </div>
                                ) : (
                                    <TransactionTable
                                        transactions={filteredTransactions}
                                        onAction={handleAction}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leads" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Leads Database
                                        </CardTitle>
                                        <CardDescription>
                                            View, search, and export all generated leads
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleDownloadLeads}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-4 border-b">
                                    <div className="relative flex-1 w-full sm:max-w-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search by name, email, or ID..."
                                            className="pl-9"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="NEW">New</SelectItem>
                                            <SelectItem value="PAYMENT_DECLARED">Payment Declared</SelectItem>
                                            <SelectItem value="VERIFIED">Verified</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {leadsLoading ? (
                                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Loading leads...</p>
                                    </div>
                                ) : leads.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">
                                            {search ? 'No leads match your search' : 'No leads found'}
                                        </p>
                                    </div>
                                ) : (
                                    <LeadTable leads={leads} onView={handleViewLead} />
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            <VerifyTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionId={selectedTxId}
                currentAction={action}
                onSuccess={refetchTx}
            />

            <LeadDetailsModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                lead={selectedLead}
            />
        </div>
    );
}
