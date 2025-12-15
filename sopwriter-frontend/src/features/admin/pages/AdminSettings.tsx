import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";
import { api } from "@/core/api/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { auth } from "@/core/auth/auth.service";
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    LogOut,
    ArrowLeft,
    Settings2,
    Package,
    Loader2,
    ToggleLeft,
    ToggleRight,
    IndianRupee,
    Power
} from "lucide-react";

interface Service {
    _id: string;
    code: string;
    name: string;
    category: string;
    price: number;
    description: string;
    active: boolean;
}

interface Setting {
    key: string;
    value: string;
    description: string;
}

export default function AdminSettings() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([]);
    const [settings, setSettings] = useState<Setting[]>([]);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
    const [isCreatingService, setIsCreatingService] = useState(false);
    const [activeTab, setActiveTab] = useState("services");

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [servicesRes, settingsRes] = await Promise.all([
                api.get("/admin/services"),
                api.get("/admin/settings"),
            ]);

            if (servicesRes.data.success) setServices(servicesRes.data.data);
            if (settingsRes.data.success) setSettings(settingsRes.data.data);
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, authLoading, fetchData]);

    const handleCreateService = () => {
        setIsCreatingService(true);
        setEditingService({
            _id: "",
            code: "",
            name: "",
            category: "documents",
            price: 0,
            description: "",
            active: true,
        });
    };

    const handleSaveService = async () => {
        if (!editingService) return;

        try {
            if (isCreatingService) {
                // Remove _id from payload for creation
                const { _id, ...payload } = editingService;
                await api.post("/admin/services", payload);
                toast.success("Service created successfully");
            } else {
                const { _id, ...payload } = editingService;
                await api.put(`/admin/services/${editingService._id}`, payload);
                toast.success("Service updated successfully");
            }
            setEditingService(null);
            setIsCreatingService(false);
            fetchData();
        } catch (error: unknown) {
            console.error(error);
            // @ts-expect-error - Accessing data message safely
            toast.error(error?.response?.data?.message || "Failed to save service");
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            await api.delete(`/admin/services/${id}`);
            toast.success("Service deleted");
            fetchData();
        } catch {
            toast.error("Failed to delete service");
        }
    };

    const handleUpdateSetting = async (setting: Setting) => {
        try {
            await api.put(`/admin/settings/${setting.key}`, {
                value: setting.value,
                description: setting.description,
            });
            toast.success("Setting updated");
            setEditingSetting(null);
            fetchData();
        } catch {
            toast.error("Failed to update setting");
        }
    };

    const cancelEdit = () => {
        setEditingService(null);
        setIsCreatingService(false);
    };

    const hasActiveServices = services.some(s => s.active);

    const handleToggleAllServices = async (active: boolean) => {
        const action = active ? "enable" : "disable";
        if (!confirm(`Are you sure you want to ${action} all services?`)) return;

        try {
            // Update all services
            await api.put("/admin/services/bulk", { active });

            toast.success(`All services ${active ? "enabled" : "disabled"}`);
            fetchData();
        } catch {
            toast.error(`Failed to ${action} all services`);
        }
    };

    if (isLoading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/admin/dashboard")}
                            className="gap-1 sm:gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Button>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                            <Settings2 className="h-5 w-5 text-primary" />
                            Settings
                        </h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => auth.logout()}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <LogOut className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                        <TabsTrigger value="services" className="gap-2">
                            <Package className="h-4 w-4" />
                            <span>Services</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            <span>App Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Services Tab */}
                    <TabsContent value="services" className="space-y-6">
                        {/* Service Form */}
                        {editingService ? (
                            <Card className="border-primary/50 shadow-lg">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        {isCreatingService ? (
                                            <>
                                                <Plus className="h-5 w-5 text-primary" />
                                                Create New Service
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-5 w-5 text-primary" />
                                                Edit Service
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="code">Service Code</Label>
                                            <Input
                                                id="code"
                                                value={editingService.code}
                                                onChange={(e) => setEditingService({ ...editingService, code: e.target.value })}
                                                placeholder="e.g., SOP_WRITING"
                                                className="font-mono"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category</Label>
                                            <Select
                                                value={editingService.category}
                                                onValueChange={(value) => setEditingService({ ...editingService, category: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="documents">Documents</SelectItem>
                                                    <SelectItem value="profile">Profile</SelectItem>
                                                    <SelectItem value="visa">Visa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Service Name</Label>
                                            <Input
                                                id="name"
                                                value={editingService.name}
                                                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                                placeholder="e.g., Statement of Purpose Writing"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price (₹)</Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={editingService.price}
                                                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={editingService.description}
                                            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                            placeholder="Describe the service..."
                                            rows={3}
                                        />
                                    </div>

                                    <div
                                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                                        onClick={() => setEditingService({ ...editingService, active: !editingService.active })}
                                    >
                                        {editingService.active ? (
                                            <ToggleRight className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                                        )}
                                        <div>
                                            <p className="font-medium text-sm">Service Status</p>
                                            <p className="text-xs text-muted-foreground">
                                                {editingService.active ? "Active - visible to users" : "Inactive - hidden from users"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                                        <Button variant="outline" onClick={cancelEdit} className="w-full sm:w-auto">
                                            <X className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSaveService} className="w-full sm:w-auto">
                                            <Save className="mr-2 h-4 w-4" />
                                            {isCreatingService ? "Create Service" : "Save Changes"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                {services.length > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => handleToggleAllServices(!hasActiveServices)}
                                        className="w-full sm:w-auto gap-2"
                                    >
                                        <Power className="h-4 w-4" />
                                        {hasActiveServices ? "Disable All" : "Enable All"}
                                    </Button>
                                )}
                                <Button onClick={handleCreateService} className="w-full sm:w-auto">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Service
                                </Button>
                            </div>
                        )}

                        {/* Services List */}
                        <div className="grid gap-4">
                            {services.length === 0 ? (
                                <Card className="p-8 text-center">
                                    <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                    <p className="text-muted-foreground">No services configured yet.</p>
                                    <p className="text-sm text-muted-foreground/70 mt-1">Add your first service above.</p>
                                </Card>
                            ) : (
                                services.map((service) => (
                                    <Card
                                        key={service._id}
                                        className={`transition-all duration-200 hover:shadow-md ${!service.active ? "opacity-60" : ""
                                            }`}
                                    >
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-base truncate">{service.name}</h3>
                                                        <Badge variant={service.active ? "default" : "secondary"} className="shrink-0">
                                                            {service.active ? "Active" : "Inactive"}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                        <code className="text-xs bg-muted px-2 py-0.5 rounded">{service.code}</code>
                                                        <span>•</span>
                                                        <Badge variant="outline" className="text-xs">{service.category}</Badge>
                                                        <span>•</span>
                                                        <span className="font-medium text-foreground">₹{service.price.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    {service.description && (
                                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIsCreatingService(false);
                                                            setEditingService(service);
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4 sm:mr-2" />
                                                        <span className="hidden sm:inline">Edit</span>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteService(service._id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4 sm:mr-2" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* App Settings Tab */}
                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings2 className="h-5 w-5 text-primary" />
                                    Application Settings
                                </CardTitle>
                                <CardDescription>
                                    Configure global application settings and defaults
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {settings.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Settings2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <p className="text-muted-foreground">No settings configured.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {settings.map((setting) => (
                                            <div
                                                key={setting.key}
                                                className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <code className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded inline-block mb-1">
                                                            {setting.key}
                                                        </code>
                                                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                                                    </div>
                                                    {editingSetting?.key !== setting.key && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setEditingSetting(setting)}
                                                            className="shrink-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                {editingSetting?.key === setting.key ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={editingSetting.value}
                                                            onChange={(e) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                                                            className="flex-1"
                                                        />
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setEditingSetting(null)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handleUpdateSetting(editingSetting)}
                                                        >
                                                            <Save className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="bg-muted/50 px-3 py-2 rounded-md overflow-hidden">
                                                        <code className="text-sm font-mono text-foreground/80 break-all block max-h-20 overflow-y-auto">
                                                            {setting.value}
                                                        </code>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
