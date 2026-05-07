# Backend

Node.js + Express backend for authentication, resume parsing, internship search, activity tracking, and hybrid recommendations.

## Stack

- Express
- Mongoose
- JWT
- Multer
- `pdf-parse`

## Run

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and adjust values.
3. Start MongoDB locally or point `MONGODB_URL` at your cluster.
4. Run the API:
   `npm run dev`

The API will run at `http://localhost:8000`.
