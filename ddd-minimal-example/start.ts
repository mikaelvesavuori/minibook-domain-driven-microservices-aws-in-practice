import fetch from "node-fetch";

/**
 * This would be what a client would do, similar to the procedural pattern called "transaction script".
 * @see https://martinfowler.com/eaaCatalog/transactionScript.html
 * The transaction script itself is not an anti-pattern, given the right circumstances.
 * The problem here is rather that logic leaks right into the client, instead of encapsulating it in the service.
 */

/**
 * NOTE: First, set up your endpoint with mock responses and then update the URL root.
 */
const API_ENDPOINT = "https://some_fake_url.com/api";

/**
 * @todo Refactor to "worse" solution, using just a local database?
 */
async function callApi(url: string, payload?: string) {
  return await fetch(`${API_ENDPOINT}/${url}`);
}

/**
 * @todo Add contrived example of validating and/or moving responses between calls.
 */
async function makeTransaction() {
  const orderNumber = await callApi(`validateOrder`, "kj4t89j3")
    .then((res: any) => res.json())
    .then((res: any) => res.orderNumber);
  await callApi(`createOrder`, orderNumber);
  await callApi(`getOrders`);
}

makeTransaction();
