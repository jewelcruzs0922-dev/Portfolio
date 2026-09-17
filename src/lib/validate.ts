export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMPTY_CONTACT_FORM: ContactForm = {
  name: "",
  email: "",
  message: "",
};

export function validateContact(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};

  if (!form.name.trim()) errors.name = "Name is required";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Invalid email";

  if (!form.message.trim()) errors.message = "Message is required";

  return errors;
}
