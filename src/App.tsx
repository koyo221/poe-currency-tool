import { useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { CurrencyRow } from "./components/CurrencyRow";
import { DEFAULT_CURRENCIES } from "./data/currencies";
import type { CurrencyItem } from "./types";

function createItem(): CurrencyItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    divinePriceNumerator: "",
    divinePriceDenominator: "",
    chaosPriceNumerator: "",
    chaosPriceDenominator: "",
  };
}

function App() {
  const [divineRate, setDivineRate] = useLocalStorage("divineRate", "");
  const [items, setItems] = useLocalStorage<CurrencyItem[]>("items", [
    createItem(),
  ]);
  const [customCurrencies, setCustomCurrencies] = useLocalStorage<string[]>(
    "customCurrencies",
    []
  );

  const rate = parseFloat(divineRate);

  const currencyOptions = useMemo(() => {
    const set = new Set([...DEFAULT_CURRENCIES, ...customCurrencies]);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [customCurrencies]);

  const updateItem = (index: number, item: CurrencyItem) => {
    const next = [...items];
    next[index] = item;
    setItems(next);
    if (
      item.name &&
      !DEFAULT_CURRENCIES.includes(item.name) &&
      !customCurrencies.includes(item.name)
    ) {
      setCustomCurrencies([...customCurrencies, item.name]);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, createItem()]);
  };

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          PoE1 Currency Exchange Calculator
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Compare Divine Orb vs Chaos Orb prices to find the best deal. Enter
          the current Divine-to-Chaos rate, then add items with their prices in
          both currencies.
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <label className="flex items-center gap-3 text-sm">
          <span className="text-gray-300 whitespace-nowrap">
            1 Divine Orb =
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={divineRate}
            onChange={(e) => setDivineRate(e.target.value)}
            placeholder="e.g. 200"
            className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-blue-400"
          />
          <span className="text-yellow-200">Chaos Orbs</span>
        </label>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <CurrencyRow
            key={item.id}
            item={item}
            divineRate={rate}
            currencyOptions={currencyOptions}
            onChange={(updated) => updateItem(i, updated)}
            onRemove={() => removeItem(i)}
          />
        ))}
      </div>

      <button
        onClick={addItem}
        className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-400 transition-colors cursor-pointer"
      >
        + Add Item
      </button>
    </div>
  );
}

export default App;
