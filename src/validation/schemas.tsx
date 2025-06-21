import * as Yup from "yup";

export const registerSchema = Yup.object({
         name: Yup.string().required("Name is required"),
         email: Yup.string().required("Email is required").email("Invalid email format"),
         password: Yup.string().required("Password is required"),
         password_confirmation: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password"), ""], "Passwords do not match"),
});

export const verifyEmailSchema = Yup.object({
         email: Yup.string().required("Email is required").email("Invalid email format"),
         otp: Yup.string().required("OTP is required").min(4, "OTP must be 4 digits long").max(4, "OTP must be 4 digits long"),
});

export const loginSchema = Yup.object({
         email: Yup.string().required("Email is required").email("Invalid email format"),
         password: Yup.string().required("Password is required"),
});

export const resetPasswordSchema = Yup.object({
         email: Yup.string().required("Email is required").email("Invalid email format"),
});

export const resetPasswordConfirmSchema = Yup.object({
         password: Yup.string().required("Password is required"),
         password_confirmation: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password"), ""], "Passwords do not match"),
});


export const changePasswordSchema = Yup.object({
         password: Yup.string().required("Password is required"),
         password_confirmation: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password"), ""], "Passwords and Confirm Password doesn't match"),
});

// Validation schema
export const doctorProfileSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  specialty: Yup.string().required('Specialty is required'),
  phone: Yup.string().required('Phone is required').matches(/^\+?[\d\s-()]+$/, 'Invalid phone format'),
  email: Yup.string().required('Email is required').email('Invalid email format'),
  address: Yup.object({
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    country: Yup.string().required('Country is required'),
  }),
  licenseNumber: Yup.string().required('License number is required'),
  npiNumber: Yup.string().required('NPI number is required'),
  clinicAffiliation: Yup.string().required('Clinic affiliation is required'),
  status: Yup.string().required('Status is required'),
})