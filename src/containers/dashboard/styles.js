const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#F2F4F8",
    height: "100vh",
    overflow: "hidden",
    width: "100vw",
  },
  encabezado: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexShrink: 0,
    height: "70px",
    m: 2,
  },
  contentBox: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    borderRadius: 4,
    backgroundColor: "transparent",
    height: "100vh",
    overflow: "auto",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexShrink: 0,
  },
  footer: {
    display: "flex",
    height: "40px",
    background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)", // Shiny soft grey
    borderTop: "1px solid #e2e8f0",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    color: "#64748B",
  },
};
export default styles;
