import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';

const AccordionSection = ({
    title,
    expanded,
    onChange,
    children,
    backgroundColor = '#E9F7FF',
  }) => (
    <Accordion expanded={expanded} onChange={onChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{ backgroundColor, borderRadius: 1 }}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
          {children}
      </AccordionDetails>
    </Accordion>
  );
  
export default AccordionSection;