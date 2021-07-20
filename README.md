
# Instructions

---

## Summary

* #### Install & init

* #### Database connection

* #### API Routes

* #### VS Code extensions

* #### Development norms

---

## Install & Init

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
* /users/pseudo/:pseudo (**GET**)

#### Party

* /parties (**GET**, **POST**)
* /parties/:partiesId (**GET**, **PUT**, **DELETE**)
* /users/pseudo/:pseudo (**GET**)

#### Notification

* /notifications/:userId (**GET**, **POST**)
* /notifications/users/:userId/:notificationsId (**GET**, **PUT**, **DELETE**)
* /users/pseudo/:pseudo (**GET**)

## VS Code extensions

* Code Spell Checker
* Auto Rename Tag
* Auto Close Tag
* ESLint
* sort-imports

## Development norms

* #### Naming
