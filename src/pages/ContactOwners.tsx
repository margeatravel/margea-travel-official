import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInputWithCountry } from "@/components/PhoneInputWithCountry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const translations = {
  en: {
    eyebrow: "MARGEA PROPERTIES",
    title: "Tell us about your property",
    subtitle: "We'll get back to you in less than 24 hours with a free earnings estimate.",
    fullName: "Full name",
    email: "Email",
    phone: "Phone",
    location: "Property location",
    propertyType: "Property type",
    bedrooms: "Number of bedrooms",
    renting: "Are you currently renting it?",
    yes: "Yes",
    no: "No",
    anything: "Anything else you'd like to share?",
    placeholder: "Optional...",
    submit: "Send my information →",
    sending: "Sending...",
    required: "This field is required",
    invalidEmail: "Please enter a valid email",
    invalidPhone: "Please enter a valid phone number",
    locations: ["Cancún", "Tulum", "Playa del Carmen", "Puerto Morelos", "Akumal", "Isla Mujeres", "Other"],
    types: ["Villa", "Apartment", "Condo", "House", "Other"],
  },
  es: {
    eyebrow: "MARGEA PROPERTIES",
    title: "Cuéntanos sobre tu propiedad",
    subtitle: "Te respondemos en menos de 24 horas con una estimación gratuita de ingresos.",
    fullName: "Nombre completo",
    email: "Email",
    phone: "Teléfono",
    location: "Ubicación de la propiedad",
    propertyType: "Tipo de propiedad",
    bedrooms: "Número de recámaras",
    renting: "¿La rentas actualmente?",
    yes: "Sí",
    no: "No",
    anything: "¿Algo más que quieras contarnos?",
    placeholder: "Opcional...",
    submit: "Enviar mi información →",
    sending: "Enviando...",
    required: "Este campo es obligatorio",
    invalidEmail: "Ingresa un email válido",
    invalidPhone: "Ingresa un número de teléfono válido",
    locations: ["Cancún", "Tulum", "Playa del Carmen", "Puerto Morelos", "Akumal", "Isla Mujeres", "Otro"],
    types: ["Villa", "Departamento", "Condo", "Casa", "Otro"],
  },
};

