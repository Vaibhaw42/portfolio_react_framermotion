import { useRef, useState } from "react";
import "./contact.scss";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import { socials } from "../../data/socials";

const RATE_LIMIT_MS = 60_000;
const STORAGE_KEY = "contact:lastSent";

const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const isInView = useInView(ref, { margin: "-100px" });

  const sendEmail = async (e) => {
    e.preventDefault();

    const honey = formRef.current.elements.website.value;
    if (honey) {
      setStatus("idle");
      return;
    }

    const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
    if (Date.now() - last < RATE_LIMIT_MS) {
      setStatus("ratelimited");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      formRef.current.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact" ref={ref} aria-labelledby="contact-title">
      <div className="contact__inner">
        <motion.div
          className="contact__intro"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="contact__label">Contact</span>
          <h2 id="contact-title">Let's work together.</h2>
          <ul className="contact__socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noreferrer noopener" data-cursor="hover">{s.label} ↗</a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          className="contact__form"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <label htmlFor="name">Name</label>
          <input id="name" type="text" required placeholder="Your name" name="name" autoComplete="name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" required placeholder="you@example.com" name="email" autoComplete="email" />

          <label htmlFor="message">Message</label>
          <textarea id="message" rows={6} required placeholder="Tell me about your project" name="message" />

          <input
            type="text"
            name="website"
            tabIndex="-1"
            autoComplete="off"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
            aria-hidden="true"
          />

          <button type="submit" disabled={status === "sending"} className="btn btn--primary" data-cursor="hover">
            {status === "sending" ? "Sending..." : "Submit"}
          </button>

          <p className={`contact__status contact__status--${status}`} role="status" aria-live="polite">
            {status === "ratelimited" && "Please wait a moment before sending again."}
            {status === "error" && "Could not send. Please email me directly."}
            {status === "success" && "Message sent. I'll be in touch."}
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
