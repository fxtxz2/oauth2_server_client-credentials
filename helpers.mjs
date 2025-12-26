export const convertCredentialsStringToObject = (credentialsString) => {
    const params = new URLSearchParams(credentialsString);
    const obj = {};

    for (const [key, value] of params.entries()) {
        obj[key] = value;
    }

    return obj;
};

export const customException = (code, message) => {
    let error = new Error(message);
    error.code = code;
    return error;
};

export const createResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
};