"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"


interface DateOfBirthProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    }

export function DateOfBirth({value, onChange}: DateOfBirthProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    if (value !== undefined) {
      setDate(value);
    }
},[value]);

const handleSelect = (newDate: Date) => {
    setDate
    if (onChange) {
      onChange(newDate);
    }
    setOpen(false);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="date">
        Ngày Sinh
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {date ? format(date, "PPP") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            required={true}
            selected={date}
            captionLayout="dropdown"
            fromYear={1920}
            toYear={new Date().getFullYear()}
            onSelect={handleSelect}
            disabled={(date) => date > new Date()} // Disable future dates
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}