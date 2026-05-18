import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import HeroSlider from "../components/sections/HeroSlider";
import InstagramPostsSection from "../components/sections/InstagramPostsSection";
import ContactSection from "../components/sections/ContactSection";

export default function HomePage() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>
          Da Vinci Board Game Cafe |{" "}
          {t("Turkey's Largest Board Game Cafe")}
        </title>
        <meta name="description" content={t("With hundreds of board games and our experienced team, we welcome you to a fun-filled experience..")} />
        <meta property="og:title" content="Da Vinci Board Game Cafe" />
        <meta property="og:description" content={t("With hundreds of board games and our experienced team, we welcome you to a fun-filled experience..")} />
        <meta
          property="og:locale"
          content={i18n.language === "tr" ? "tr_TR" : "en_US"}
        />
        <link rel="canonical" href="https://davinciboardgame.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CafeOrCoffeeShop",
            name: "Da Vinci Board Game Cafe",
            image: "https://davinciboardgame.com/images/davinci-logo.png",
            telephone: "+903122867860",
            email: "info@davinciboardgame.com",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "Neorama İş Merkezi, Beştepe Mah., Yaşam Cd., Adalet Sok. No:4/B",
              addressLocality: "Yenimahalle",
              addressRegion: "Ankara",
              postalCode: "06510",
              addressCountry: "TR",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "12:00",
                closes: "00:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Saturday", "Sunday"],
                opens: "10:00",
                closes: "00:00",
              },
            ],
            url: "https://davinciboardgame.com",
          })}
        </script>
      </Helmet>

      <HeroSlider />
      <InstagramPostsSection />
      <ContactSection />
    </>
  );
}
