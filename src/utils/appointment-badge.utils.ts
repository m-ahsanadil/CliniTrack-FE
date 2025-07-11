import { AppointmentType, AppointmentStatus } from "@/src/enum"

/**
 * Get badge variant for appointment type
 * @param type - AppointmentType enum value
 * @returns Badge variant string
 */
export const getAppointmentTypeBadgeVariant = (type: AppointmentType) => {
  switch (type) {
    case AppointmentType.CONSULTATION:
      return "default"
    case AppointmentType.FOLLOW_UP:
      return "secondary"
    case AppointmentType.EMERGENCY:
      return "destructive"
    case AppointmentType.PROCEDURE:
      return "outline"
    default:
      return "default"
  }
}

/**
 * Get badge variant for appointment status
 * @param status - AppointmentStatus enum value
 * @returns Badge variant string
 */
export const getAppointmentStatusBadgeVariant = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
      return "default"
    case AppointmentStatus.COMPLETED:
      return "secondary"
    case AppointmentStatus.CANCELLED:
      return "destructive"
    case AppointmentStatus.RESCHEDULED:
      return "outline"
    case AppointmentStatus.NO_SHOW:
      return "destructive"
    default:
      return "default"
  }
}

/**
 * Get custom CSS classes for appointment type badge
 * @param type - AppointmentType enum value
 * @returns Tailwind CSS classes string
 */
export const getAppointmentTypeCustomStyles = (type: AppointmentType) => {
  switch (type) {
    case AppointmentType.CONSULTATION:
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case AppointmentType.FOLLOW_UP:
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case AppointmentType.EMERGENCY:
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case AppointmentType.PROCEDURE:
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

/**
 * Get custom CSS classes for appointment status badge
 * @param status - AppointmentStatus enum value
 * @returns Tailwind CSS classes string
 */
export const getAppointmentStatusCustomStyles = (status: AppointmentStatus) => {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case AppointmentStatus.COMPLETED:
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case AppointmentStatus.CANCELLED:
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case AppointmentStatus.RESCHEDULED:
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case AppointmentStatus.NO_SHOW:
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}