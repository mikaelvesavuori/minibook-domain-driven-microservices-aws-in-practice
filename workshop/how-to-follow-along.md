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

### Optional: Get a Bump account and token

_If you don't want to use Bump, go ahead and remove the part at the end of `.github/workflows/main.yml`._

Go to the [Bump website](https://bump.sh) and create a free account and get your token (accessible under `CI deployment`, see the `Access token` field).

**Copy the token for later use.**

### 2. Mockachino feature toggles

We will use [Mockachino](https://www.mockachino.com) as a super-simple mock backend for our feature toggles. This way we can continuously change the values without having to redeploy a service or anything else.

It's really easy to set up. Go to the website and paste this payload into the `HTTP Response Body`:

```json
{
  "error": {
    "enableBetaFeatures": false,
    "userGroup": "error"
  },
  "legacy": {
    "enableBetaFeatures": false,
    "userGroup": "legacy"
  },
  "beta": {
    "enableBetaFeatures": true,
    "userGroup": "beta"
  },
  "standard": {
    "enableBetaFeatures": false,
    "userGroup": "standard"
  },
  "dev": {
    "enableBetaFeatures": true,
    "userGroup": "dev"
  },
  "devNewFeature": {
    "enableBetaFeatures": true,
    "enableNewUserApi": true,
    "userGroup": "devNewFeature"
  },
  "qa": {
    "enableBetaFeatures": false,
    "userGroup": "qa"
  }
}
```

Change the path from the standard `users` to `toggles`. Click `Create`.

You will get a "space" in which you can administer and edit the mock API. You'll see a link in the format `https://www.mockachino.com/spaces/SOME_RANDOM_LINK_HERE`.

**Copy the endpoint, you'll use it shortly.**

### 3. First deployment to AWS using Serverless Framework

Install all dependencies with `npm install`, set up [husky](https://github.com/typicode/husky) pre-commits with `npm run prepare`, then make the first deployment from your machine with `npm run deploy`.

We do this so that the dynamic endpoints are known to us; we have a logical dependency on these when it comes to our test automation.

**Copy the endpoints to the functions.**

### 4. Update references

Next, update the environment value in `serverless.yml` (around lines 35-36) to reflect your Mockachino endpoint:

```
environment:
 TOGGLES_URL: https://www.mockachino.com/YOUR_RANDOM_STRING/toggles
```

Next, also update the following files to reflect your Mockachino endpoint:

* `jest.env.js` (line 2)
* `tests/mocks/handlers.ts` (line 11-12)

Continue by updating the following files to reflect your FakeUser endpoint on AWS:

* `api/schema.yml` (line 8)
* `tests/integration/index.ts` (line 6-7)
* `tests/load/k6.js` (line 6)

If you chose to use Bump:

* Add your document name in the CI script `.github/workflows/main.yml` on line 113 (`doc: YOUR_DOC_NAME`)
* Update the reference to the Bump docs in `PROJECT.md` on line 43.

### Optional: Continuous Integration (CI) on GitHub

If you connect this repository to GitHub you will be able to use GitHub Actions to run a sample CI script with all the tests, deployments, and stuff. The CI script acts as a template for how you can tie together all the build-time aspects in a simple way. It should be easily portable to whatever CI platform you might otherwise be running.

You'll need a few [secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) set beforehand if you are going to use it:

* `AWS_ACCESS_KEY_ID`: Your AWS access key ID for a deployment user
* `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key for a deployment user
* `FAKE_USER_ENDPOINT`: Your AWS endpoint for the FakeUser service, in the format `https://RANDOM.execute-api.REGION.amazonaws.com/shared/fakeUser` (known after the first deployment)
* `MOCKACHINO_ENDPOINT`: Your Mockachino endpoint for feature toggles, in the format `https://www.mockachino.com/RANDOM/toggles`
* `BUMP_TOKEN`: Your token for [Bump](https://bump.sh) which will hold your API docs (just skip if you don't want to use it; also remove it from the CI script in that case)

### Optional: Deploy documentation to the web

If you have this repo in GitHub you can also very easily connect it through Cloudflare Pages to deploy the documentation as a website generated by TypeDoc.

You need to set the build command to `npm run build:hosting`, then the build output directory to `typedoc-docs`.

See the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/platform/github-integration) for more information.

_You can certainly use something like_ [_Netlify_](https://github.com/marketplace/actions/netlify-deploy) _if that's more up your alley._

### 5. Deploy the complete project

You can now deploy the project manually or through CI, now that all of the configurations are done.

Great work!
