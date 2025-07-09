"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type OptionType = { value: string; label: string } | string;

interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: OptionType[];
    className?: string;
}

// Custom Select Component
export const CustomSelect = ({ value, onValueChange, placeholder, options, className = "" }: CustomSelectProps) => {

    const [open, setOpen] = useState(false);
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const normalizedOptions = options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: capitalize(opt) } : opt
    );
    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="h-4 w-4 opacity-5 text-black">
                    <path d="m4.93179 5.43179c0.20053-0.20053 0.52632-0.20053 0.72678 0l2.34143 2.34143 2.34143-2.34143c0.20053-0.20053 0.52632-0.20053 0.72678 0 0.20053 0.20053 0.20053 0.52632 0 0.72678l-2.70711 2.70711c-0.39053 0.39053-1.02369 0.39053-1.41421 0l-2.70711-2.70711c-0.20053-0.20053-0.20053-0.52632 0-0.72678z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-50 w-full mt-1 text-slate-600 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {normalizedOptions.map((option) => (
                        <Button
                            key={option.value}
                            onClick={() => {
                                onValueChange(option.value);
                                setOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm bg-transparent hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

