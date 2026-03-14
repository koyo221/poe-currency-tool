import { useState, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function CurrencyCombobox({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes((open ? query : "").toLowerCase())
  );

  const handleFocus = () => {
    setQuery("");
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    if (!open) setOpen(true);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={ref} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={open ? query || value : value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Search or type..."
        className="w-44 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-400"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-1 w-56 max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded shadow-lg">
          {filtered.map((option) => (
            <li
              key={option}
              onMouseDown={() => handleSelect(option)}
              className="px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
