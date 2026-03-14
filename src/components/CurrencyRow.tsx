import { CurrencyCombobox } from "./CurrencyCombobox";
import type { CurrencyItem } from "../types";

interface Props {
  item: CurrencyItem;
  divineRate: number;
  currencyOptions: string[];
  onChange: (item: CurrencyItem) => void;
  onRemove: () => void;
}

function parseFraction(numerator: string, denominator: string): number | null {
  const n = parseFloat(numerator);
  const d = parseFloat(denominator);
  if (!n || !d || d === 0) return null;
  return n / d;
}

export function CurrencyRow({ item, divineRate, currencyOptions, onChange, onRemove }: Props) {
  const divPrice = parseFraction(
    item.divinePriceNumerator,
    item.divinePriceDenominator
  );
  const chaosPrice = parseFraction(
    item.chaosPriceNumerator,
    item.chaosPriceDenominator
  );

  let result: { text: string; color: string } | null = null;

  if (divPrice !== null && chaosPrice !== null && divineRate > 0) {
    const chaosCostViaDivine = divPrice * divineRate;
    const chaosCostViaChaos = chaosPrice;

    if (chaosCostViaDivine < chaosCostViaChaos) {
      const saved = chaosCostViaChaos - chaosCostViaDivine;
      const pct = ((saved / chaosCostViaChaos) * 100).toFixed(1);
      result = {
        text: `Buy with Divine is cheaper (save ${saved.toFixed(1)}c / ${pct}%)`,
        color: "text-amber-400",
      };
    } else if (chaosCostViaChaos < chaosCostViaDivine) {
      const saved = chaosCostViaDivine - chaosCostViaChaos;
      const pct = ((saved / chaosCostViaDivine) * 100).toFixed(1);
      result = {
        text: `Buy with Chaos is cheaper (save ${saved.toFixed(1)}c / ${pct}%)`,
        color: "text-yellow-200",
      };
    } else {
      result = { text: "Same price", color: "text-gray-400" };
    }
  }

  const inputClass =
    "w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white text-sm focus:outline-none focus:border-blue-400";

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center gap-3 flex-wrap">
        <CurrencyCombobox
          value={item.name}
          onChange={(name) => onChange({ ...item, name })}
          options={currencyOptions}
        />

        <div className="flex items-center gap-1 text-sm">
          <input
            type="text"
            inputMode="decimal"
            value={item.divinePriceNumerator}
            onChange={(e) =>
              onChange({ ...item, divinePriceNumerator: e.target.value })
            }
            placeholder="1"
            className={inputClass}
          />
          <span className="text-gray-400">/</span>
          <input
            type="text"
            inputMode="decimal"
            value={item.divinePriceDenominator}
            onChange={(e) =>
              onChange({ ...item, divinePriceDenominator: e.target.value })
            }
            placeholder="1"
            className={inputClass}
          />
          <span className="text-amber-400 ml-1">div</span>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <input
            type="text"
            inputMode="decimal"
            value={item.chaosPriceNumerator}
            onChange={(e) =>
              onChange({ ...item, chaosPriceNumerator: e.target.value })
            }
            placeholder="1"
            className={inputClass}
          />
          <span className="text-gray-400">/</span>
          <input
            type="text"
            inputMode="decimal"
            value={item.chaosPriceDenominator}
            onChange={(e) =>
              onChange({ ...item, chaosPriceDenominator: e.target.value })
            }
            placeholder="1"
            className={inputClass}
          />
          <span className="text-yellow-200 ml-1">c</span>
        </div>

        <button
          onClick={onRemove}
          className="text-gray-500 hover:text-red-400 transition-colors ml-auto text-lg cursor-pointer"
          title="Remove"
        >
          ×
        </button>
      </div>

      {result && (
        <div className={`mt-2 text-sm font-medium ${result.color}`}>
          → {result.text}
        </div>
      )}
    </div>
  );
}
