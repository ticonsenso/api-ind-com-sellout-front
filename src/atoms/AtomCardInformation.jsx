import { Card, Typography, CardContent, Button, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#40997E', '#54536E', '#E2A925', '#F03838'];

const CardInformation = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) {
    return null;
  }

  const chartData = [
    { name: 'Venta Fiscal', value: data.data[0]?.ventaFiscal || 0 },
    { name: 'Cartera Corriente', value: data.data[0]?.carteraCorriente || 0 },
    { name: 'Cartera Pesada', value: data.data[0]?.carteraPesada || 0 },
    { name: 'Cumplimiento Venta Fiscal', value: data.data[0]?.cumplimientoVentaFiscal || 0 }
  ];

  const totalVentaFiscal = chartData.reduce((sum, entry) => sum + entry.value, 0);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  return (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    }}>
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        border: 'none',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            fontSize: 22,
          }}
        >
          {data.title}
        </Typography>

        <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexDirection: 'row', 
            width: '100%', mt: 2 }}>
          <Grid container spacing={2}>
            {data.meses?.map((item, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    border: 'none',
                    backgroundColor: '#F3F2F8',
                    fontSize: 11,
                    color: '#333',
                  }}
                >
                  {item}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box 
          sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            flexDirection: 'row',
            gap: 2
          }}
        >
          <Box>
            <PieChart width={105} height={105}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={53}
                dataKey="value"
                paddingAngle={0}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                fontFamily="Arial"
                dominantBaseline="middle"
                fontSize="22px"
                fontWeight="500"
                fill="#333"
              >
                {totalVentaFiscal}
              </text>
            </PieChart>
          </Box>
          
          <Box
            sx={{
              border: '1px solid #f5f5f5',
              borderRadius: 2,
              padding: 2,
              width: '100%',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Distribución
            </Typography>
            {chartData.map((entry, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 2 }}>
                <Typography variant="body2">{entry.name}</Typography>
                <Typography variant="body2" fontWeight={600}>{entry.value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
    <Card variant="outlined" sx={{
        borderRadius: 3,
        border: 'none',
    }}>
        <CardContent 
         sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
            <Typography 
                variant="h4"
                sx={{
                    fontWeight: 500,
                    fontSize: 20,
                }}
            >
                Métricas de ingresos
            </Typography>
            <Box 
        sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexDirection: 'row', 
            width: '100%', mt: 2 }}>
          <Grid container spacing={2}>
            {diasSemana?.map((item, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    border: 'none',
                    backgroundColor: '#F3F2F8',
                    fontSize: 11,
                    color: '#333',
                  }}
                >
                  {item}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box 
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 0,
            width: '90%',
            mt: 2,
        }}
        >
            <Typography
            sx={{
                fontSize: 18,
                fontWeight: 300,
                textAlign: 'center',
                backgroundColor: '#40997E',
                padding: 1,
                color: '#fff',
                width: '67%'
            }}
            >
                67%
            </Typography>
            <Typography
            sx={{
                fontSize: 18,
                color: '#fff',
                textAlign: 'center',
                fontWeight: 300,
                backgroundColor: '#E2A925',
                padding: 1,
                width: '50%'
            }}
            >   
                50%
            </Typography>
        </Box>
    
            <Typography
            sx={{
                fontSize: 13,
                fontWeight: 300,
                textAlign: 'center',
                padding: 1,
            }}
            >
            Total de ingresos esperados : $ 29,56,000
            </Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 2
            }}>
            <Typography
            sx={{
                fontSize: 11,
                fontWeight: 300,
                textAlign: 'center',
                margin: 2,
            }}
            >
            <span style={{ 
                padding: 10,
                marginRight: 5,
                backgroundColor: '#40997E', 
                }}></span> 
            Ingresos generados : $ 20,00,000
            </Typography>
            <Typography
            sx={{
                fontSize: 11,
                fontWeight: 300,
                textAlign: 'center',
                padding: 1,
            }}
            >
            <span style={{ 
                padding: 10,
                marginRight: 5,
                backgroundColor: '#E2A925', 
                }}></span> 
            Ingresos pendiente : $ 9,56,000
            </Typography>
        </Box>
        </CardContent>
    </Card>
    </Box>
  );
};

export default CardInformation;