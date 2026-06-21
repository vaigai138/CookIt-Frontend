import React from "react";
import { Info } from "lucide-react";
import PageMeta from "../Components/PageMeta";
import PageHero from "../Components/common/PageHero";

// Shared renderer for the Privacy / Terms pages. `sections` is an array of
// { heading, body: string[] } — each body string becomes a paragraph; a string
// starting with "- " is rendered as a bullet list item.
const LegalDoc = ({ title, eyebrow, updated, intro, sections, metaTitle, metaDescription }) => {
  return (
    <>
      <PageMeta title={metaTitle} description={metaDescription} />
      <PageHero eyebrow={eyebrow} title={title} subtitle={`Last updated: ${updated}`} />

      <section className="pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Template notice */}
          <div className="flex gap-3 p-4 mb-10 text-sm text-blue-800 bg-blue-50 border border-blue-100 rounded-2xl">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <p>
              This is a general template provided for transparency. Please review it with a qualified
              legal professional before relying on it for your business.
            </p>
          </div>

          {intro && <p className="text-lg leading-relaxed text-gray-600 text-pretty">{intro}</p>}

          <div className="mt-8 space-y-10">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-900 font-pj">
                  {i + 1}. {s.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {(() => {
                    const out = [];
                    let bullets = [];
                    s.body.forEach((line, j) => {
                      if (line.startsWith("- ")) {
                        bullets.push(line.slice(2));
                      } else {
                        if (bullets.length) {
                          out.push(
                            <ul key={`u-${j}`} className="list-disc pl-5 space-y-1.5 text-gray-600">
                              {bullets.map((b, k) => <li key={k}>{b}</li>)}
                            </ul>
                          );
                          bullets = [];
                        }
                        out.push(<p key={j} className="text-gray-600 leading-relaxed text-pretty">{line}</p>);
                      }
                    });
                    if (bullets.length) {
                      out.push(
                        <ul key="u-last" className="list-disc pl-5 space-y-1.5 text-gray-600">
                          {bullets.map((b, k) => <li key={k}>{b}</li>)}
                        </ul>
                      );
                    }
                    return out;
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalDoc;
