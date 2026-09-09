import { useState, type FormEvent } from "react";
import "./contact.css";

export function ContactPage() {
  const [openingEmail, setOpeningEmail] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  async function copyEmail(email: string) {
    setCopyStatus("");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      setCopyStatus(`Copied ${email}`);
    } catch {
      setCopyStatus(
        "Could not copy. Select the email address and copy it manually.",
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const firstName = String(data.get("First-Name") ?? "").trim();
    const lastName = String(data.get("Last-Name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("field") ?? "");
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const subject = fullName
      ? `EO2 EXP enquiry from ${fullName}`
      : "EO2 EXP website enquiry";
    const body = [
      `First name: ${firstName}`,
      `Last name: ${lastName}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\r\n");

    setOpeningEmail(true);
    window.location.href = `mailto:rishabh@eo2exp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <header className="contact-page__intro">
        <p className="contact-page__eyebrow">Get in touch</p>
        <h1 id="contact-title">
          <span>No need to</span>
          <span>keep it brief,</span>
          <span className="contact-page__accent">Tell us</span>
          <span className="contact-page__accent">everything.</span>
        </h1>
      </header>

      <div className="contact-page__body">
        <aside className="contact-page__direct" aria-label="Email contacts">
          <div>
            <h2>Start a project</h2>
            <a href="mailto:rishabh@eo2exp.com">
              rishabh@eo2exp.com <span aria-hidden="true">↗</span>
            </a>
            <button
              className="contact-page__copy"
              type="button"
              aria-label="Copy rishabh@eo2exp.com"
              onClick={() => void copyEmail("rishabh@eo2exp.com")}
            >
              Copy email
            </button>
          </div>
          <div>
            <h2>Partner with us</h2>
            <a href="mailto:risheeta@eo2exp.com">
              risheeta@eo2exp.com <span aria-hidden="true">↗</span>
            </a>
            <button
              className="contact-page__copy"
              type="button"
              aria-label="Copy risheeta@eo2exp.com"
              onClick={() => void copyEmail("risheeta@eo2exp.com")}
            >
              Copy email
            </button>
          </div>
          <p className="contact-page__copy-status" role="status">
            {copyStatus}
          </p>
        </aside>

        <form
          className="contact-page__form"
          name="email-form"
          aria-label="Email Form"
          onSubmit={handleSubmit}
          onChange={() => setOpeningEmail(false)}
        >
          <div className="contact-page__names">
            <div className="contact-page__field">
              <label htmlFor="First-Name">First Name</label>
              <input
                id="First-Name"
                name="First-Name"
                type="text"
                autoComplete="given-name"
                maxLength={256}
                required
              />
            </div>
            <div className="contact-page__field">
              <label htmlFor="Last-Name">Last Name</label>
              <input
                id="Last-Name"
                name="Last-Name"
                type="text"
                autoComplete="family-name"
                maxLength={256}
                required
              />
            </div>
          </div>
          <div className="contact-page__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={256}
              required
            />
          </div>
          <div className="contact-page__field">
            <label htmlFor="field">Message</label>
            <textarea
              id="field"
              name="field"
              rows={4}
              maxLength={5000}
              required
            />
          </div>
          <button className="contact-page__submit" type="submit">
            <span>Send your message</span>
            <span className="contact-page__submit-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
          <p className="contact-page__status" role="status">
            {openingEmail
              ? "Opening your email app. Send the draft there to complete your message."
              : ""}
          </p>
        </form>
      </div>
    </section>
  );
}
