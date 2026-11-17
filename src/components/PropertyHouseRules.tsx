import { Users, Baby, Calendar, ShieldCheck, DollarSign, PawPrint } from "lucide-react";

interface HouseRule {
  icon: React.ReactNode;
  label: string;
  detail: string;
}

interface PropertyHouseRulesProps {
  rules: HouseRule[];
}

export function PropertyHouseRules({ rules }: PropertyHouseRulesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">House Rules & Policies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rules.map((rule, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
              {rule.icon}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm">{rule.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{rule.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pre-built rule sets for specific properties
export function getCasaAzanikRules() {
  return [
    {
      icon: <Users className="h-5 w-5" />,
      label: "Max Occupancy: 20 guests",
      detail: "Up to 14 adults allowed (remaining guests may be children).",
    },
    {
      icon: <Baby className="h-5 w-5" />,
      label: "Base rate includes 14 guests",
      detail: "Additional children (above 14 total) at $50 USD per child, per night.",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Minimum Stay",
      detail: "7 nights for Christmas, New Year & Presidents Week. 3 nights for all other seasons.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Security Deposit: $350 USD",
      detail: "Fully refundable after your stay, provided there are no damages or issues.",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: "Currency",
      detail: "All rates are quoted in US dollars per night.",
    },
    {
      icon: <PawPrint className="h-5 w-5" />,
      label: "No Pets Allowed",
      detail: "Unfortunately, pets are not permitted at this property.",
    },
  ];
}
