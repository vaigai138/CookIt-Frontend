import React from "react";
import LegalDoc from "./LegalDoc";

const CONTACT_EMAIL = "hello@cookit.in"; // TODO: replace with real address

const SECTIONS = [
  {
    heading: "Who we are",
    body: [
      "CookIT is a technology solutions company based in Chennai, India. We build websites, custom software, mobile applications, and AI-powered automation for businesses. This policy explains what information we collect through our website and how we use it.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "We only collect information you choose to give us, primarily through the forms and tools on this site:",
      "- Contact details you submit through our contact form (name, email, phone number, and your message).",
      "- Information shared with our AI assistant (chatbot) or AI Solution Builder, including the business details you enter and any contact details you provide to request a proposal.",
      "- Basic technical information your browser sends automatically (such as device and browser type) and standard server logs.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "We use the information you provide to:",
      "- Respond to your enquiries and prepare proposals or quotes.",
      "- Understand your requirements so we can recommend and deliver the right solution.",
      "- Improve our website and services.",
      "We do not sell your personal information, and we do not use it for advertising.",
    ],
  },
  {
    heading: "AI tools",
    body: [
      "Our chatbot and AI Solution Builder send the text you enter to a third-party AI provider (via OpenRouter) to generate responses and high-level suggestions. Please avoid sharing sensitive personal information in these tools. When you choose to submit your contact details through them, that information is emailed to our team so we can follow up.",
    ],
  },
  {
    heading: "Service providers we rely on",
    body: [
      "We use trusted third-party services to operate this website. They process limited data on our behalf:",
      "- Hosting and serverless functions (our website host) to run the site.",
      "- Email delivery (SMTP) to send us the messages you submit.",
      "- An AI provider (OpenRouter) to power the chatbot and Solution Builder.",
      "- A code/content repository (GitHub) to store website and blog content.",
      "Each provider has its own privacy practices, and we only share what is needed for them to perform their function.",
    ],
  },
  {
    heading: "Data retention",
    body: [
      "We keep enquiry and lead information for as long as needed to respond to you and maintain our business records, after which it is deleted or anonymised. You can ask us to delete your information at any time.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "Our website uses minimal cookies necessary for it to function. If we add analytics in the future, we will update this policy accordingly.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you. To make a request, email us using the details below.",
    ],
  },
  {
    heading: "Security",
    body: [
      "We take reasonable measures to protect your information. However, no method of transmission over the internet is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      "Our website and services are intended for businesses and are not directed at children. We do not knowingly collect information from children.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy from time to time. Any changes will be posted on this page with an updated date.",
    ],
  },
  {
    heading: "Contact us",
    body: [
      `If you have any questions about this Privacy Policy or your information, contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];

const Privacy = () => (
  <LegalDoc
    eyebrow="Legal"
    title="Privacy Policy"
    updated="June 2026"
    metaTitle="Privacy Policy — CookIT"
    metaDescription="How CookIT collects, uses, and protects the information you share through our website, chatbot, and AI tools."
    intro="Your privacy matters to us. This policy explains, in plain language, what information we collect when you use the CookIT website and how we handle it."
    sections={SECTIONS}
  />
);

export default Privacy;
