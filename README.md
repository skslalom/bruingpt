# Getting Started

Check out the [Vite Getting Started Guide](https://vite.dev/guide/) for more information.


Pre flight
```
node --version
npm --version
yarn --version
```


Install the packages after you go the frontend folder
```
yarn install
```
or
```
npm install
```


In the frontend folder, use the following commands:

```
npm run dev
```

to run the application locally on http://localhost:3000 create the .env.local file at the root.
The app will user .env.local for environment variables

```
npm run build
```

to build a production-ready build of the application. This will use .env.production for environment variables. The build will be in the **/dist** folder.

```
npm run preview
```

This will take the production-ready build and run it locally on http://localhost:4173

## Code Formatting and Linting

This project uses Prettier for code formatting and ESLint for linting. The following commands are available:

```
npm run format
```

This will format all TypeScript, TSX, CSS, and JSON files in the src directory using Prettier.

```
npm run format:check
```

This will check if all files are properly formatted without making changes.

```
npm run lint
```

This will run ESLint to check for code quality issues.

```
npm run lint:fix
```

This will run ESLint and automatically fix issues where possible.

The build process automatically runs formatting and linting before building the application, ensuring that all code in the production build follows the project's style guidelines.

All environment variables are prefixed with **VITE\_**. This is the default that Vite looks for. This can be modified in the vite.config.ts file, among many other options.

To read an environment variable in code, simply use:

```ts
import.meta.env.VITE_VARIABLE_NAME;
```

Vite will determine the env based on which command you used. However, you can run Vite in different modes. [Env Variables and Modes](https://vite.dev/guide/env-and-mode.html)