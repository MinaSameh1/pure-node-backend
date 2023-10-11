# Pure Node backend

This is a Pure Node.js Backend, that was done using only native libraries and Two dependencies, One of them is dotenv, which can be replaced easily. And the other is PG for connecting to postgresql.
It also includes two tests that was done in pure node and include mocks and E2E

It is a Library Management System.

## Running the project
You can simply run the docker compose file.

#### Manually:

1. Install deps 
<details><summary>yarn</summary>

    ```
    yarn
    ```
</details>
Or
<details><summary>npm</summary>

    ```
    npm install
    ```
</details>

2. Copy .env file and modify to suite your needs. (Connection string for database)
```bash
cp .env.example .env
# Choose your editor, nano vim vscode etc.
vi .env
```

3. Use the `db/init.sql` File to create the database.

4. Run it!
```bash
npm start
```

## Documentation

Postman file included with query params and endpoints under `./docs` folder.

### Resources
- CRUD operations on `book` with details such as details like title, author, ISBN, available quantity, and shelf location.
- Register borrowers, CRUD as well. Filters using Query

#### Actions
- Borrower can checkout a book, if the book is already checkout out by the person then it can't be checkout again. Decreases Quantity automatically
- Borrower can return a book. Restores Quantity automatically.
- Can Check books gotten by borrower.
- Separate Transaction logs.
- Can export CSV.
- Can see Last Month Items.

