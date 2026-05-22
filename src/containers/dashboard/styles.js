const styles = {
  mainContainer: {
    display: "flex",
    flexDirection: "row", // Changed to row for Sidebar
    background: "#F2F4F8",
    height: "100vh",
    overflow: "hidden",
    width: "100vw",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    height: "100vh",
    overflow: "hidden",
  },
  sidebarIcons: {
    width: "70px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "24px 0",
    gap: "20px",
    flexShrink: 0,
    zIndex: 1201,
  },
  encabezado: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexShrink: 0,
    height: "70px",
    ml: 1,
    mt: 2,
    mb: 2

  },
  contentBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: 4,
    backgroundColor: "transparent",
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
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    color: "#64748B",
  },
};
export default styles;
