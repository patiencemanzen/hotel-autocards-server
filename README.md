# Schema Sentry

Schema Sentry is a robust backend service built with Node.js, TypeScript, and MongoDB. It provides a secure and efficient way to manage your schemas.

## Table of Contents

- [Schema Sentry](#schema-sentry)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installing](#installing)
  - [Running the tests](#running-the-tests)
  - [Built With](#built-with)
  - [Authors](#authors)
  - [Maintainers](#maintainers)
  - [License](#license)
  - [Contributing](#contributing)
  - [Acknowledgments](#acknowledgments)

## Features

- **Secure Authentication**: Schema Sentry uses bcrypt for hashing passwords and jsonwebtoken for managing session tokens.
- **File Upload**: Supports file upload with multer and multer-s3.
- **Email and SMS**: Integrated with AfricasTalking for sending emails and SMS.
- **Google OAuth**: Supports Google OAuth with passport and passport-google-oauth20.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- MongoDB

### Installing

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/schema-sentry.git
    ```
2. Install dependencies:
    ```bash
    cd schema-sentry
    npm install
    ```
3. Build the project:
    ```bash
    npm run build
    ```
4. Start the server:
    ```bash
    npm run start
    ```

## Running the tests

Run the tests using the following command:

```bash
npm run test 
```

## Built With

- [Node.js](https://nodejs.org) - JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript
- [MongoDB](https://www.mongodb.com/) - NoSQL database

## Authors

- Schema Sentry

## Maintainers

- [Manirabona Patience](mailto:hseal419@gmail.com)

## License

This project is licensed under the ISC License.

## Contributing

We welcome contributions from the community. Please read our [contributing guide](CONTRIBUTING.md) for more information.

## Acknowledgments

- Thanks to all contributors who have helped to improve this project.
