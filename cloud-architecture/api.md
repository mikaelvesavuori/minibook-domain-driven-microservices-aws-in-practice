# API

The de facto standard in the modern cloud is that you leverage the native API products to front your applications rather than building something on your own with the likes of Express, Fastify, or Kong.

The API gateway will be the public interface connected to our other infrastructure, most importantly our Lambda compute functions which will respond on paths that we have defined.

In the case of AWS the service we are interested in is unsurprisingly called "API Gateway".

### Is there an option?

It's a bit of a theoretical digressing to wander down the path of asking oneself "but COULD I set up another API gateway solution"? In short the answer is yes, but then you would most likely (and most effectively) do it in a persistent virtual machine, which is not very serverless. So, yes, you could do it. But no, we won't. While it does hurt me to write it, this is one of the integration parts that you should leverage maximally when committing to a cloud service provider. Only if you were absolutely sure that you want an open source or multi-cloud solution should you practically consider this option.

### Choosing the type of API Gateway

One of the configuration questions we can look at has to do with which type of API Gateway we want. The traditional one is called "REST API" and the newer, lighter-weight one that came out in 2019 is named "HTTP API". All of this is probably somewhat confusing, and you would not be the first one to feel so. These are sometimes also called "v1" (REST API) and "v2" (HTTP API) API Gateways which at least for me makes a lot more sense. Do note that both of these work just fine with actual HTTP(S) and REST; in fact the naming is just plain bonkers.

Some of the additional features of v1 includes:

* AWS X-Ray tracing
* API keys support and per-client throttling
* Caching
* Request validation
* Edge-optimized endpoints

There are certainly benefits by going with the HTTP API as well, for example:

* Much cheaper to run
* They actually do support many (most?) features of v1
* Includes exclusive support for JWT authorization directly on the Gateway (v1 has to use a Lambda authorizer to do the same)
* Has exclusive support for certain integrations

_Read more at_ [_https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html_](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)_._

From a non-functional requirements perspective, the items listed in the REST API benefits are things we absolutely want to use, and since price effectively is not a real concern at this small scale, that argument becomes moot.
