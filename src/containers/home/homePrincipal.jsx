import React from "react";
import { Typography, Box } from "@mui/material";
import AtomContainerGeneral from "../../atoms/AtomContainerGeneral";
import Grid from "@mui/material/Grid";
import Image1 from "../../assets/carrusel/image.svg";
import Image2 from "../../assets/carrusel/image1.svg";
import Image3 from "../../assets/carrusel/image2.svg";
import filosofia from "../../assets/carrusel/filosofia.svg";
import valores from "../../assets/carrusel/valores.svg";
import Image4 from "../../assets/carrusel/image4.svg";
import Image5 from "../../assets/carrusel/image5.svg";
const HomePrincipal = () => {
  const images = [Image3, Image4, Image2, Image1, Image5];

  const styles = {
    container: {
      display: "flex",
      backgroundColor: "white",
      justifyContent: "center",
    },
    images: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    imageBox: {
      width: "100%",
      height: "250px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    image: {
      height: "100%",
      width: "auto",
      objectFit: "contain",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "500",
      textAlign: "center",
      color: "primary.main",
      pt: 3,
    },
    description: {
      fontSize: "1.1rem",
      fontWeight: "400",
      color: "text.secondary",
      marginTop: "1rem",
      textAlign: "justify",
      width: "70%",
      marginBottom: "1rem",
    },
    subtitle: {
      fontSize: "1.3rem",
      fontWeight: "600",
      color: "#444444",
      width: "95%",
      textAlign: "left",
      borderBottom: "1px solid #F39400",
    },
    subtitleContainer: {
      backgroundColor: "#f5f5f5",
      display: "flex",
      borderRadius: "10px",
      flexDirection: "column",
      padding: "1rem",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      marginBottom: "1rem",
    },
    descriptionSubtitle: {
      fontSize: "1.1rem",
      fontWeight: "400",
      color: "text.secondary",
      marginTop: "1rem",
      textAlign: "justify",
      width: "95%",
      marginBottom: "1rem",
    },
  };

  return (
    <AtomContainerGeneral
      children={
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100vw",
              overflow: "hidden",
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: `${100 / images.length}vw`,
                  height: "250px",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <img
                  src={image}
                  alt={`image-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Box>
            ))}
          </Box>

          <Grid container spacing={2} sx={styles.container}>
            <Grid
              size={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 12,
              }}
            >
              <Typography sx={styles.title}>
                LIDERANDO CON VALORES, IMPACTANDO EL FUTURO
              </Typography>
              <Typography sx={styles.description}>
                Grupo Consenso es un grupo empresarial con una sólida presencia
                en Ecuador, Perú y más de 15 países de Centroamérica y el
                Caribe. Su propósito es construir un futuro donde el desarrollo
                humano y la sostenibilidad convivan en equilibrio, generando un
                impacto positivo en cada comunidad donde opera. <br />
                <br />
                Integrado por empresas líderes como Indurama y Marcimex,
                participa en sectores clave como fabricación, retail, insurtech,
                logística y movilidad. Su compromiso social se refleja en
                iniciativas como la gestión del Hospital Humanitario,
                reafirmando su misión de transformar vidas a través de la
                innovación y la responsabilidad. <br />
                <br />
                Crecimiento con visión, acción con determinación y construcción
                con propósito guían su trayectoria.
              </Typography>
            </Grid>
            <Grid size={12} sx={styles.subtitleContainer}>
              <Typography sx={styles.subtitle}>Nuestra Filosofía</Typography>
              <Typography sx={styles.descriptionSubtitle}>
                La filosofía de Grupo Consenso se basa en principios que
                impulsan la excelencia. No solo sueña en grande, sino que actúa
                con determinación. Sus pilares guían cada acción, sustentando
                una cultura de compromiso, eficiencia y crecimiento. Son los
                principios que alinean al equipo y lo desafían a mejorar
                constantemente.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "95%",
                  mb: "2rem",
                }}
              >
                <img
                  src={filosofia}
                  alt="filosofia"
                  style={{ width: "100%" }}
                />
              </Box>
              <Typography sx={styles.subtitle}>Valores Corporativos</Typography>

              <Typography sx={styles.descriptionSubtitle}>
                Los valores en Grupo Consenso son más que principios;
                representan la base sobre la que se construye cada relación,
                decisión y proyecto. Definen, unen y guían hacia un futuro donde
                el crecimiento se alcanza con integridad, colaboración y
                propósito. Son la fuerza que impulsa cada acción y el motivo por
                el cual cada paso genera impacto.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "95%",
                  mb: "1rem",
                }}
              >
                <img src={valores} alt="valores" style={{ width: "100%" }} />
              </Box>
            </Grid>
          </Grid>
        </>
      }
    />
  );
};

export default HomePrincipal;
