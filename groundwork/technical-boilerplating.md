---
description: >-
  Truth be told, tech is probably ~90% copy-paste code. Let's be real for a
  second and address that truth.
---

# Technical boilerplating

In software architecture, there is the idea (or _strategy_, even) of "[the last responsible moment](https://www.oreilly.com/library/view/software-architects-handbook/9781788624060/a844b94f-be9e-456d-8ef0-cd9b46b41c33.xhtml)"—

> The **last responsible moment (LRM**) is the strategy of delaying a decision until the moment when the cost of not making the decision is greater than the cost of making it. Design decisions made for software architecture can be among the most important for a software system and they can be among the most difficult to change later.
>
> With traditional software architectures, decisions were made very early in the project. In order to design an evolutionary architecture, it is beneficial to delay a decision until the LRM. This lessens the possibility that a premature decision will be made. Decisions that are made too early are very risky because they may end up being incorrect and then they will result in costly rework.
>
> — _Software Architect's Handbook_ (Ingeno, 2018)

When we talk about software boilerplate, and certainly in the space of doing serverless Node projects, there does indeed exist quite an urgent need to write and set up some degree of boilerplate.

In order to cover concerns like testing, linting, deployment and so on we should make some early (safe) calls. And because we already have some self-constructed constraints, we have a relatively good idea of what type of packages to bring in!

Thus, we will make some high-level definitions already regarding boilerplate:

- [TypeScript](https://www.typescriptlang.org) as our language
- [Prettier](https://prettier.io) and [ESLint](https://eslint.org) for linting
- [Serverless Framework](https://www.serverless.com) to deploy and package services
- [Webpack](https://webpack.js.org) to bundle code
- [AVA](https://github.com/avajs/ava) for writing and running tests
- [Madge](https://github.com/pahen/madge), [cfn-diagram](https://github.com/mhlabs/cfn-diagram), and [TypeDoc](https://typedoc.org) to generate documentation
- [MikroLog](https://github.com/mikaelvesavuori/mikrolog) as the logging library
- [Mono repo](https://monorepo.tools) structure to make it easier to work within our setting
- [Visual Studio Code](https://code.visualstudio.com) as the editor
- AWS libraries for their respective services (DynamoDB, EventBridge...)

This should satisfy the majority of our generic concerns in the project. Moreover, each individual service will use pretty much the same set of dependencies and scripts.

None of these deal with highly particular or minute details. If such details start popping up, our architecture should be flexible and pluggable enough to make it possible for us to adapt later.

{% hint style="info" %}
If you've been around the block for some time you may have questions about some choices, but you will probably be very familiar with many of the above choices. Architects or technical leaders should always consider familiarity a major plus if a tool supports the functional and non-functional needs it needs to address.

However, fight the urge to _always_ use the same things—good developers need to try on new tools as often as they can to stay sharp and ahead of the curve.
{% endhint %}

Most importantly: Right now no one is going to die or complain that we made the above decisions.

Having a clear foundation is something I've seen pay dividends for teams small and large, few and many. As long as we are making humble and unrushed decisions we can make some of these moves on Day 1 without creating too much risk.
