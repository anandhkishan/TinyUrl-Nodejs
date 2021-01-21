# TinyUrl
  Implementation of tiny-Url reducing the long url to a shortURL with the 8-character hash code.

## **Tech stacks Required**:
- React
- Node.js
- Postgres
- Docker (optional)

## **Running it in local**:

Run the following on root of the repo and on `frontend/app/`:

```npm install```

**Starting backend server**

```node index.js```(on root directory)

**Starting react app**

```npm start```(on path `frontend/app/`)

After installing postgres, do the following:

- ```psql postgres```
- ```sql 
  CREATE DATABASE tiny_url;
    ```
- ```sql 
  CREATE TABLE tiny_url (url_id bigSerial,
    long_url text,
    short_url text);
    ```
  
[website link](tiny.anandhkishan.com)
