# Security

As noted in the API section, there exists a few security aspects that we need to keep in mind.

We don't want to double-down on security here, but we need to stay mindful of malicious usage.

Ways we want to mitigate such is:

* Limit scaling and provide a maximum provisioned surface for APIs etc so we cannot get "denial-by-wallet" attacks
* Use authorization mechanisms, even something simple like an API key
* Use CORS to restrain domains that may call the services
