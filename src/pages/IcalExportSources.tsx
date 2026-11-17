import { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";

// Mirrors listingIdFromSourceUrl in ical-export
const listingIdFromSourceUrl = (sourceUrl: string): string | null => {
  const match = sourceUrl.match(/\/ical\/([^/?.]+)\.ics/i) ?? sourceUrl.match(/(\d{8,})/);
  return match ? match[1] : null;
};

const channelFromUrl = (url: string): string => {
  const lower = url.toLowerCase();
  if (lower.includes("airbnb.mx")) return "Airbnb .mx";
  if (lower.includes("airbnb.com")) return "Airbnb .com";
  if (lower.includes("vrbo") || lower.includes("homeaway")) return "VRBO";
  return "Otro";
};

interface Row {
  propiedad: string;
  property_id: string;
  source_id: string;
  canal: string;
  source_url: string;
  url_para_pegar: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function IcalExportSources() {
  const { language, setLanguage } = useLanguage();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("id, title, external_ical_urls")
          .not("external_ical_urls", "is", null);

        if (error) throw error;

        const built: Row[] = [];
        for (const p of data ?? []) {
          const urls: string[] = p.external_ical_urls || [];
          for (const url of urls) {
            const sourceId = listingIdFromSourceUrl(url);
            built.push({
              propiedad: p.title,
              property_id: p.id,
              source_id: sourceId ?? "(sin id)",
              canal: channelFromUrl(url),
              source_url: url,
              url_para_pegar: `${SUPABASE_URL}/functions/v1/ical-export?property_id=${p.id}&exclude_source=${sourceId ?? ""}`,
            });
          }
        }
        // Group by property, then by channel for readability
        built.sort((a, b) =>
          a.propiedad.localeCompare(b.propiedad) || a.canal.localeCompare(b.canal)
        );
        setRows(built);
      } catch (error) {
        console.error("Error loading properties:", error);
        toast.error("Error al cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const copyUrl = async (row: Row, idx: number) => {
    await navigator.clipboard.writeText(row.url_para_pegar);
    setCopiedIdx(idx);
    toast.success("URL copiada");
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const exportCsv = () => {
    const header = "Propiedad,property_id,source_id,Canal,URL_para_pegar";
    const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header,
      ...rows.map((r) =>
        [r.propiedad, r.property_id, r.source_id, r.canal, r.url_para_pegar].map(escape).join(",")
      ),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ical-export-sources.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("CSV descargado");
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const r of rows) {
      const list = map.get(r.propiedad) ?? [];
      list.push(r);
      map.set(r.propiedad, list);
    }
    return Array.from(map.entries());
  }, [rows]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Fuentes de exportación iCal</h1>
              <p className="text-muted-foreground">
                Vista de solo lectura. Una fila por cada calendario externo enlazado. Pega en cada
                anuncio la URL cuyo <code>exclude_source</code> coincida con el <em>source_id</em> de
                esa misma fila.
              </p>
            </div>
            <Button onClick={exportCsv} disabled={rows.length === 0} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <div className="text-lg">Cargando…</div>
            </div>
          ) : rows.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No hay propiedades con calendarios externos enlazados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {grouped.map(([propiedad, propRows]) => (
                <Card key={propiedad}>
                  <CardHeader>
                    <CardTitle className="text-lg">{propiedad}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      property_id: {propRows[0].property_id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b">
                          <th className="py-2 pr-4 font-medium">source_id</th>
                          <th className="py-2 pr-4 font-medium">Canal</th>
                          <th className="py-2 pr-4 font-medium">URL para pegar</th>
                          <th className="py-2 font-medium sr-only">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propRows.map((r) => {
                          const idx = rows.indexOf(r);
                          return (
                            <tr key={r.source_url} className="border-b last:border-0">
                              <td className="py-2 pr-4 font-mono text-xs">{r.source_id}</td>
                              <td className="py-2 pr-4 whitespace-nowrap">{r.canal}</td>
                              <td className="py-2 pr-4">
                                <span className="font-mono text-xs break-all text-muted-foreground">
                                  {r.url_para_pegar}
                                </span>
                              </td>
                              <td className="py-2 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyUrl(r, idx)}
                                  className="gap-1"
                                >
                                  {copiedIdx === idx ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  {copiedIdx === idx ? "Copiada" : "Copiar"}
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
