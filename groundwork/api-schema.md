---
description: Keep your promises and make what you do crystal-clear with an API schema.
---

# API schema

You may remember that back in the strategic DDD section—during the context mapping to be exact—we decided that the `VerificationCode` subdomain and `Reservation` subdomain would have a `Published Language` relationship. Now is the time to address that fact.

The reason we have API schemas is that they serve as human- and machine-readable documentation, and are far better and more portable than any old Word file, Google Doc, or Sharepoint site. **Using a standardized API specification is the way you **_**should**_** document** and it's not that hard either, once you start getting the hang of it!

## Choosing AsyncAPI

In a modern, hybrid landscape where we have both REST and event-driven APIs, it makes sense to reach for the new kid on the block, [AsyncAPI](https://www.asyncapi.com), rather than [OpenAPI](https://www.openapis.org). While OpenAPI is well-known and has a proven track record, it won't cut it in the more confusing technical landscapes of today. With AsyncAPI we get the possibility to not just get some [smooth tooling](https://github.com/asyncapi), but we'll also be able to actually [describe a system that has events and asynchronous responses](https://www.asyncapi.com/docs/tutorials/getting-started/coming-from-openapi).

> AsyncAPI is an open source initiative that seeks to improve the current state of Event-Driven Architectures (EDA). Our long-term goal is to make working with EDAs as easy as it is to work with REST APIs. That goes from documentation to code generation, from discovery to event management. Most of the processes you apply to your REST APIs nowadays would be applicable to your event-driven/asynchronous APIs too.
>
> — [https://www.asyncapi.com/docs/tutorials/getting-started](https://www.asyncapi.com/docs/tutorials/getting-started)

Before we move on, please know that AsyncAPI does not reinvent the wheel—it actually has some support for both OpenAPI and [JSON Schema](https://json-schema.org) for their respective powerful features.

{% hint style="info" %}
I am writing this while AsyncAPI literally just today came out with version `2.5.0`.

It's worth mentioning that indeed the API documentation experience for what we have here, a _de facto_ RESTish API, could have been done with OpenAPI 3 just as well. We have to approach this in a bit of a hackish way to make it semantic within the boundaries of the standard.

AsyncAPI is expected to bring major improvements to this overall area, though unclear exactly which set of such improvements, in the next major version.

Regardless: You should definitely put familiarity with this new specification high on your list of things to look into.
{% endhint %}

Anyway, time to get to it.

## Writing the schema

The schema looks like the below. Notice the top-level objects:

* `info`: General useful information like the contact person for the service, the service's name, and description...
* `externalDocs`: Any links to external documentation
* `servers`: Where can you actually run the events and requests?
* `channels`: The addressable components, or "things", as it were
* `components`: Reusable objects, such as messages
* `schemas`: Definition of inputs and outputs

```json
{
  "asyncapi": "2.5.0",
  "info": {
    "title": "VerificationCode",
    "version": "1.0.0",
    "contact": {
      "name": "Sam Person",
      "url": "https://acmecorp.com/docs#owner",
      "email": "sam@acmecorp.xyz"
    },
    "description": "`VerificationCode` generates and validates codes for slot reservations."
  },
  "externalDocs": {
    "description": "Confluence documentation",
    "url": "https://acmecorp.com/VerificationCode/docs"
  },
  "servers": {
    "production": {
      "url": "https://RANDOM.execute-api.REGION.amazonaws.com/prod",
      "protocol": "http",
      "description": "Production endpoint."
    }
  },
  "channels": {
    "generateCode": {
      "publish": {
        "message": {
          "$ref": "#/components/messages/GenerateCode"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      },
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/GenerateCodeResponse"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      }
    },
    "removeCode": {
      "publish": {
        "message": {
          "$ref": "#/components/messages/RemoveCode"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      },
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/RemoveCodeResponse"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      }
    },
    "verifyCode": {
      "publish": {
        "message": {
          "$ref": "#/components/messages/VerifyCode"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      },
      "subscribe": {
        "message": {
          "$ref": "#/components/messages/VerifyCodeResponse"
        },
        "bindings": {
          "http": {
            "type": "request",
            "method": "POST"
          }
        }
      }
    }
  },
  "components": {
    "messages": {
      "GenerateCode": {
        "name": "GenerateCode",
        "title": "GenerateCode",
        "summary": "Generate a verification code for a provided slot ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/SlotIdInput"
        }
      },
      "GenerateCodeResponse": {
        "name": "GenerateCodeResponse",
        "title": "GenerateCodeResponse",
        "summary": "Returns the name of the customer using the given ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/GenerateCodeResponse"
        }
      },
      "RemoveCode": {
        "name": "RemoveCode",
        "title": "RemoveCode",
        "summary": "Remove a verification code for a provided slot ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/SlotIdInput"
        }
      },
      "RemoveCodeResponse": {
        "name": "RemoveCodeResponse",
        "title": "RemoveCodeResponse",
        "summary": "Returns the name of the customer using the given ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/RemoveCodeResponse"
        }
      },
      "VerifyCode": {
        "name": "VerifyCode",
        "title": "VerifyCode",
        "summary": "Verify a provided code for a given slot ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/VerifyCodeInput"
        }
      },
      "VerifyCodeResponse": {
        "name": "VerifyCodeResponse",
        "title": "VerifyCodeResponse",
        "summary": "Returns the name of the customer using the given ID.",
        "contentType": "application/json",
        "payload": {
          "$ref": "#/components/schemas/VerifyCodeResponse"
        }
      }
    },
    "schemas": {
      "SlotIdInput": {
        "type": "object",
        "description": "The slot ID to create or remove a verification code for.",
        "properties": {
          "slotId": {
            "type": "string",
            "description": "Slot ID"
          }
        },
        "additionalProperties": false
      },
      "VerifyCodeInput": {
        "type": "object",
        "description": "The slot ID and verification code to verify together.",
        "properties": {
          "verificationCode": {
            "type": "string",
            "description": "8-character verification code"
          },
          "slotId": {
            "type": "string",
            "description": "Slot ID"
          }
        },
        "additionalProperties": false
      },
      "GenerateCodeResponse": {
        "type": "string",
        "description": "Verification code"
      },
      "RemoveCodeResponse": {
        "type": "null",
        "description": "Returns HTTP status `204 No content`"
      },
      "VerifyCodeResponse": {
        "type": "string",
        "description": "8-character verification code"
      }
    }
  }
}
```

{% hint style="info" %}
Note that you can use both JSON and YAML formats when writing the schema, but because JSON is typically more portable I've gone with that here.
{% endhint %}

{% hint style="success" %}
Absolutely do try out some of the [nice tutorials they have prepared](https://www.asyncapi.com/docs/tutorials/getting-started).
{% endhint %}

With some [good IDE tooling](https://github.com/asyncapi/vs-asyncapi-preview), you should be able to get a good experience already in your IDE, but you can also copy the schema above into the online [AsyncAPI Studio](https://studio.asyncapi.com) and get a visualized and live result to work on. Fancy indeed!

Even cooler is that that tooling is available for you to use as well, so you can generate these views during your Continuous Integration step for example.

<figure><img src="../.gitbook/assets/asyncapi-1.png" alt=""><figcaption><p>Split view with all kinds of information/navigation to the far left, the schema in the middle, and the visualization on the right.</p></figcaption></figure>

<figure><img src="../.gitbook/assets/asyncapi-2.png" alt=""><figcaption><p>You can even follow the flows of "published" and "subscribed" events. Because we are doing HTTP this of course translates conceptually to requests and responses.</p></figcaption></figure>

And with this work behind us, we have now come through on our promise to have a "published language" that describes how our service works. In fact, we have done this even before building the actual API in the first place!

Brilliant.
