import base64url from "base64url";
import { KMS } from "@aws-sdk/client-kms"
var kms = new KMS();

export const getJsonWebToken = async (clientId, scope) => {
    let header = {
      alg: "RS256",
      typ: "JWT"
    };

    let iss = process.env.ISS;
    
    let payload = {
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        iat: Math.floor(Date.now() / 1000),
        iss: iss,
        client_id: clientId,
        scope: scope
    };
    
    let jwt_parts = { 
        header: base64url(JSON.stringify(header)),
        payload: base64url(JSON.stringify(payload))
    };

    let kmsKeyId = process.env.KMS_KEY_ID;
    
    let params = {
        KeyId: kmsKeyId,
        Message: Buffer.from(jwt_parts.header + "." + jwt_parts.payload),
        MessageType: "RAW",
        SigningAlgorithm: "RSASSA_PKCS1_V1_5_SHA_256"
    };
    
    let signed_jwt = await kms.sign(params);
    console.log(signed_jwt);
    
    jwt_parts.signature =  base64url(Buffer.from(signed_jwt.Signature));
    
    return jwt_parts.header + "." + jwt_parts.payload + "." + jwt_parts.signature;
}