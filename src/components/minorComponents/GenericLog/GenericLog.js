import './GenericLog.css';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';



const GenericLog = (props) => {

    useEffect(() => {
        setTimeout(() => props.logReset(), 3000);
    });

    return (
        <Box display='flex' className='logBackground' style={logBackgroundStyle}>
            <LogDecoration className='fadingLog'
                logType={props.logType}
                logMessage={props.logMessage} />
        </Box>
    );
}; export default GenericLog;


const logBackgroundStyle = {
    position: 'fixed',
    top:'90%',
    left: '50%',
    width: '110%',
    height: 200,
    zIndex: 1400
}

const logGenericStyle = {
    position: 'fixed',
    top: '90%',
    left: '50%',
    transform: 'translate(-50%, -150%)',
    maxWidth: 400,
    height: 80,
    borderRadius: 50,
    zIndex: 1500,

};


// Popup base content
function LogBase(props) {

    const logType = props.logType;

    return (
        <Box display='flex' justifyContent='center' alignItems='center' sx={{ m: 0.5, maxWidth: 400, height: 72, borderRadius: 10, backgroundColor: 'white' }}>
            <Box display='flex' justifyContent='flex-start'>
                <Typography className={{ logType } + 'Text'} variant='h1' sx={{ m: 5, fontSize: 18, fontWeight: 500 }}>
                    {props.logMessage}
                </Typography>
            </Box>
        </Box>
    );
}


// Decoration for various popup types
function LogDecoration(props) {

    switch (props.logType) {
        case 'success':
            return (
                <Box className='successPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={logGenericStyle}>
                    <LogBase
                        logType={props.logType}
                        logMessage={props.logMessage} />
                </Box>
            );
        case 'warning':
            return (
                <Box className='warningPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={logGenericStyle}>
                    <LogBase
                        logType={props.logType}
                        logMessage={props.logMessage} />
                </Box>
            );
        case 'error':
            return (
                <Box className='errorPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={logGenericStyle}>
                    <LogBase
                        logType={props.logType}
                        logMessage={props.logMessage} />
                </Box>
            );
        default:
            return (
                <Box className='normalPopupBackground' display='flex' justifyContent='center' alignItems='center' sx={logGenericStyle}>
                    <LogBase
                        logType={props.logType}
                        logMessage={props.logMessage} />
                </Box>
            );
    }
}
