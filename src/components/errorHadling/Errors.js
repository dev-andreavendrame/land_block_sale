import GenericLog from "../minorComponents/GenericLog/GenericLog";

export function getPopupContent(errorType, stateVariable, setStateFunction) {

    switch (errorType) {
        case "warning":
            return (<GenericLog
                logType='warning'
                logMessage={stateVariable}
                logReset={setStateFunction} />);
        case "error":
            return (
                <GenericLog
                    logType='error'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        case "success":
            return (
                <GenericLog
                    logType='success'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
        default:
            return (
                <GenericLog
                    logType='normal'
                    logMessage={stateVariable}
                    logReset={setStateFunction} />);
    }

}