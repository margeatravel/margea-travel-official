import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import { validateMemberCode, calculateDiscount, MemberCode } from "@/config/member-codes";

interface MemberCodeInputProps {
  subtotal: number;
  onDiscountApplied: (discount: number, code: MemberCode | null) => void;
  language?: "en" | "es";
}

export function MemberCodeInput({
  subtotal,
  onDiscountApplied,
  language = "en",
}: MemberCodeInputProps) {
  const [inputCode, setInputCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<MemberCode | null>(null);
  const [error, setError] = useState("");

  const t = {
    en: {
      memberCode: "Member Code",
      apply: "Apply",
      remove: "Remove",
      applied: "Member Code applied",
      invalid: "Invalid Member Code",
    },
    es: {
      memberCode: "Código de Miembro",
      apply: "Aplicar",
      remove: "Quitar",
      applied: "Código de Miembro aplicado",
      invalid: "Código de Miembro inválido",
    },
  };

  const handleApply = () => {
    setError("");
    
    if (!inputCode.trim()) {
      setError(t[language].invalid);
      return;
    }

    const validCode = validateMemberCode(inputCode);
    
    if (validCode) {
      const discount = calculateDiscount(subtotal, validCode);
      setAppliedCode(validCode);
      onDiscountApplied(discount, validCode);
      setError("");
    } else {
      setError(t[language].invalid);
      setAppliedCode(null);
      onDiscountApplied(0, null);
    }
  };

  const handleRemove = () => {
    setInputCode("");
    setAppliedCode(null);
    setError("");
    onDiscountApplied(0, null);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{t[language].memberCode}</Label>
      <div className="flex gap-2">
        <Input
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          placeholder="CODE123"
          className="flex-1"
          disabled={!!appliedCode}
        />
        {appliedCode ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="shrink-0"
          >
            <X className="w-4 h-4 mr-1" />
            {t[language].remove}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleApply}
            className="shrink-0"
          >
            {t[language].apply}
          </Button>
        )}
      </div>
      
      {appliedCode && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <Check className="w-4 h-4" />
          {t[language].applied}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
