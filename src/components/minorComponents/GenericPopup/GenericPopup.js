import './GenericPopup.css';
import { Box, Grid, Typography, Button, Modal } from '@mui/material';

function GenericPopup(props) {

    const popupGenericStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        height: 300,
        borderRadius: 5,
        boxShadow: 12
    };

    // Popup base content
    function PopupBase(props) {

        const popupType = props.popupType;
        const popupButtonAction = props.popupButtonAction;
        const popupButtonMessage = props.popupButtonMessage;
        const popupMessage = props.popupMessage;

        const typeText = {
            position: 'absolute',
            top: '2%',
            left: '7%',
        }

        return (
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: 490, height: 290, borderRadius: 4, backgroundColor: 'white' }}>
                <Box display='flex' justifyContent='flex-start' style={typeText}>
                    <Typography className={popupType + 'Text'} variant='overline' sx={{ fontSize: 16, fontWeight: 1000 }}>
                        {popupType}
                    </Typography>
                </Box>
                <Grid container spacing={1} direction='column' alignItems='center'>
                    <Grid item xs={9}>
                        <Typography align='center' variant='body1' sx={{ p: 2, fontSize: 18, fontWeight: 600 }}>
                            {popupMessage}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={popupButtonAction} className={'genericPopupButton genericPopupButton--' + popupType } variant='contained' size='medium' sx={{ mt: 2, borderRadius: 50 }}>
                            {popupButtonMessage}
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
            case 'error':
                return (
                    <Box className='errorPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={popupGenericStyle}>
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
                            popupType={'normal'}
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