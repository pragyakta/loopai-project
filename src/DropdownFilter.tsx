import React from "react";

interface OptionType {
  label: string;
  value: any;
}

interface DropdownFilterProps {
  options: OptionType[];
  selectedValues: OptionType[];
  onChange: (selectedOptions: OptionType[]) => void;
  isMulti?: boolean;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  selectedValues,
  onChange,
  isMulti = false,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => ({
        label: option.label,
        value: option.value,
      })
    );
    onChange(selectedOptions);
  };

  return (
    <select
      multiple={isMulti}
      value={selectedValues.map((option) => option.value)}
      onChange={handleChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownFilter;
