# Lambda authorizer

Example:

{% code title="code/Reservation/SlotReservation/src/infrastructure/authorizers/Authorizer.ts" lineNumbers="true" %}
```typescript
import { APIGatewayProxyResult } from 'aws-lambda';

import fetch from 'node-fetch';

import { AuthorizationHeaderError } from '../../application/errors/AuthorizationHeaderError';
import { InvalidVerificationCodeError } from '../../application/errors/InvalidVerificationCodeError';
import { MissingSecurityApiEndpoint } from '../../application/errors/MissingSecurityApiEndpoint';

const SECURITY_API_ENDPOINT_VERIFY = process.env.SECURITY_API_ENDPOINT_VERIFY || '';

/**
 * @description Authorizer that will check the `event.Authorization` header
 * for a slot ID (separated by a pound sign, or "hash tag") and a verification code
 * and validate it against the Security API.
 *
 * @example `Authorization: b827bb85-7665-4c32-bb3c-25bca5d3cc48#abc123` header.
 */
export async function handler(event: Record<string, any>): Promise<APIGatewayProxyResult> {
  try {
    if (event.httpMethod === 'OPTIONS') return handleCors();
    if (!SECURITY_API_ENDPOINT_VERIFY) throw new MissingSecurityApiEndpoint();

    // Get required values
    const header = event.headers['Authorization'];
    const [slotId, verificationCode] = header.split('#');
    if (!slotId || !verificationCode) throw new AuthorizationHeaderError();

    // Verify code
    const isCodeValid = await validateCode(slotId, verificationCode);
    if (!isCodeValid) throw new InvalidVerificationCodeError();

    return generatePolicy(verificationCode, 'Allow', event.methodArn, '');
  } catch (error: any) {
    console.error(error.message);
    return generatePolicy('failed', 'Deny', event.methodArn, {}); // TODO: Ensure this works if not same as in the OK one above
  }
}

/**
 * @description CORS handler.
 */
function handleCors() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      Vary: 'Origin'
    },
    body: JSON.stringify('OK')
  } as APIGatewayProxyResult;
}

/**
 * @description Creates the IAM policy for the response.
 */
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  data: string | Record<string, any>
) => {
  // @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
  const authResponse: any = {
    principalId
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };

    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = {
    stringKey: JSON.stringify(data)
  };

  return authResponse;
};

/**
 * @description Validate a code.
 */
async function validateCode(slotId: string, verificationCode: string): Promise<boolean> {
  return await fetch(SECURITY_API_ENDPOINT_VERIFY, {
    body: JSON.stringify({
      slotId,
      code: verificationCode
    }),
    method: 'POST'
  })
    .then((response) => response.json())
    .then((result) => {
      if (result === true) return true;
      return false;
    })
    .catch((error) => {
      console.error(error.message);
      return false;
    });
}
```
{% endcode %}