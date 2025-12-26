import { getJsonWebToken } from './jwtHelper.mjs';
import { convertCredentialsStringToObject, createResponse } from './helpers.mjs';
import { validateCredentials } from './validationHelper.mjs';

export const handler = async (event) => {

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify('Hello from Lambda!')
  // };

  // return response; 

  try {
    console.log("Event ", event);
    let decodedBody;
    if (event.isBase64Encoded) {
      decodedBody = Buffer.from(event.body, 'base64').toString('utf-8');
      console.log("decodedBody1", decodedBody);
    } else {
      decodedBody = event.body;
      console.log("decodedBody2", decodedBody);
    }
    let requestBody = convertCredentialsStringToObject(decodedBody);
    console.log("Request Body ", requestBody);

    let scopeArray = requestBody.scope ? requestBody.scope.split(' ') : [];
    await validateCredentials(requestBody.client_id, requestBody.client_secret, scopeArray);
    let jwt = await getJsonWebToken(requestBody.client_id, scopeArray);

    return createResponse(200, { access_token: jwt });
  }
  catch (err) {
    console.error(err);
    return createResponse(err.code ?? 500, err.message ?? "Internal Server Error");
  }
};
