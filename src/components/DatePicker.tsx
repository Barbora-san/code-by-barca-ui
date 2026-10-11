import { DateTimePicker, type DateTimePickerProps } from "./DateTimePicker";

export type DatePickerProps = Omit<DateTimePickerProps, "withTime">;

/** Výběr samotného data (bez času) – stejné kolečko měsíc / rok jako `DateTimePicker`. */
export function DatePicker(props: DatePickerProps) {
  return <DateTimePicker placeholder="Vyber datum" {...props} withTime={false} />;
}
