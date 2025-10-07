import React from "react";
import { Box } from "@mui/material";
import AtomTitleComponent from "../../atoms/AtomTitleComponent";

const Encabezado = (props) => {
  const { title, nameButton, redirect, menuSellout, nameInfo } = props;

  return (
    <Box>
      <AtomTitleComponent
        title={title || ""}
        nameButton={nameButton || ""}
        menuSellout={menuSellout || false}
        nameInfo={nameInfo || ""}
        redirect={redirect}
      />
    </Box>
  );
};

export default Encabezado;
