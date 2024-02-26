### Backend Assignment Stechoq


## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Getting Started

1. Clone this repository to your local machine:

```shell
   git clone https://github.com/inamnurulf/backend-stec
```

2. Install project dependencies:

```shell
    pnpm install
```

3. Create a .env file by copying the provided .env.example:

```shell
    cp .env.example .env
```

4. Modify the values in the .env file to match your configuration needs.

To use nodemailer u can't use ur regular email password. Enable 2-Step Verification and generate Application password, then you can use the generated password to send emails using nodemailer. Or maybe u can read this [solution](https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer).


## Running the Development Server

To start the development server, run the following command:

```shell
    pnpm run dev
```

The server will start at http://localhost:5001 by default.