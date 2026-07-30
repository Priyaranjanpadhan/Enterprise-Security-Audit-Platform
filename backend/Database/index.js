import pg, { Pool } from "pg";
import env from "dotenv";

env.config();//for working of the process.env. we need this.
// console.log(process.env.PG_PASSWORD);
//basic database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432
});
db.connect();

export default db;