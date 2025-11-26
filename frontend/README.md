# Sweat Token App
Source code for the SporosDAO Progressive Web App.


## Getting Started
1. Install dependencies: `yarn install`
2. Create a local dotenv file: `cp .env.example .env.local`
3. Start the app using: `yarn start`
4. Visit http://localhost:3000 to view the app in the browser

__NOTE__: If you see `Invalid Host header` in the browser, that likely means you skipped creating a `.env.local` file from the provided example in the frontend top directory.
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

__NOTE__: If you are running frontend as part of the project monorepo, it is recommended to use `docker-compose` to run each sub-project for better isolation. More details available in the [top level README](../README.md)

### `yarn test:dev`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test`

Launches the test runner in the non-interactive mode with a coverage report. Suitable for CI flows.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
