import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EMPTY_CONTACT_FORM,
  validateContact,
  type ContactForm,
} from "../src/lib/validate.ts";

const valid: ContactForm = {
  name: "Jewel",
  email: "jewel@example.com",
  message: "Hello there",
};

test("accepts a fully valid form", () => {
  assert.deepEqual(validateContact(valid), {});
});

test("flags every empty field", () => {
  assert.deepEqual(validateContact(EMPTY_CONTACT_FORM), {
    name: "Name is required",
    email: "Email is required",
    message: "Message is required",
  });
});

test("treats whitespace-only input as empty", () => {
  const errors = validateContact({ name: "   ", email: "\t", message: "\n" });
  assert.equal(errors.name, "Name is required");
  assert.equal(errors.email, "Email is required");
  assert.equal(errors.message, "Message is required");
});

test("rejects malformed addresses", () => {
  for (const email of [
    "not-an-email",
    "no@tld",
    "@example.com",
    "spaces in@example.com",
    "two@@example.com",
  ]) {
    assert.equal(
      validateContact({ ...valid, email }).email,
      "Invalid email",
      `expected "${email}" to be rejected`,
    );
  }
});

test("accepts common address shapes", () => {
  for (const email of [
    "a@b.co",
    "first.last@sub.example.com",
    "user+tag@example.io",
  ]) {
    assert.equal(
      validateContact({ ...valid, email }).email,
      undefined,
      `expected "${email}" to be accepted`,
    );
  }
});

test("reports only the field that is broken", () => {
  const errors = validateContact({ ...valid, name: "" });
  assert.deepEqual(Object.keys(errors), ["name"]);
});

test("does not mutate the form", () => {
  const form = { ...valid };
  validateContact(form);
  assert.deepEqual(form, valid);
});
