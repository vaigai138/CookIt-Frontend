import React from "react";
import LegalDoc from "./LegalDoc";

const CONTACT_EMAIL = "hello@cookit.in"; // TODO: replace with real address

const SECTIONS = [
  {
    heading: "Acceptance of these terms",
    body: [
      "By accessing or using the CookIT website, you agree to these Terms of Service. If you do not agree, please do not use the site.",
    ],
  },
  {
    heading: "About our services",
    body: [
      "CookIT provides technology services including website development, custom software, mobile applications, AI and automation, and related digital services. This website is primarily for information and for getting in touch with us.",
      "Any project we take on is governed by a separate written agreement or proposal. Quotes, timelines, and pricing are confirmed in that agreement, not on this website.",
    ],
  },
  {
    heading: "Use of this website",
    body: [
      "You agree to use this website lawfully and not to:",
      "- Attempt to disrupt, damage, or gain unauthorised access to the site or its systems.",
      "- Misuse our forms, chatbot, or AI tools, including submitting false information or spam.",
      "- Copy, scrape, or reuse our content without permission.",
    ],
  },
  {
    heading: "AI tools disclaimer",
    body: [
      "Our chatbot and AI Solution Builder provide general, high-level information and suggestions to help you understand your options. They are automated and may be incomplete or inaccurate. Their output does not constitute professional advice, a binding quote, or a commitment, and should not be relied on as such. For anything specific, please contact our team.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The content, design, branding, and code of this website are owned by CookIT unless otherwise stated, and are protected by applicable laws. You may not reproduce or redistribute them without our written permission.",
    ],
  },
  {
    heading: "Third-party links",
    body: [
      "Our website may link to third-party websites (such as client projects). We are not responsible for the content or practices of those websites.",
    ],
  },
  {
    heading: "Disclaimer of warranties",
    body: [
      'This website is provided on an "as is" and "as available" basis. We do not warrant that it will be uninterrupted, error-free, or free of harmful components, and we make no warranties about the accuracy or completeness of its content.',
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, CookIT shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, this website.",
    ],
  },
  {
    heading: "Indemnification",
    body: [
      "You agree to indemnify and hold CookIT harmless from any claims or damages arising from your misuse of this website or violation of these terms.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of India, and any disputes will be subject to the jurisdiction of the courts of Chennai, Tamil Nadu.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. Continued use of the website after changes are posted means you accept the updated terms.",
    ],
  },
  {
    heading: "Contact us",
    body: [
      `If you have any questions about these terms, contact us at ${CONTACT_EMAIL}.`,
    ],
  },
];

const Terms = () => (
  <LegalDoc
    eyebrow="Legal"
    title="Terms of Service"
    updated="June 2026"
    metaTitle="Terms of Service — CookIT"
    metaDescription="The terms that govern your use of the CookIT website and tools."
    intro="These terms explain the rules for using the CookIT website. Please read them carefully."
    sections={SECTIONS}
  />
);

export default Terms;
