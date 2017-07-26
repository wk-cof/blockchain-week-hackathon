
# Express-Boilerplate

A fast :fast_forward:, simple **Node.js/Express** + **MongoDB** + **Vue.js** web app boilerplate project. This template provides a set of best-practice setups and avoids common mistakes. Hopefully useful for hackathons... :pray: :zap: 

## Quickstart

```
$ git clone https://github.com/cktang88/express-boilerplate
$ cd express-boilerplate
$ npm i --dev
$ npm start
```
Then go visit http://localhost:8000

## Batteries included.

### Back-end
* [x] **[Express](https://github.com/expressjs/express)** - Fast, unopinionated, minimalist web framework for Node.js
* [x] [node-dev](https://github.com/fgnass/node-dev) - Automatic server reload, much more lightweight than `nodemon` b/c doesn't require 9MB `chokidar`
* [x] [CORS](https://github.com/expressjs/cors) - Cross-origin resource sharing (CORS) middleware.
* [x] [Helmet.js](https://helmetjs.github.io/) - Security with HTTP headers.
* [x] [node-fetch](https://github.com/bitinn/node-fetch) - HTTP requests using browser `window.fetch()` api, < half MB (much more lightweight than Request)
* [x] [Bunyan](https://github.com/trentm/node-bunyan) - Easy JSON logging.
* [x] **[MongoDB](https://github.com/mongodb/node-mongodb-native)**
### Front-end
* [x] **[Vue.js](https://vuejs.org/)**
* [x] [Spectre.css](https://picturepan2.github.io/spectre/index.html) - lightweight CSS-only framework that uses native HTML tags. A third the size of Bulma.css, a quarter the size of Bootstrap css.
### Extra
* [x] [SockJS](https://github.com/sockjs) - Websockets client-server communication
* [x] [Eslint](http://eslint.org/) - Javascript linting


## Dev
Code linting with [AirBnB's style guide](https://github.com/airbnb/javascript):
```
$ npm run lint
```

**TODOS:**
use Sass w/ node-sass-middleware, or similar

## License

This work is licensed under the [The MIT License](http://opensource.org/licenses/MIT)
