# Upsales Task Backend

This repository contains the backend for the Upsales Task. It is built using Node.js, TypeScript, and Prisma ORM.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [Docker](https://www.docker.com/)
-   [Docker Compose](https://docs.docker.com/compose/)

## Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/khaleed2002/upsales_task_backend.git
    cd upsales_task_backend/
    ```

2. **Install dependencies:**

    ```bash
    yarn install
    ```

3. **Create environment file:**

    ```bash
    cp .env.example .env
    ```

4. **Start the database:**

    ```bash
    yarn db:start
    ```

5. **Wait for database to be ready (important!):**

    ```bash
    sleep 15
    ```

6. **Run database migrations:**

    ```bash
    yarn migrate:dev
    ```

7. **Seed the database:**

    ```bash
    yarn seed
    ```

8. **Start the development server:**
    ```bash
    yarn dev
    ```

## Quick Setup (Alternative)

Run everything at once:

```bash
yarn install
cp .env.example .env (and configure env)
yarn setup
yarn dev
```
