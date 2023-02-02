import GenericLog from "../minorComponents/GenericLog/GenericLog";

export const LAND_NOT_FOUND = 1;
export const INVALID_COORDINATES = 2;
export const COORDINATES_ALREADY_INSERTED = 3;
export const NEGATIVE_COORDINATE = 4;


export function getPopupContent(errorCode, stateVariable, setStateFunction) {

    switch (errorCode) {
        case LAND_NOT_FOUND:
            return (<GenericLog
                logType='error'
                logMessage={stateVariable}
                logReset={setStateFunction} />);
        case INVALID_COORDINATES:
            return (
                <GenericLog
                    logType='warning'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case COORDINATES_ALREADY_INSERTED:
            return (
                <GenericLog
                    logType='warning'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case NEGATIVE_COORDINATE:
            return (
                <GenericLog
                    logType='warning'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
                default:
            return (<></>);
    }

}