import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CalendarHeaderProps {
    date: Date;
    onNavigate: (date: Date) => void;
}

// Custom Calendar Header with Year Selection
export const CalendarHeader = ({ date, onNavigate }: CalendarHeaderProps) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // Generate year range (you can adjust this range as needed)
    const currentYearNum = new Date().getFullYear();
    const yearRange = Array.from({ length: 20 }, (_, i) => currentYearNum - 10 + i);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleYearChange = (year: string) => {
        // Set to the 1st day of the month to avoid date overflow issues
        const newDate = new Date(parseInt(year), currentMonth, 1);
        onNavigate(newDate);
    };

    const handleMonthChange = (month: string) => {
        // Set to the 1st day of the month to avoid date overflow issues
        const newDate = new Date(currentYear, parseInt(month), 1);
        onNavigate(newDate);
    };

    const goToPreviousMonth = () => {
        // Navigate to the 1st day of the previous month
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        onNavigate(newDate);
    };

    const goToNextMonth = () => {
        // Navigate to the 1st day of the next month
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        onNavigate(newDate);
    };
    return (
        <div className="flex items-center justify-between p-2 border-b">
            <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
                <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-28">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                                {month}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={currentYear.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {yearRange.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
                className="h-8 w-8 p-0"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};