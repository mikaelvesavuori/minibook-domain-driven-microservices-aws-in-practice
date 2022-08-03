# Technical boilerplating

Because we already have some self-constructed constraints, we have a relatively good idea of what type of packages to bring in.

Thus, we will make some high level definitions already regarding boilerplate:

* [TypeScript](https://www.typescriptlang.org) as our language
* [Prettier](https://prettier.io) and [ESLint](https://eslint.org) for linting
* [Serverless Framework](https://www.serverless.com) to deploy and package services
* [Webpack](https://webpack.js.org) to bundle code
* [AVA](https://github.com/avajs/ava) for writing and running tests
* [Madge](https://github.com/pahen/madge), [cfn-diagram](https://github.com/mhlabs/cfn-diagram), and [TypeDoc](https://typedoc.org) to generate documentation
* [MikroLog](https://github.com/mikaelvesavuori/mikrolog) as the logging library
* Mono repo structure to make it easier to work with in our setting
* [Visual Studio Code](https://code.visualstudio.com) as the editor
* AWS libraries for their respective services (DynamoDB, EventBridge...)

This should satisfy the majority of our generic concerns in the project. Moreover, each individual service will use pretty much the same set of dependencies and scripts.

