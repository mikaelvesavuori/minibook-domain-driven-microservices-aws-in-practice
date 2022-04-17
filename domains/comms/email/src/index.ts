import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @description The controller for our service that gets Catalogist records.
 */
export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log("Stock function");

    return {
      statusCode: 200,
      body: JSON.stringify("Stock function"),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
}
