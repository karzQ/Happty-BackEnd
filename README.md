
# Instructions

---

## Summary

* #### Install & init

* #### Database connection

* #### API Routes

* #### VS Code extensions

---

## Install & Init

__TO READ THIS BEFORE__ : You'll need to use NodeJS version `14.15.0`

Go to the `src` folder.
Use the following command : `npm install` or `yarn install`.

## Database connection

Create a `.env` file.
Add the values, stored on Discord server.

## API Routes

#### User

* /login (**POST**)
* /users (**GET**, **POST**)
* /users/:userId (**GET**, **PUT**, **DELETE**)

#### Party

* /parties (**GET**, **POST**)
* /parties/:partiesId (**GET**, **PUT**, **DELETE**)

#### Notification

* /notifications/:userId (**GET**, **POST**)
* /notifications/users/:userId/:notificationsId (**GET**, **PUT**, **DELETE**)

## VS Code extensions

* Code Spell Checker
* Auto Rename Tag
* Auto Close Tag
* ESLint
* sort-imports
