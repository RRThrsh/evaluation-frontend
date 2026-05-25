import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup.string().trim().required('Full name is required'),
  email: yup.string().trim().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])$/,
      'Password must contain uppercase, lowercase, digit, and special character'
    )
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const loginSchema = yup.object().shape({
  email: yup.string().trim().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});