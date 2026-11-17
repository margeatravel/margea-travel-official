import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  minLength: number;
  maxLength: number;
}

const COUNTRIES: Country[] = [
  // Featured countries (shown first)
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", placeholder: "202 555 0123", minLength: 10, maxLength: 10 },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽", placeholder: "55 1234 5678", minLength: 10, maxLength: 10 },
  // Alphabetical list (includes US and Mexico again for scrolling)
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷", placeholder: "11 1234 5678", minLength: 10, maxLength: 11 },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹", placeholder: "664 123456", minLength: 7, maxLength: 13 },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪", placeholder: "470 12 34 56", minLength: 9, maxLength: 9 },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷", placeholder: "11 91234 5678", minLength: 10, maxLength: 11 },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", placeholder: "416 555 0123", minLength: 10, maxLength: 10 },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱", placeholder: "9 1234 5678", minLength: 9, maxLength: 9 },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳", placeholder: "131 2345 6789", minLength: 11, maxLength: 11 },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴", placeholder: "301 123 4567", minLength: 10, maxLength: 10 },
  { code: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷", placeholder: "8123 4567", minLength: 8, maxLength: 8 },
  { code: "CZ", name: "Czechia", dialCode: "+420", flag: "🇨🇿", placeholder: "601 123 456", minLength: 9, maxLength: 9 },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰", placeholder: "32 12 34 56", minLength: 8, maxLength: 8 },
  { code: "DO", name: "Dominican Republic", dialCode: "+1", flag: "🇩🇴", placeholder: "809 123 4567", minLength: 10, maxLength: 10 },
  { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨", placeholder: "99 123 4567", minLength: 9, maxLength: 9 },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷", placeholder: "6 12 34 56 78", minLength: 9, maxLength: 9 },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪", placeholder: "151 12345678", minLength: 10, maxLength: 11 },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷", placeholder: "691 234 5678", minLength: 10, maxLength: 10 },
  { code: "GT", name: "Guatemala", dialCode: "+502", flag: "🇬🇹", placeholder: "5123 4567", minLength: 8, maxLength: 8 },
  { code: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰", placeholder: "5123 4567", minLength: 8, maxLength: 8 },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", placeholder: "81234 56789", minLength: 10, maxLength: 10 },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩", placeholder: "812 345 6789", minLength: 9, maxLength: 12 },
  { code: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪", placeholder: "85 012 3456", minLength: 9, maxLength: 9 },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹", placeholder: "312 345 6789", minLength: 9, maxLength: 10 },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵", placeholder: "90 1234 5678", minLength: 10, maxLength: 10 },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾", placeholder: "12 345 6789", minLength: 9, maxLength: 10 },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽", placeholder: "55 1234 5678", minLength: 10, maxLength: 10 },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱", placeholder: "6 12345678", minLength: 9, maxLength: 9 },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴", placeholder: "406 12 345", minLength: 8, maxLength: 8 },
  { code: "PA", name: "Panama", dialCode: "+507", flag: "🇵🇦", placeholder: "6123 4567", minLength: 8, maxLength: 8 },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪", placeholder: "912 345 678", minLength: 9, maxLength: 9 },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭", placeholder: "905 123 4567", minLength: 10, maxLength: 10 },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱", placeholder: "512 345 678", minLength: 9, maxLength: 9 },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹", placeholder: "912 345 678", minLength: 9, maxLength: 9 },
  { code: "PR", name: "Puerto Rico", dialCode: "+1", flag: "🇵🇷", placeholder: "787 123 4567", minLength: 10, maxLength: 10 },
  { code: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴", placeholder: "712 345 678", minLength: 9, maxLength: 9 },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦", placeholder: "51 234 5678", minLength: 9, maxLength: 9 },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬", placeholder: "8123 4567", minLength: 8, maxLength: 8 },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷", placeholder: "10 1234 5678", minLength: 9, maxLength: 10 },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸", placeholder: "612 34 56 78", minLength: 9, maxLength: 9 },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪", placeholder: "70 123 45 67", minLength: 9, maxLength: 9 },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭", placeholder: "78 123 45 67", minLength: 9, maxLength: 9 },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭", placeholder: "81 234 5678", minLength: 9, maxLength: 9 },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷", placeholder: "501 234 5678", minLength: 10, maxLength: 10 },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪", placeholder: "50 123 4567", minLength: 9, maxLength: 9 },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧", placeholder: "7400 123456", minLength: 10, maxLength: 10 },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸", placeholder: "202 555 0123", minLength: 10, maxLength: 10 },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳", placeholder: "91 234 56 78", minLength: 9, maxLength: 10 },
];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (e164: string, isValid: boolean) => void;
  id?: string;
  required?: boolean;
  className?: string;
}

export function PhoneInputWithCountry({
  value,
  onChange,
  id = "phone",
  required = false,
  className = "",
}: PhoneInputWithCountryProps) {
  const [countryCode, setCountryCode] = useState("MX");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedCountry = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES;
    const lower = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.dialCode.includes(search) ||
        c.code.toLowerCase().includes(lower)
    );
  }, [search]);

  // Parse initial value if it's in E.164 format
  useEffect(() => {
    if (value && value.startsWith("+")) {
      for (const country of COUNTRIES) {
        if (value.startsWith(country.dialCode)) {
          setCountryCode(country.code);
          setPhoneNumber(value.slice(country.dialCode.length));
          return;
        }
      }
    }
  }, []);

  const normalizePhone = (input: string): string => {
    return input.replace(/\D/g, "");
  };

  const validateAndEmit = (phone: string, country: Country) => {
    const digits = normalizePhone(phone);

    if (digits.length === 0) {
      setError("");
      onChange("", false);
      return;
    }

    if (digits.length < country.minLength) {
      setError(`Number too short (min ${country.minLength} digits)`);
      onChange("", false);
      return;
    }

    if (digits.length > country.maxLength) {
      setError(`Number too long (max ${country.maxLength} digits)`);
      onChange("", false);
      return;
    }

    setError("");
    const e164 = `${country.dialCode}${digits}`;
    onChange(e164, true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cleaned = rawValue.replace(/[^\d\s\-]/g, "");
    setPhoneNumber(cleaned);
    validateAndEmit(cleaned, selectedCountry);
  };

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.code);
    setOpen(false);
    setSearch("");
    validateAndEmit(phoneNumber, country);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[85px] md:w-[100px] justify-between px-2 h-10 shrink-0"
            >
              <span className="flex items-center gap-1">
                <span className="text-base">{selectedCountry.flag}</span>
                <span className="text-xs text-muted-foreground">{selectedCountry.dialCode}</span>
              </span>
              <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            <div className="max-h-[250px] overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors",
                    countryCode === country.code && "bg-accent"
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <span className="text-xs text-muted-foreground">{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No country found
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={selectedCountry.placeholder}
          required={required}
          className="flex-1 h-10"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
