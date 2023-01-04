import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Box, IconButton } from '@mui/material';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function OfferCard(props) {

    const [expanded, setExpanded] = useState(false);
    const landNumeration = 1;

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    return (
        <Card sx={{ mb: 3, maxWidth: 345, borderRadius: 3, boxShadow: 24, }}>
            <CardHeader
                title={"Offer: " + props.idNumber} />
            <CardContent>
                <Typography paragraph>
                    Price:
                </Typography>
                <Typography paragraph>
                    Total lands contained:
                </Typography>
                <Box display='inline-flex' alignItems='center'>
                    <Typography variant='body2' color="text.secondary" >
                        Lands list:
                    </Typography>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>


                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'red' }}>
                        <Typography variant='body2' color='white'>
                            1° (15, 22)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Leggendaria
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'green' }}>
                        <Typography variant='body2' color='white'>
                            (18, 6)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Comune
                        </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' sx={{ p: 1, backgroundColor: 'blue' }}>
                        <Typography variant='body2' color='white'>
                            (132, 55)
                        </Typography>
                        <Typography variant='body2' color='white'>
                            Rara
                        </Typography>
                    </Box>

                </Collapse>
            </CardContent>

            <CardActions>
                <Box sx={{ p: 1 }}>
                    <Typography paragraph>
                        Created by:
                    </Typography>
                    <Typography paragraph>
                        Creator fee:
                    </Typography>
                    <Box display='flex' flexDirection='column'>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                Gifts contained:
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                        <Box display="inline-flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <Typography sx={{ mr: 5 }}>
                                Adjacency bonus:
                            </Typography>
                            <DoneOutlineIcon sx={{ ml: 5 }} />
                        </Box>
                    </Box>
                </Box>
            </CardActions>
        </Card >
    );
} export default OfferCard;




/*
    /-----------------------/
    /----- SPIEGAZIONE -----/
    /-----------------------/

    Dentro il "Collapse", al posto del codice di prova, andrà inserito il MAP prendendo i dati delle land 
    inserite nell'offerta.

    Ipotizziamo che tra i dati ci siano:
        -   le coordinate della land (string -> "( X, Y)")
        -   la rarità (string -> "R")

    Il mapping creerà un Box il cui colore dipenderà dalla rarità della land: bisognerà creare una 
    funzione "checkRarity(string)" che, presa la rarità della land, restituirà un colore.
    
    All'interno del Box ci sarà un Typography che andrà a scrivere il numero cardinale della land 
    (in ordine di inserimento nell'offerta), seguito dalle coordinate della land e dalla sua rarità.


    /------------------/
    /----- CODICE -----/
    /------------------/

            {
              LAND_LIST.map((info) => {
                return (
                    <Box display='inline-flex' justifyContent='space-between' 
                        sx={{ p: 1, backgroundColor: {checkRarity(info.rarity)} }}>
                        <Typography variant='body2' color='white'>
                            { landNumeration + " " + info.coordinates}
                        </Typography>
                        <Typography variant='body2' color='white'>
                            {info.rarity}
                        </Typography>
                    </Box>
                )
              }
              );
              landNumeration++;
            }

*/