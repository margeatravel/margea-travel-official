import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, Link2, RefreshCw, Copy, ExternalLink, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useICalSync } from "@/hooks/useICalSync";

const translations = {
  en: {
    title: "Calendar Sync",
    subtitle: "Synchronize your property calendars with Airbnb, VRBO, and other platforms",
    exportTitle: "Export to Airbnb/VRBO",
    exportDesc: "Copy this iCal URL and paste it into Airbnb or VRBO to export your bookings",
    importTitle: "Import from Airbnb/VRBO",
    importDesc: "Add iCal URLs from Airbnb or VRBO to import their bookings and avoid double-bookings",
    selectProperty: "Select Property",
    copyUrl: "Copy iCal URL",
    copied: "Copied!",
    addUrl: "Add Calendar URL",
    urlPlaceholder: "https://www.airbnb.com/calendar/ical/...",
    add: "Add",
    remove: "Remove",
    syncNow: "Sync Now",
    syncing: "Syncing...",
    syncSuccess: "Calendars synced successfully!",
    syncError: "Error syncing calendars",
    noProperties: "No properties found. Please add a property first.",
    howTo: "How to Set Up Calendar Sync",
    step1: "Step 1: Export from Margea to Airbnb",
    step1desc: "Copy your property's iCal URL and add it to Airbnb's calendar import settings",
    step2: "Step 2: Import from Airbnb to Margea",
    step2desc: "Get your Airbnb calendar export URL and add it below to import their bookings",
    step3: "Step 3: Automatic Sync",
    step3desc: "Calendars sync automatically every 30 minutes, and immediately on page load.",
    airbnbGuide: "View Airbnb Guide",
    vrboGuide: "View VRBO Guide",
  },
  es: {
    title: "Sincronización de Calendario",
    subtitle: "Sincroniza los calendarios de tus propiedades con Airbnb, VRBO y otras plataformas",
    exportTitle: "Exportar a Airbnb/VRBO",
    exportDesc: "Copia esta URL iCal y pégala en Airbnb o VRBO para exportar tus reservas",
    importTitle: "Importar desde Airbnb/VRBO",
    importDesc: "Agrega URLs iCal de Airbnb o VRBO para importar sus reservas y evitar reservas dobles",
    selectProperty: "Seleccionar Propiedad",
    copyUrl: "Copiar URL iCal",
    copied: "¡Copiado!",
    addUrl: "Agregar URL de Calendario",
    urlPlaceholder: "https://www.airbnb.com/calendar/ical/...",
    add: "Agregar",
    remove: "Eliminar",
    syncNow: "Sincronizar Ahora",
    syncing: "Sincronizando...",
    syncSuccess: "¡Calendarios sincronizados exitosamente!",
    syncError: "Error al sincronizar calendarios",
    noProperties: "No se encontraron propiedades. Por favor, agrega una propiedad primero.",
    howTo: "Cómo Configurar la Sincronización de Calendario",
    step1: "Paso 1: Exportar de Margea a Airbnb",
    step1desc: "Copia la URL iCal de tu propiedad y agrégala a la configuración de importación de calendario de Airbnb",
    step2: "Paso 2: Importar de Airbnb a Margea",
    step2desc: "Obtén la URL de exportación del calendario de Airbnb y agrégala abajo para importar sus reservas",
    step3: "Paso 3: Sincronización Automática",
    step3desc: "Los calendarios se sincronizan automáticamente cada 30 minutos y al cargar la página.",
    airbnbGuide: "Ver Guía de Airbnb",
    vrboGuide: "Ver Guía de VRBO",
  },
};

