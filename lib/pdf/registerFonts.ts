import path from "path";
import { Font } from "@react-pdf/renderer";

/**
 * Cairo (used on the live website) currently ships only as a variable font, which
 * @react-pdf/renderer's font engine can't reliably pin to specific static weights for PDF
 * embedding. Tajawal is used as the PDF heading font instead — visually very close, and has
 * proper static Bold/ExtraBold TTFs. Body text still uses IBM Plex Sans Arabic, matching the
 * website. Validated against Arabic RTL shaping/bidi before this was wired up.
 */
let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  const fontsDir = path.join(process.cwd(), "lib", "pdf", "fonts");

  Font.register({
    family: "Heading",
    fonts: [
      { src: path.join(fontsDir, "Tajawal-Bold.ttf"), fontWeight: 700 },
      { src: path.join(fontsDir, "Tajawal-ExtraBold.ttf"), fontWeight: 800 },
    ],
  });

  Font.register({
    family: "Body",
    fonts: [
      { src: path.join(fontsDir, "IBMPlexSansArabic-Regular.ttf"), fontWeight: 400 },
      { src: path.join(fontsDir, "IBMPlexSansArabic-Medium.ttf"), fontWeight: 500 },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);
}
