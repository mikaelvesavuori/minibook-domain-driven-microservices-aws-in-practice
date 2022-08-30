---
description: >-
  The code isn't a fighter jet, but some guidance might be in order for you to
  get the best out of it.
---

# How to follow along

TODO entire page

You can...

* **Go on a guided tour**: Grab a coffee, just read and follow along with links and references to the work.

or

* **Do this as a full-on workshop**: Clone the repo, run `npm install` and `npm start`, then read about the patterns and try it out in your own self-paced way.

## Commands

The below commands are those I believe you will want to use. See `package.json` for more commands!

* `npm start`: Runs Serverless Framework in offline mode
* `npm test`: Tests code
* `npm run deploy`: Deploys code with Serverless Framework
* `npm run release`: Run [standard-version](https://github.com/conventional-changelog/standard-version#cutting-releases)
* `npm run build`: Package and build the code with Serverless Framework

{% hint style="info" %}
Also, the code's "mono repo" structure is more for convenience than a "decision" as such.
{% endhint %}

## Prerequisites

_These only apply if you want to deploy code._

* Amazon Web Services (AWS) account with sufficient permissions so that you can deploy infrastructure. A naive but simple policy would be full rights for CloudWatch, Lambda, API Gateway, X-Ray, S3, and CodeDeploy.
* GitHub account to host your Git fork and for running CI with GitHub Action.
* Create a mock API payload on Mockachino.
* **Suggested**: For example a Cloudflare account for hosting your static documentation on Cloudflare Pages.
* **Optional**: Bump account to host your API description. You can remove the Bump section from `.github/workflows/main.yml` if you want to skip this.

All of the above services can be had for free!

### 1. Clone or fork the repo

Clone and fork the repo as you normally would.
