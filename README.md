# saas-starter

A SaaS (Software-as-a-Service) starter pack to convert ideas to value real quick. I'm aware that there are a plethora of similar starters, but I wanted to build one myself, for fun and educational purposes. Also, as the creator it will be easier and faster to implement it as a base for a future project.

## Authentication

Use Firebase to authenticate users, for convenience. 

## Environment variables

VITE_FIREBASE_APIKEY  
VITE_FIREBASE_AUTHDOMAIN  
VITE_FIREBASE_PROJECTID  
VITE_FIREBASE_STORAGEBUCKET  
VITE_FIREBASE_MESSAGINGSENDERID  
VITE_FIREBASE_APPID  
VITE_FIREBASE_MEASUREMENTID  

## Test locally

You don't need to set (the above) environment variables to just explore the UI. You can set `DEVELOPMENT` to `true` to use mock data.

```
cd frontend&&yarn install
yarn dev
```

## Subscriptions

Use Stripe to handle payments. Connected Firebase to Stripe with [this plugin](https://firebase.google.com/codelabs/stripe-firebase-extensions#0). The challenge is to keep Firebase (the authentication part) and Stripe in sync.

## Deployment

To make the deployment of this project as easy, stable and reproducable as possible, it leverages [Terraform Cloud](https://app.terraform.io/). This solution is free up to 5 users. 

- Create an account if you don't have one already.
- Create a workspace. 
  - Choose the version control workflow
  - Connect to Github (recommended)
  - Choose your repository and make sure to install Terraform Cloud in your fork of this project
  - Submit and create! 🚀

Terraform will create a Firebase project, which actually is a Google Cloud Project. [Read more](https://firebase.google.com/docs/projects/learn-more) about the relationship between Firebase and Google Cloud.