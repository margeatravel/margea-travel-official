import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

interface Property {
  id: string;
  title: string;
  price_per_night: number;
}

interface SeasonalPricing {
  id: string;
  property_id: string;
  name: string;
  start_date: string;
  end_date: string;
  price_modifier: number;
}

export default function SeasonalPricing() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [pricingRules, setPricingRules] = useState<SeasonalPricing[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priceModifier, setPriceModifier] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchPricingRules();
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, price_per_night")
      .order("title");

    if (error) {
      toast.error("Error loading properties");
      return;
    }

    setProperties(data || []);
    if (data && data.length > 0) {
      setSelectedProperty(data[0].id);
    }
  };

  const fetchPricingRules = async () => {
    const { data, error } = await supabase
      .from("seasonal_pricing")
      .select("*")
      .eq("property_id", selectedProperty)
      .order("start_date");

    if (error) {
      toast.error("Error loading pricing rules");
      return;
    }

    setPricingRules(data || []);
  };

  const handleAddRule = async () => {
    if (!seasonName || !startDate || !endDate || !priceModifier) {
      toast.error("Please fill in all fields");
      return;
    }

    const modifierValue = parseFloat(priceModifier);
    if (isNaN(modifierValue) || modifierValue <= 0) {
      toast.error("Price modifier must be a positive number");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("seasonal_pricing").insert({
        property_id: selectedProperty,
        name: seasonName,
        start_date: startDate,
        end_date: endDate,
        price_modifier: modifierValue / 100 + 1, // Convert percentage to multiplier
      });

      if (error) throw error;

      toast.success("Seasonal pricing rule added");
      setSeasonName("");
      setStartDate("");
      setEndDate("");
      setPriceModifier("");
      fetchPricingRules();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add pricing rule");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return;

    try {
      const { error } = await supabase
        .from("seasonal_pricing")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Pricing rule deleted");
      fetchPricingRules();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete pricing rule");
    }
  };

  const selectedPropertyData = properties.find((p) => p.id === selectedProperty);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Seasonal Pricing</h1>
          <p className="text-muted-foreground">
            Manage seasonal pricing rules for your properties
          </p>
        </div>

        {/* Property Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Property</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPropertyData && (
              <p className="text-sm text-muted-foreground mt-2">
                Base price: ${selectedPropertyData.price_per_night} MXN per night
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add New Rule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Seasonal Pricing Rule
            </CardTitle>
            <CardDescription>
              Set different prices for specific date ranges. For example, +10% for high season.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="season-name">Season Name</Label>
              <Input
                id="season-name"
                placeholder="e.g., High Season - Christmas"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="price-modifier">Price Change (%)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="price-modifier"
                  type="number"
                  placeholder="e.g., 10 for +10%, -20 for -20%"
                  value={priceModifier}
                  onChange={(e) => setPriceModifier(e.target.value)}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              {priceModifier && selectedPropertyData && (
                <p className="text-sm text-muted-foreground mt-1">
                  New price: ${(
                    selectedPropertyData.price_per_night *
                    (1 + parseFloat(priceModifier || "0") / 100)
                  ).toFixed(0)}{" "}
                  MXN per night
                </p>
              )}
            </div>

            <Button onClick={handleAddRule} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Pricing Rule"}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Pricing Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pricingRules.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No seasonal pricing rules set for this property
              </p>
            ) : (
              <div className="space-y-3">
                {pricingRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(rule.start_date), "MMM dd, yyyy")} -{" "}
                        {format(new Date(rule.end_date), "MMM dd, yyyy")}
                      </p>
                      <p className="text-sm mt-1">
                        Price modifier:{" "}
                        <span className="font-semibold text-primary">
                          {((rule.price_modifier - 1) * 100).toFixed(0)}%
                        </span>
                        {selectedPropertyData && (
                          <span className="text-muted-foreground ml-2">
                            (${(selectedPropertyData.price_per_night * rule.price_modifier).toFixed(0)} MXN/night)
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
