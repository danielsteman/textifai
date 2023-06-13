# textifai

Forked from [SaaS-starter](https://github.com/danielsteman/saas-starter).

## Structure

Following microservices architecture, the backend is separated into several smaller components (as suggested by [nodebestpractices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)), each being a separate Express app.

## Development

### Install:

- Node v16
- Yarn

### 🌎 Environment variables used by the Firebase client library:

- VITE_FIREBASE_APIKEY
- VITE_FIREBASE_AUTHDOMAIN
- VITE_FIREBASE_PROJECTID
- VITE_FIREBASE_STORAGEBUCKET
- VITE_FIREBASE_MESSAGINGSENDERID
- VITE_FIREBASE_APPID

These can be found in `project settings > general > your apps` in the code snippet at the bottom of the page.

### Global node dependencies:

`npm install -g typescript` to globally install Typescript.

`npm i -g gitmoji-cli` to install and `gitmoji install` in the cloned repository to be prompted for commit message emojis at every commit (works like a pre-commit-hook). Categorizes commits in a silly way.

## Deployment

Deployments are done with Terraform Cloud, which receives GCP credentials through `GOOGLE_CREDENTIALS` environment variable, which should be set to the json key of a (manually created) service account without newlines. The json key can be retrieved through the GCP console and can be transformed to a single line using `cat ~/Downloads/keyfile.json| tr -s '\n' ' '`.

When the project is deployed for the first time, some manual steps are required to bootstrap the project. After deploying `google_firebase_web_app`, go to the console and go through the "OAuth consent screen page" steps. Then, go to the credentials page and add a web application. Make sure that `https://{PROJECT_ID}.firebaseapp.com` is in "Authorized JavaScript origins" and `https://{PROJECT_ID}.firebaseapp.com/__/auth/handler` in "Authorized redirect URIs".

Pass the `oauth_client_secret` variable in Terraform Cloud.

## Notes

✅ Terraform TODO: add credentials to Terraform Cloud.
[Terraform example](https://gist.github.com/Zebreus/906b8870e49586adfe8bd7bbff43f0a8)

Testing TODO: use [Firebase emulator](https://firebase.google.com/docs/rules/unit-tests) to run unit tests

✅ Structure TODO: checkout best practice monorepo project structures

Workflow TODO: add pre-commit hooks - Protect main branch

Workflow TODO: run tests in pipeline

Deployment TODO: create Dockerfiles

Workflow TODO: build and push docker images in pipeline

Deployment TODO: deploy GKE