export default function CalendarSync() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [newIcalUrl, setNewIcalUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const { isSyncing, lastSynced, triggerSync } = useICalSync(() => {
    fetchProperties();
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
      if (data && data.length > 0 && !selectedProperty) {
        setSelectedProperty(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Error loading properties");
    } finally {
      setLoading(false);
    }
  };

  const property = properties.find(p => p.id === selectedProperty);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const icalExportUrl = `${supabaseUrl}/functions/v1/ical-export?property_id=${selectedProperty}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t.copied);
  };

  const addIcalUrl = async () => {
    if (!newIcalUrl || !selectedProperty) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      const { data: currentProperty, error: fetchError } = await supabase
        .from("properties")
        .select("external_ical_urls")
        .eq("id", selectedProperty)
        .single();

      if (fetchError) throw fetchError;

      const currentUrls = currentProperty?.external_ical_urls || [];
      const updatedUrls = [...currentUrls, newIcalUrl];

      const { data, error } = await supabase
        .from("properties")
        .update({ external_ical_urls: updatedUrls })
        .eq("id", selectedProperty)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No data returned from update");

      toast.success("Calendar URL added successfully!");
      setNewIcalUrl("");
      await fetchProperties();
      // Trigger sync immediately after adding a new URL
      triggerSync();
    } catch (error: any) {
      console.error("Error adding iCal URL:", error);
      toast.error(`Error adding calendar URL: ${error.message || 'Unknown error'}`);
    }
  };

  const removeIcalUrl = async (urlToRemove: string) => {
    try {
      const urls = property?.external_ical_urls || [];
      const updatedUrls = urls.filter((url: string) => url !== urlToRemove);

      const { error } = await supabase
        .from("properties")
        .update({ external_ical_urls: updatedUrls })
        .eq("id", selectedProperty);

      if (error) throw error;

      toast.success("Calendar URL removed");
      fetchProperties();
    } catch (error) {
      console.error("Error removing iCal URL:", error);
      toast.error("Error removing calendar URL");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header + Status Indicator */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-card shadow-sm min-w-[210px]">
              <span
                className={`h-3 w-3 rounded-full flex-shrink-0 transition-colors ${
                  isSyncing
                    ? "bg-yellow-400 animate-pulse"
                    : lastSynced
                    ? "bg-green-500"
                    : "bg-yellow-400 animate-pulse"
                }`}
              />
              <div>
                <p className="text-sm font-semibold leading-none">
                  {isSyncing ? "Syncing…" : "Calendar Sync: ON"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isSyncing
                    ? "Fetching latest availability"
                    : lastSynced
                    ? `Last synced: ${lastSynced.toLocaleTimeString()}`
                    : "Updates automatically."}
                </p>
              </div>
            </div>
          </div>

          {properties.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">{t.noProperties}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Property Selector */}
              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor="property">{t.selectProperty}</Label>
                  <select
                    id="property"
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full mt-2 px-3 py-2 border rounded-md bg-background"
                  >
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title} - {prop.location}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              {/* Export Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    {t.exportTitle}
                  </CardTitle>
                  <CardDescription>{t.exportDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={icalExportUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={() => copyToClipboard(icalExportUrl)} variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      {t.copyUrl}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <a href="https://www.airbnb.com/help/article/99" target="_blank" rel="noopener noreferrer">
                      <Button variant="link" className="gap-2">
                        {t.airbnbGuide}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <a href="https://help.vrbo.com/articles/How-do-I-sync-my-calendar-with-other-websites" target="_blank" rel="noopener noreferrer">
                      <Button variant="link" className="gap-2">
                        {t.vrboGuide}
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Import Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    {t.importTitle}
                  </CardTitle>
                  <CardDescription>{t.importDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="icalUrl">{t.addUrl}</Label>
                      <Input
                        id="icalUrl"
                        value={newIcalUrl}
                        onChange={(e) => setNewIcalUrl(e.target.value)}
                        placeholder={t.urlPlaceholder}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={addIcalUrl} disabled={!newIcalUrl} className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t.add}
                    </Button>
                  </div>

                  {property?.external_ical_urls && property.external_ical_urls.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {property.external_ical_urls.map((url: string, index: number) => {
                          const source = url.includes("airbnb")
                            ? "Airbnb"
                            : url.includes("vrbo")
                            ? "VRBO"
                            : "External";
                          return (
                            <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-foreground">{source}</p>
                                <p className="text-xs text-muted-foreground truncate">{url}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeIcalUrl(url)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Manual Sync Button */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center gap-2">
                  <Button
                    onClick={() => triggerSync()}
                    disabled={isSyncing}
                    size="lg"
                    className="gap-2"
                  >
                    <RefreshCw className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? t.syncing : t.syncNow}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Runs automatically every 30 minutes. You can also sync manually anytime.
                  </p>
                </CardContent>
              </Card>

              {/* How-To Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.howTo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">{t.step1}</h3>
                    <p className="text-sm text-muted-foreground">{t.step1desc}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.step2}</h3>
                    <p className="text-sm text-muted-foreground">{t.step2desc}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.step3}</h3>
                    <p className="text-sm text-muted-foreground">{t.step3desc}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
