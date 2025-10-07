import React, { useMemo } from "react";
import AtomSelectInputForm from "./AtomSelect";

const SelectorAnioForm = ({
  id = "selector-anio",
  anioInicio = 2025,
  anioSeleccionado,
  onChange,
  headerTitle = "Año",
  required = false,
  error = false,
  color = "#f5f5f5",
  helperText = "",
  disabled = false,
  width = "100%",
}) => {
  const fechaActual = new Date();
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth(); // 0 = enero

  // Calculamos hasta qué año se debe permitir seleccionar
  const anioMaximo = mesActual === 0 ? anioActual : anioActual;

  const opcionesAnios = useMemo(() => {
    const lista = [];
    for (let anio = anioInicio; anio <= anioMaximo; anio++) {
      lista.push({ id: anio, label: String(anio) });
    }
    return lista;
  }, [anioInicio, anioMaximo]);

  return (
    <AtomSelectInputForm
      id={id}
      color={color}
      headerTitle={headerTitle}
      value={anioSeleccionado}
      onChange={onChange}
      options={opcionesAnios}
      required={required}
      error={error}
      helperText={helperText}
      width={width}
      disabled={disabled}
      multiple={false}
    />
  );
};

export default SelectorAnioForm;