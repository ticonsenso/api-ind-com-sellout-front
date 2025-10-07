import React from "react";
import { Typography } from "@mui/material";

const AtomTitleForm = ({ title }) => {
    return (
        <Typography
            sx={{
                mb: 2,
                width: "100%",
                fontWeight: 600,
                color: "#808080",
                borderBottom: "1px solid #FC6B1C",
                paddingBottom: 0.2,
                backgroundColor: "#FAFAFA",
                pl: 1,
                pt: 1,
            }}
        >
            {title}:
        </Typography>
    );
}
export default AtomTitleForm;