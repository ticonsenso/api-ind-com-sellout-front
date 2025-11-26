import React, { useRef } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { AttachFile as AttachFileIcon } from "@mui/icons-material";
import { procesarExcel } from "./procesarExcel";

const BotonProcesarExcel = () => {
    const inputRef = useRef(null);

    const abrirInput = () => {
        inputRef.current?.click();
    };

    const manejarArchivos = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        await procesarExcel(files);

        event.target.value = "";
    };

    return (
        <>
            <Tooltip title="Procesar Excel Bodeguitas">
                <IconButton
                    sx={{
                        position: "fixed",
                        top: 88,
                        right: 83,
                        height: 32,
                        width: 32,
                        zIndex: 2000,
                        backgroundColor: "#01810bff",
                        color: "white",
                        borderRadius: 15,
                        "&:hover": {
                            backgroundColor: "#01810bff",
                            transform: "scale(1.1)",
                        },
                    }}
                    onClick={abrirInput}
                >
                    <AttachFileIcon />
                </IconButton>
            </Tooltip>

            <input
                type="file"
                ref={inputRef}
                accept=".xlsx,.xls"
                multiple
                style={{ display: "none" }}
                onChange={manejarArchivos}
            />
        </>
    );
};

export default BotonProcesarExcel;
