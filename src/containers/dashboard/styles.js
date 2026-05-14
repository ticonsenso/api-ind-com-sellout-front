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
    m: 2,
  },
  contentBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: 4,
    backgroundColor: "transparent",
    overflow: "auto", // Changed to auto for scrollable content
    minHeight: 0,
    mb: 0
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
    background: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
    borderTop: "1px solid #e2e8f0",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
    color: "#64748B",
  },
};
export default styles;
