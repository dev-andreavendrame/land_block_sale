import GenericLog from "../minorComponents/GenericLog/GenericLog";

export const LAND_NOT_FOUND = 1;
export const INVALID_COORDINATES = 2;
export const COORDINATES_ALREADY_INSERTED = 3;
export const NEGATIVE_COORDINATE = 4;
export const LAND_NOT_OWNED = 5;
export const OFFER_PRICE_NULL = 6;
export const NOT_ENOUGHT_LANDS_IN_OFFER = 7;
export const DEPOSIT_NOT_DECLARED = 8;
export const DEPOSIT_NOT_DONE_YET = 9;


export function getPopupContent(errorCode, stateVariable, setStateFunction) {

    switch (errorCode) {
        case LAND_NOT_FOUND:
            return (<GenericLog
                logType='danger'
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
        case LAND_NOT_OWNED:
            return (
                <GenericLog
                    logType='error'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case OFFER_PRICE_NULL:
            return (
                <GenericLog
                    logType='warning'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case NOT_ENOUGHT_LANDS_IN_OFFER:
            return (
                <GenericLog
                    logType='error'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case DEPOSIT_NOT_DONE_YET:
            return (
                <GenericLog
                    logType='error'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case DEPOSIT_NOT_DECLARED:
            return (
                <GenericLog
                    logType='error'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        default:
            return (<></>);
    }

}