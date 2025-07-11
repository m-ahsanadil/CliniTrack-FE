"use client";

import { useFormik, FormikHelpers, getIn } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppointment } from "@/src/redux/providers/contexts/AppointmentContext";
import { appointmentRescheduleMinimalSchema } from "@/src/validation/schemas";
import { Modal } from "@/src/components/Modal";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarHeader } from "@/src/components/ui/CalendarHeader";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatDateToString } from "@/src/utils/FormatDateToString";
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { formatDateForInput } from "@/src/utils/FormatDateForInput";

interface Props {
    open: boolean;
    onClose: () => void;
}

interface RescheduleAppointmentFormValues {
    newAppointmentDate: string;
    newStartTime: string;
    newEndTime: string;
}

const initialAppointmentValues: RescheduleAppointmentFormValues = {
    newAppointmentDate: "",
    newEndTime: "",
    newStartTime: "",
}

export const RescheduleAppointmentModal = ({ open, onClose }: Props) => {
    const { toast } = useToast()
    const { handleRescheduleAppointment, isEditing, appointment, setAppointment, setIsRescheduleFormOpen } = useAppointment();
    const { rescheduleLoading, rescheduleError } = useAppSelector((state) => state.appointment);

    const mode = isEditing

    const getInitialValues = useMemo((): RescheduleAppointmentFormValues => {
        if (mode && appointment) {
            const initialValues = {
                newAppointmentDate: formatDateForInput(appointment.appointmentDate) || "",
                newStartTime: appointment.startTime || "",
                newEndTime: appointment.endTime || "",
            };
            return initialValues;
        }
        return initialAppointmentValues;
    }, [mode, appointment]);

    const handleRescheduledAppointmentForm = useCallback(async (values: RescheduleAppointmentFormValues, actions: FormikHelpers<RescheduleAppointmentFormValues>) => {
        try {
            if (!appointment) return;

            await handleRescheduleAppointment(appointment._id, values, () => {
                actions.resetForm();
                actions.setSubmitting(false);
                setIsRescheduleFormOpen(false);
                setAppointment(null);
                toast({
                    title: "Appointment Rescheduled",
                    description: "Appointment was successfully rescheduled.",
                });
            });
        } catch (error) {
            actions.setSubmitting(false);
            toast({
                title: "Error",
                description: "An error occurred while rescheduling.",
                variant: "destructive",
            });
        }
    },
        [appointment, handleRescheduleAppointment, toast, setIsRescheduleFormOpen, setAppointment]
    );

    const formik = useFormik({
        initialValues: getInitialValues,
        onSubmit: handleRescheduledAppointmentForm,
        enableReinitialize: true,
        validationSchema: appointmentRescheduleMinimalSchema,
    });

    const [appointmentDate, setAppointmentDate] = useState(
        formik.values.newAppointmentDate ? new Date(formik.values.newAppointmentDate) : new Date()
    );

    const timeSlots = useMemo(() => [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
        "05:00 PM", "05:30 PM",
    ], []);


    // Function to get field error
    const getFieldError = (fieldName: string) => {
        const touched = getIn(formik.touched, fieldName);
        const error = getIn(formik.errors, fieldName);
        return touched && error ? error : null;
    };

    return (
        <Modal open={open} onClose={onClose} title="Reschedule Appointment">
            <form onSubmit={formik.handleSubmit} className="space-y-4 max-h-[75vh]">
                {rescheduleError && (
                    <p className="text-red-500 text-sm text-center mt-2">{rescheduleError}</p>
                )}

                {/* New Appointment Date */}
                <div className="space-y-2">
                    <Label htmlFor="newAppointmentDate" className="text-slate-700">New Appointment Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-full bg-slate-700 border-slate-600 text-left font-normal"
                            >
                                {formik.values.newAppointmentDate ? (
                                    format(parseISO(formik.values.newAppointmentDate + 'T00:00:00'), 'PPP')
                                ) : (
                                    <span>Select date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <CalendarHeader
                                date={appointmentDate}
                                onNavigate={setAppointmentDate}
                            />
                            <Calendar
                                mode="single"
                                selected={formik.values.newAppointmentDate ? new Date(formik.values.newAppointmentDate + 'T00:00:00') : undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        // Use local date without timezone conversion
                                        const formatted = formatDateToString(date);
                                        formik.setFieldValue("newAppointmentDate", formatted);
                                    }
                                }}
                                month={appointmentDate}
                                onMonthChange={setAppointmentDate}
                                className="border-none"
                            />
                        </PopoverContent>
                    </Popover>
                    {getFieldError('newAppointmentDate') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('newAppointmentDate')}</p>
                    )}
                </div>

                {/* Start Time Field */}
                <div className="space-y-2">
                    <Label htmlFor="newStartTime" className="text-slate-700">New Start Time</Label>
                    <Select
                        value={formik.values.newStartTime}
                        onValueChange={(value) => formik.setFieldValue('newStartTime', value)}
                    >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="text-white">
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {getFieldError('newStartTime') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('newStartTime')}</p>
                    )}
                </div>

                {/* End Time Field */}
                <div className="space-y-2">
                    <Label htmlFor="newEndTime" className="text-slate-700">New End Time</Label>
                    <Select
                        value={formik.values.newEndTime}
                        onValueChange={(value) => formik.setFieldValue('newEndTime', value)}
                    >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                            {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="text-white">
                                    {time}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {getFieldError('newEndTime') && (
                        <p className="text-red-400 text-sm mt-1">{getFieldError('newEndTime')}</p>
                    )}
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="ghost" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white flex items-center gap-2"
                        disabled={rescheduleLoading}
                    >
                        {rescheduleLoading && (
                            <Loader2 className="animate-spin h-4 w-4 text-white" />
                        )}
                        {rescheduleLoading ? "Rescheduling..." : "Reschedule"}
                    </Button>

                </div>
            </form>
        </Modal>
    );
};
