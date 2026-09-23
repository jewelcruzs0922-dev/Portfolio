export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = {
  name: 100,
  email: 254,
  message: 5000,
} as const;

export const EMPTY_CONTACT_FORM: ContactForm = {
  name: "",
  email: "",
  message: "",
};

export function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};

  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length > LIMITS.name)
    errors.name = `Name must be ${LIMITS.name} characters or fewer`;

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Invalid email";
  else if (form.email.trim().length > LIMITS.email)
    errors.email = `Email must be ${LIMITS.email} characters or fewer`;

  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer`;

  return errors;
}
