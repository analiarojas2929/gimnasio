export function normalizeChileMobile(value) {
  const digits = String(value).replace(/\D/g, "");
  const national = digits.startsWith("56") ? digits.slice(2) : digits;
  return national.slice(0, 9);
}

export function formatChilePhone(value) {
  const digits = normalizeChileMobile(value);
  if (!digits) return "";

  const firstGroup = digits[0];
  const secondGroup = digits.slice(1, 5);
  const thirdGroup = digits.slice(5, 9);

  return ["+56", firstGroup, secondGroup, thirdGroup].filter(Boolean).join(" ");
}

function formatNationalNumber(value) {
  const digits = normalizeChileMobile(value);
  if (digits.length <= 1) return digits;
  if (digits.length <= 5) return `${digits[0]} ${digits.slice(1)}`;
  return `${digits[0]} ${digits.slice(1, 5)} ${digits.slice(5)}`;
}

export default function ChileMobileInput({
  id,
  label = "Celular",
  value,
  onChange,
  error,
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/80">
        {label}
      </label>
      <div
        className={`flex min-h-12 items-center rounded border bg-[#101010] focus-within:border-neon ${
          error ? "border-red-400/70" : "border-white/15"
        }`}
      >
        <span className="border-r border-white/10 px-3 text-sm text-white/65" aria-hidden="true">
          +56
        </span>
        <input
          id={id}
          name={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatNationalNumber(value)}
          onChange={(event) => onChange(normalizeChileMobile(event.target.value))}
          placeholder="9 1234 5678"
          aria-label={`${label}, número nacional de 9 dígitos`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : `${id}-hint`}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-white/40">
          Ingresa 9 dígitos; debe comenzar en 9.
        </p>
      )}
    </div>
  );
}