const typeValues = ["villa", "apartment", "condo", "house", "other"];
const locationValues = ["cancun", "tulum", "playa-del-carmen", "puerto-morelos", "akumal", "isla-mujeres", "other"];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function ContactOwners() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    renting: "",
    notes: "",
  });
  const [phoneValid, setPhoneValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = t.required;
    if (!form.email.trim()) e.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.invalidEmail;
    if (!form.phone.trim() || !phoneValid) e.phone = !form.phone.trim() ? t.required : t.invalidPhone;
    if (!form.location) e.location = t.required;
    if (!form.propertyType) e.propertyType = t.required;
    if (!form.bedrooms) e.bedrooms = t.required;
    if (!form.renting) e.renting = t.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    try {
      // Send form data via edge function
      await supabase.functions.invoke("send-owner-contact-notification", {
        body: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          propertyType: form.propertyType,
          bedrooms: form.bedrooms,
          renting: form.renting,
          notes: form.notes,
        },
      });

      // Fire Meta Pixel Lead event
      if (window.fbq) {
        window.fbq("track", "Lead");
      }
      // Redirect to thank you
      window.location.href = "/thank-you";
    } catch {
      setSending(false);
    }
  };

  const inputClasses = (field: string) =>
    `w-full rounded-lg border px-4 py-3.5 text-sm bg-background outline-none transition-all ${
      errors[field]
        ? "border-[#c0392b] focus:border-[#c0392b] focus:shadow-[0_0_0_3px_rgba(192,57,43,0.08)]"
        : "border-[#e5e7eb] focus:border-[#1d2839] focus:shadow-[0_0_0_3px_rgba(29,40,57,0.08)]"
    }`;

  return (
    <div className="min-h-screen bg-white">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="max-w-[560px] mx-auto px-6 py-20 md:py-24">
        {/* Header */}
        <p
          className="text-xs font-sans uppercase tracking-[0.2em] mb-4"
          style={{ color: "#c9a96e" }}
        >
          {t.eyebrow}
        </p>
        <h1
          className="font-serif font-normal leading-tight mb-3"
          style={{ color: "#1d2839", fontSize: "clamp(28px, 5vw, 40px)" }}
        >
          {t.title}
        </h1>
        <p className="text-[15px] mb-10" style={{ color: "#6b7280" }}>
          {t.subtitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          {/* Full Name */}
          <Field label={t.fullName} error={errors.fullName}>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className={inputClasses("fullName")}
            />
          </Field>

          {/* Email */}
          <Field label={t.email} error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClasses("email")}
            />
          </Field>

          {/* Phone */}
          <Field label={t.phone} error={errors.phone}>
            <PhoneInputWithCountry
              value={form.phone}
              onChange={(val, isValid) => {
                setForm({ ...form, phone: val });
                setPhoneValid(isValid);
              }}
            />
          </Field>

          {/* Location */}
          <Field label={t.location} error={errors.location}>
            <Select
              value={form.location}
              onValueChange={(val) => {
                setForm({ ...form, location: val });
                setErrors((prev) => ({ ...prev, location: "" }));
              }}
            >
              <SelectTrigger className={`${inputClasses("location")} h-auto`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {t.locations.map((loc, i) => (
                  <SelectItem key={locationValues[i]} value={locationValues[i]}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Property Type */}
          <Field label={t.propertyType} error={errors.propertyType}>
            <Select
              value={form.propertyType}
              onValueChange={(val) => {
                setForm({ ...form, propertyType: val });
                setErrors((prev) => ({ ...prev, propertyType: "" }));
              }}
            >
              <SelectTrigger className={`${inputClasses("propertyType")} h-auto`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {t.types.map((typ, i) => (
                  <SelectItem key={typeValues[i]} value={typeValues[i]}>
                    {typ}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Bedrooms */}
          <Field label={t.bedrooms} error={errors.bedrooms}>
            <Select
              value={form.bedrooms}
              onValueChange={(val) => {
                setForm({ ...form, bedrooms: val });
                setErrors((prev) => ({ ...prev, bedrooms: "" }));
              }}
            >
              <SelectTrigger className={`${inputClasses("bedrooms")} h-auto`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["1", "2", "3", "4", "5+"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Currently renting? */}
          <Field label={t.renting} error={errors.renting}>
            <div className="flex gap-6 mt-1">
              {[
                { value: "yes", label: t.yes },
                { value: "no", label: t.no },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="renting"
                    value={opt.value}
                    checked={form.renting === opt.value}
                    onChange={() => {
                      setForm({ ...form, renting: opt.value });
                      setErrors((prev) => ({ ...prev, renting: "" }));
                    }}
                    className="w-4 h-4 accent-[#1d2839]"
                  />
                  <span className="text-sm" style={{ color: "#374151" }}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          {/* Notes */}
          <Field label={t.anything}>
            <Textarea
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value.slice(0, 500) })
              }
              placeholder={t.placeholder}
              maxLength={500}
              className={inputClasses("notes")}
              style={{ minHeight: 100 }}
            />
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full text-white text-sm font-bold tracking-wide py-[18px] rounded-lg border-none transition-colors disabled:opacity-60"
            style={{
              backgroundColor: sending ? "#2d3f55" : "#1d2839",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              if (!sending) (e.target as HTMLButtonElement).style.backgroundColor = "#2d3f55";
            }}
            onMouseLeave={(e) => {
              if (!sending) (e.target as HTMLButtonElement).style.backgroundColor = "#1d2839";
            }}
          >
            {sending ? t.sending : t.submit}
          </button>
        </form>
      </main>

      <Footer language={language} />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        className="block text-[13px] font-semibold mb-1.5"
        style={{ color: "#374151" }}
      >
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs mt-1" style={{ color: "#c0392b" }}>
          {error}
        </p>
      )}
    </div>
  );
}
