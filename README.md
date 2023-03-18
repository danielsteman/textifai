# saas-starter

A SaaS (Software-as-a-Service) starter pack to convert ideas to value real quick. I'm aware that there are a plethora of similar starters, but I wanted to build one myself, for fun and educational purposes. 

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