import { type UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
} from "@/components/nyxb-ui/multi-select";
import { useState } from "react";

type MultiSelectOption = {
  value: string;
  label: string;
  group?: string;
};

interface FormMultiSelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  data: MultiSelectOption[];
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  placeholder?: string;
}

function search(data: any[], keyword?: string) {
  if (!keyword) return data;
  const lowerKeyword = keyword.toLowerCase();
  const filtered = data.filter((item) =>
    item.label.toLowerCase().includes(lowerKeyword)
  );

  if (!filtered.length) {
    return [
      {
        label: keyword,
        value: keyword,
      },
    ];
  }

  return filtered;
}

function FormMultiSelectField({
  form,
  name,
  label,
  withAsterisk = false,
  placeholder,
  description,
  data = [],
}: FormMultiSelectFieldProps) {
  const [options, setOptions] = useState<MultiSelectOption[]>(() => data);

  const handleSearch = async (keyword: string) => {
    const newOptions = search(data, keyword);
    setOptions(newOptions);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label}{" "}
              {withAsterisk && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <MultiSelect
            onValueChange={field.onChange}
            defaultValue={field.value}
            onSearch={(keyword) => handleSearch(keyword ?? "")}
          >
            <FormControl>
              <MultiSelectTrigger>
                <MultiSelectValue placeholder={placeholder} />
              </MultiSelectTrigger>
            </FormControl>
            <MultiSelectContent>
              <MultiSelectSearch />
              <MultiSelectList>
                {renderMultiSelectOptions(options)}
                <MultiSelectEmpty>{"No results found"}</MultiSelectEmpty>
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { FormMultiSelectField };
