import { Card, Typography, CardContent, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#40997E", "#E2A925"];

const AtomCardInformation = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {data.map((item, index) => {
        const dataItem = item.data?.[0] || {};
        const aplica = dataItem.aplicaBono ? "Aplica Bono" : "No Aplica Bono";
        const cantidad = parseInt(dataItem.cantidad) || 0;
        const total = parseFloat(dataItem.total) || 0;

        const chartData = [
          { name: aplica, value: total },
          { name: "Pendiente", value: 100 - total },
        ];

        return (
          <Card
            key={index}
            variant="outlined"
            sx={{
              borderRadius: 3,
              border: "none",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 500,
                  fontSize: 22,
                }}
              >
                {item.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  width: "100%",
                  mt: 2,
                }}
              ></Box>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 2,
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
                      {chartData.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
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
                      {total}
                    </text>
                  </PieChart>
                </Box>

                <Box
                  sx={{
                    border: "1px solid #f5f5f5",
                    borderRadius: 2,
                    padding: 2,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Datos
                  </Typography>
                  {chartData.map((entry, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2">{entry.name}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 300,
                  textAlign: "center",
                  padding: 1,
                  mt: 2,
                }}
              >
                Cantidad: {cantidad} — Total: ${parseFloat(total).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default AtomCardInformation;