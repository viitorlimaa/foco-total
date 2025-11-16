import { TextField } from "@radix-ui/themes";
import { Input } from "./input";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <TextField.Root className="w-full">
      <Input
        placeholder={placeholder ?? "Buscar..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </TextField.Root>
  );
}
