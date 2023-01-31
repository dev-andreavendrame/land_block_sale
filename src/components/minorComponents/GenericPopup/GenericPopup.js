import './GenericPopup.css';
import { Box, Grid, Typography, Button, Modal } from '@mui/material';

function GenericPopup(props) {

    const popupGenericStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 300,
        borderRadius: 5
    };

    // Popup base content
    function PopupBase(props) {

        const popupType = props.popupType;
        const popupButtonAction = props.popupButtonAction;

        return (
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: 390, height: 290, borderRadius: 4, backgroundColor: 'white' }}>
                <Box display='flex' justifyContent='flex-start'>
                    <Typography className={{ popupType } + 'Text'} variant='overline' sx={{ fontSize: 15, fontWeight: 600 }}>
                        {popupType}
                    </Typography>
                </Box>
                <Grid container spacing={1} direction='column'>
                    <Grid item xs={8}>
                        <Typography variant='body1' sx={{ fontSize: 18, fontWeight: 600 }}>
                            Lorem ipsum - questo testo serve puramente come prova. Il test è utile a capire come si presenta visivamente a schermo
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={popupButtonAction} className={'genericPopupButton genericPopupButton--' + { popupType }} variant='contained' size='medium' sx={{ borderRadius: 50 }}>
                            Prova Prova
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        );
    }


    // Decoration for various popup types
    function PopupDecoration(props) {

        switch (props.popupType) {
            case 'success':
                return (
                    <Box className='successPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={popupGenericStyle}>
                        <PopupBase
                            popupType={props.popupType}
                            popupMessage={props.popupMessage}
                            popupButtonMessage={props.popupButtonMessage}
                            popupButtonAction={props.popupButtonAction} />
                    </Box>
                );
            case 'warning':
                return (
                    <Box className='warningPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={popupGenericStyle}>
                        <PopupBase
                            popupType={props.popupType}
                            popupMessage={props.popupMessage}
                            popupButtonMessage={props.popupButtonMessage}
                            popupButtonAction={props.popupButtonAction} />
                    </Box>
                );
            case 'danger':
                return (
                    <Box className='dangerPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={popupGenericStyle}>
                        <PopupBase
                            popupType={props.popupType}
                            popupMessage={props.popupMessage}
                            popupButtonMessage={props.popupButtonMessage}
                            popupButtonAction={props.popupButtonAction} />
                    </Box>
                );
            default:
                return (
                    <Box className='normalPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={popupGenericStyle}>
                        <PopupBase
                            popupType={props.popupType}
                            popupMessage={props.popupMessage}
                            popupButtonMessage={props.popupButtonMessage}
                            popupButtonAction={props.popupButtonAction} />
                    </Box>
                );
        }
    }

    return (
        <Modal
            open={props.handleOpen}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ backdropFilter: "blur(3px)" }}
        >
            <PopupDecoration
                popupType={props.popupType}
                popupMessage={props.popupMessage}
                popupButtonMessage={props.popupButtonMessage}
                popupButtonAction={props.popupButtonAction} />
        </Modal>
    );

} export default GenericPopup;