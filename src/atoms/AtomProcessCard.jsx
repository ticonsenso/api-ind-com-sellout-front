import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Collapse,
  Button,
  alpha
} from "@mui/material";
import {
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Store as StoreIcon,
  Inventory as InventoryIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  ErrorOutline as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from "@mui/icons-material";

// Helper function to format date nicely
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const AtomProcessCard = ({ job }) => {
  const [copied, setCopied] = useState(false);
  const [showError, setShowError] = useState(false);

  const {
    jobId,
    entityName,
    status,
    totalRecords = 0,
    processedRecords = 0,
    errorMessage,
    startTime,
    endTime,
    duration,
  } = job;

  // Determine colors based on status
  const getStatusConfig = (statusStr) => {
    const s = String(statusStr).toUpperCase();
    if (s === "COMPLETADO" || s === "SUCCESS" || s === "FINALIZADO") {
      return {
        color: "#2e7d32",
        bgColor: "#e8f5e9",
        borderColor: "#c8e6c9",
        label: "Completado",
        progressColor: "success",
      };
    }
    if (s === "ERROR" || s === "FALLIDO" || s === "FAILED") {
      return {
        color: "#d32f2f",
        bgColor: "#ffebee",
        borderColor: "#ffcdd2",
        label: "Error",
        progressColor: "error",
      };
    }
    if (s === "PROCESANDO" || s === "RUNNING" || s === "EJECUTANDO") {
      return {
        color: "#0288d1",
        bgColor: "#e1f5fe",
        borderColor: "#b3e5fc",
        label: "En Proceso",
        progressColor: "primary",
      };
    }
    // Default / Pending
    return {
      color: "#757575",
      bgColor: "#f5f5f5",
      borderColor: "#e0e0e0",
      label: statusStr || "Pendiente",
      progressColor: "inherit",
    };
  };

  const statusConfig = getStatusConfig(status);

  // Copy Job ID to clipboard
  const handleCopyJobId = () => {
    if (jobId) {
      navigator.clipboard.writeText(jobId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Calculate progress percentage safely
  const progressPercent = totalRecords > 0
    ? Math.min(100, Math.round((processedRecords / totalRecords) * 100))
    : (statusConfig.label === "Completado" ? 100 : 0);

  // Icon depending on entity name
  const isAlmacenes = entityName === "ALMACENES" || entityName === "dim_almacenes_s08";
  const entityLabel = isAlmacenes ? "ALMACENES" : "PRODUCTOS";
  const entityIcon = isAlmacenes ? (
    <StoreIcon sx={{ fontSize: 20 }} />
  ) : (
    <InventoryIcon sx={{ fontSize: 20 }} />
  );
  const entityColor = isAlmacenes ? "#F39400" : "#0072CE";

  return (
    <Card
      sx={{
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
        transition: "all 0.2s ease-in-out",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",

        },
      }}
    >
      <CardContent sx={{ p: "18px", "&:last-child": { pb: "18px" }, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>

        {/* Header: Entity and Status */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                backgroundColor: alpha(entityColor, 0.1),
                color: entityColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {entityIcon}
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#1e293b", letterSpacing: "0.2px" }}>
              {entityLabel}
            </Typography>
          </Box>
          <Chip
            label={statusConfig.label}
            size="small"
            sx={{
              backgroundColor: statusConfig.bgColor,
              color: statusConfig.color,
              borderColor: statusConfig.borderColor,
              borderWidth: "1px",
              borderStyle: "solid",
              fontWeight: 600,
              fontSize: "0.725rem",
              height: "22px",
              px: 0.25
            }}
          />
        </Box>

        {/* Job ID section */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          backgroundColor: "#e4f1ffff",
          p: "4px 8px",
          borderRadius: "6px",
          border: "1px solid #f1f5f9"
        }}>
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              fontFamily: "monospace",
              flexGrow: 1,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap"
            }}>
            ID: {jobId}
          </Typography>
          <Tooltip title={copied ? "Copiado!" : "Copiar ID"}>
            <IconButton size="small" onClick={handleCopyJobId} sx={{ p: 0.25, color: copied ? "#2e7d32" : "#94a3b8" }}>
              {copied ? <CheckIcon sx={{ fontSize: 14 }} /> : <ContentCopyIcon sx={{ fontSize: 14 }} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Time and Duration Info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, my: 0.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography variant="caption" sx={{ color: "#475569", fontSize: "0.775rem" }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>Inicio:</span> {formatDate(startTime)}
            </Typography>
          </Box>

          {endTime && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
              <Typography variant="caption" sx={{ color: "#475569", fontSize: "0.775rem" }}>
                <span style={{ color: "#64748b", fontWeight: 500 }}>Fin:</span> {formatDate(endTime)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
            <Typography variant="caption" sx={{ color: "#475569", fontSize: "0.775rem" }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>Duración:</span> {duration || "En proceso..."}
            </Typography>
          </Box>
        </Box>

        {/* Progress Records section */}
        <Box sx={{ mt: "auto", pt: 0.75 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
              Registros procesados: {processedRecords.toLocaleString()} / {totalRecords.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: statusConfig.color, fontWeight: 700 }}>
              {progressPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color={statusConfig.progressColor}
            sx={{
              height: 8,
              borderRadius: 2,
              backgroundColor: "#f1f5f9",
              "& .MuiLinearProgress-bar": {
                borderRadius: 2,
              }
            }}
          />
        </Box>

        {/* Error Section (if applicable) */}
        {errorMessage && (
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="text"
              startIcon={<ErrorIcon sx={{ color: "#d32f2f" }} />}
              endIcon={showError ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowError(!showError)}
              sx={{
                color: "#d32f2f",
                textTransform: "none",
                fontWeight: 600,
                p: 0,
                fontSize: "0.75rem",
                "&:hover": { backgroundColor: "transparent", color: "#b71c1c" }
              }}
            >
              Ver mensaje de error
            </Button>
            <Collapse in={showError} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  backgroundColor: "#fff5f5",
                  border: "1px solid #fed7d7",
                  borderRadius: "8px",
                  maxHeight: "120px",
                  overflowY: "auto",
                }}
              >
                <Typography
                  variant="caption"
                  component="pre"
                  sx={{
                    color: "#c53030",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    margin: 0,
                    fontSize: "0.75rem",
                    lineHeight: 1.4,
                  }}
                >
                  {errorMessage}
                </Typography>
              </Box>
            </Collapse>
          </Box>
        )}

      </CardContent>
    </Card>
  );
};

export default AtomProcessCard;
