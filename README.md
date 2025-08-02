# Upsales Task Backend

This repository contains the backend for the Upsales Task. It is built using Node.js, TypeScript, and Prisma ORM. Below are the instructions to set up and run the project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [Docker](https://www.docker.com/)
-   [Docker Compose](https://docs.docker.com/compose/)

## Setup Instructions

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/khaleed2002/upsales_task_backend.git
    cd upsales_task_backend/
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Create a `.env` file in the root directory and configure it. You can use the provided `.env` file as a reference:

    ```bash
    cp .env.example .env
    ```

4. Start the database using Docker Compose:

    ```bash
    yarn db:start
    ```

5. Run database migrations:

    ```bash
    npx prisma migrate dev
    ```

6. Seed the database (if applicable):

    ```bash
    yarn seed
    ```

7. Start the development server:
    ```bash
    yarn dev
    ```

### Frontend Setup

The backend is designed to work with a frontend client. Ensure the `CLIENT_URL` in the `.env` file points to the correct frontend URL. For example:

```env
CLIENT_URL=http://localhost:5173
```

## Demo Credentials and Seed Data

If authentication is implemented, you can use the following demo credentials:

-   **Email:** test@example.com
-   **Password:** password123

The seed data is located in `prisma/seed.ts` and `mock/movies-data.json`. To seed the database, run:

```bash
npx ts-node prisma/seed.ts
```
