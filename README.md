# textifai

Forked from [SaaS-starter](https://github.com/danielsteman/saas-starter).

### Structure

Following microservices architecture, the backend is separated into several smaller components (as suggested by [nodebestpractices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)), each being a separate Express app.

### Development

Install:

- Node v16
- Yarn

Global node dependencies:

`npm install -g typescript` to globally install Typescript.

`npm i -g gitmoji-cli` to install and `gitmoji install` in the cloned repository to be prompted for awesome commit message emojis at every commit (works like a pre-commit-hook).

### Deployment

Deployments are done with Terraform Cloud, which receives GCP credentials through `GOOGLE_CREDENTIALS` environment variable, which should be set to the json key of a (manually created) service account without newlines. The json key can be retrieved through the GCP console and can be transformed to a single line using `cat ~/Downloads/keyfile.json| tr -s '\n' ' '`.

### Notes

Terraform TODO: add credentials to Terraform Cloud.
[Terraform example](https://gist.github.com/Zebreus/906b8870e49586adfe8bd7bbff43f0a8)

Structure TODO: checkout best practice monorepo project structures

Workflow TODO: add pre-commit hooks

Workflow TODO: run tests in pipeline

Deployment TODO: create Dockerfiles

Workflow TODO: build docker images in pipeline
