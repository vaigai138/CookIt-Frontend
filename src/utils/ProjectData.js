// Live client website projects. Previews are generated from the live sites
// (see src/lib/screenshot.js) so they always reflect the current design.
import { liveShot } from "../lib/screenshot";

const projectsData = [
  {
    id: 1,
    title: "Kadamban Group",
    category: "Real Estate",
    link: "https://kadambangroup.com/",
    image: liveShot("https://kadambangroup.com/"),
    description:
      "An elegant real estate website showcasing premium properties with a clean, trustworthy browsing experience.",
    tags: ["Website", "Real Estate"],
  },
  {
    id: 2,
    title: "KV Media Works",
    category: "Media Agency",
    link: "https://kvmediaworks.in/",
    image: liveShot("https://kvmediaworks.in/"),
    description:
      "A sleek portfolio site for a media agency, crafted to highlight their creativity and brand identity.",
    tags: ["Website", "Portfolio"],
  },
  {
    id: 3,
    title: "Thalaiyatti Biriyani",
    category: "Restaurant",
    link: "https://thalaiyattibiriyani.com/",
    image: liveShot("https://thalaiyattibiriyani.com/"),
    description:
      "A flavourful restaurant website that brings the brand to life and makes the menu easy to explore.",
    tags: ["Website", "Restaurant"],
  },
];

export default projectsData;
