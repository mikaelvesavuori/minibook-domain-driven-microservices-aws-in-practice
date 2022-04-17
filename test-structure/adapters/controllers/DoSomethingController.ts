import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 * @description The controller for our service that...
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    console.log(event);

    return {
      statusCode: 200,
      body: JSON.stringify('Hey!')
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }
}
