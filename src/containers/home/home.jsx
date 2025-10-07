import React from 'react';
import Grid from '@mui/material/Grid';
import CardInformation from '../../atoms/AtomCardInformation';
import { Box } from '@mui/material';
import AtomAlert from '../../atoms/AtomAlert';
import AtomContainerGeneral from '../../atoms/AtomContainerGeneral';
import { useSelector } from 'react-redux';


const Home = () => {

  const rolSelected = useSelector((state) => state.auth.auth.rolSelected);
  const data = [
    {
      title: 'Indurama',
      meses: ['Enero', 'Febrero', 'Marzo'],
      data: [
        {
          ventaFiscal: 50,
          carteraCorriente: 100,
          carteraPesada: 150,
          cumplimientoVentaFiscal: 20,
        },
      ]
    },
    {
      title: 'Marcimex',
      meses: ['Enero', 'Febrero', 'Marzo'],
      data: [
        {
          ventaFiscal: 50,
          carteraCorriente: 100,
          carteraPesada: 150,
          cumplimientoVentaFiscal: 20,
        },
      ]
    },
  ]

  return (
    <AtomContainerGeneral
      children={
        <>
          {rolSelected?.name === 'ADMINISTRADOR' ? (
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                height: '100%',
                overflow: 'auto',
              }}
              spacing={2}
              container
            >
              {data.map((item) => (
                <Grid size={6} key={item.id}>
                  <CardInformation data={item} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <AtomAlert
              text="No cuenta con permisos."
              severity="info"
            />
          )}
        </>
      }
    />
  );
};

export default Home;
