import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../../hooks/useIsMobile";
import PolaroidFrame from "../../ui/PolaroidFrame";

const STATS = [
  { value: "500+", label: "Different Games" },
  {
    value: String(new Date().getFullYear() - 2017),
    label: "Years of Experience",
  },
  { value: "1000+", label: "Happy Players" },
];

export default function SlideAbout() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);

  return (
    <div style={{ position: "relative", height: "100vh", minHeight: "600px" }}>
      <img
        src="/images/davinci-cafe-ic-mekan.webp"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(17,24,39,0.93) 0%, rgba(17,24,39,0.65) 50%, rgba(17,24,39,0.85) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(0deg, rgba(17,24,39,1) 0%, transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          overflowY: isTablet ? "auto" : "hidden",
          padding: isMobile
            ? "clamp(96px, 18vw, 140px) 24px 40px"
            : isTablet
              ? "clamp(64px, 10vw, 100px) 24px"
              : "80px 24px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: isTablet ? "flex-start" : "center",
        }}
      >
        <div className="container-xl" style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                  ? "minmax(280px, 0.9fr) minmax(0, 1.1fr)"
                  : "minmax(300px, 390px) minmax(0, 1fr)",
              gap: isMobile
                ? "24px"
                : isTablet
                  ? "32px"
                  : "clamp(40px, 6vw, 80px)",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: isMobile ? 0 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div style={{ position: "relative" }}>
                {!isMobile && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: "-20px",
                        left: "-20px",
                        width: "100px",
                        height: "100px",
                        background:
                          "radial-gradient(circle, rgba(168,0,0,0.08) 0%, transparent 70%)",
                        borderRadius: "50%",
                        zIndex: 0,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-30px",
                        right: "-30px",
                        width: "140px",
                        height: "140px",
                        background:
                          "radial-gradient(circle, rgba(255,209,102,0.12) 0%, transparent 70%)",
                        borderRadius: "50%",
                        zIndex: 0,
                      }}
                    />
                  </>
                )}

                <PolaroidFrame
                  rotate={isMobile ? 0 : -2}
                  style={{
                    zIndex: 1,
                    width: "100%",
                    maxWidth: isMobile
                      ? "100%"
                      : isTablet
                        ? "320px"
                        : "390px",
                    margin: "0 auto",
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: isMobile ? "16 / 9" : "3 / 4",
                      background: "#111827",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src="/images/kutu-oyunu-kutuphanesi.webp"
                      alt=""
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        filter: "blur(18px)",
                        opacity: 0.42,
                        transform: "scale(1.08)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(17,24,39,0.2), rgba(17,24,39,0.02))",
                      }}
                    />
                    <img
                      src="/images/kutu-oyunu-kutuphanesi.webp"
                      alt="Da Vinci Board Game Cafe"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                  </div>
                </PolaroidFrame>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "#fff",
                  marginBottom: "20px",
                }}
              >
                {t("Welcome to")} {t("Da Vinci's World")}
              </h2>
              <p
                style={{
                  fontSize: isMobile ? "1.08rem" : "1.28rem",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: isMobile ? 1.55 : isTablet ? 1.7 : 1.85,
                  marginBottom: isMobile ? "20px" : isTablet ? "28px" : "40px",
                  maxWidth: "480px",
                }}
              >
                {t(
                  "Since 2017, we have been keeping board game culture alive in Ankara, presenting hundreds of games with our experienced team. We have become a home for game lovers of all ages and experience levels.",
                )}
              </p>
              <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
                {STATS.map(({ value, label }, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderLeft: "2px solid rgba(255,255,255,0.25)",
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        fontWeight: 900,
                        fontFamily: "var(--font-display)",
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {t(value)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 500,
                        marginTop: "4px",
                      }}
                    >
                      {t(label)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
