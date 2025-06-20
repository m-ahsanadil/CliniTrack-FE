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