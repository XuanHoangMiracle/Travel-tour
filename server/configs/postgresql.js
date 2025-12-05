import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'travel_tour',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'TechzenAcademySQL',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
