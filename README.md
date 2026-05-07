# AI-Powered Internship Recommendation Engine

Production-style full-stack project for personalized internship matching using React, Tailwind CSS, Node.js, Express, MongoDB, and JavaScript-based recommendation logic.

## Folder Structure

```text
AIproject/
├── backend/
│   ├── data/
│   ├── .env.example
│   ├── README.md
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Features

- JWT-based signup/login
- Student profile management
- PDF resume upload and NLP-style parsing
- Internship dataset seeded into MongoDB
- Hybrid recommendation engine
- Skill gap analyzer
- Feedback tracking for clicks, saves, and applications
- AI-style search intent interpretation
- Recommendation explanations
- Bonus assistant endpoints for career advice, resume tips, and mock interview questions

## Database Schema

### `users`

```json
{
  "_id": "ObjectId",
  "email": "student@example.com",
  "hashed_password": "bcryptjs hash",
  "profile": {
    "full_name": "string",
    "skills": ["string"],
    "interests": ["string"],
    "experience_level": "Beginner | Intermediate | Advanced",
    "preferred_role": "AI/ML | Web Development | Data Science",
    "location_preference": "Remote | Hybrid | On-site",
    "education": ["string"],
    "projects": ["string"],
    "extracted_resume_text": "string"
  },
  "saved_internships": ["internshipId"],
  "applied_internships": ["internshipId"],
  "clicks": ["internshipId"],
  "activities": [
    {
      "internship_id": "string",
      "event_type": "click | save | apply",
      "timestamp": "ISO datetime"
    }
  ]
}
```

### `internships`

```json
{
  "_id": "ObjectId",
  "title": "string",
  "company": "string",
  "skills_required": ["string"],
  "location": "string",
  "stipend": "string",
  "description": "string",
  "role_category": "string",
  "interests": ["string"],
  "popularity": 0.94
}
```

## Recommendation Logic

The ranking layer blends:

- Content-based filtering with TF-IDF + cosine similarity
- Collaborative filtering using similar users and activity overlap
- Ranking formula:

```text
Score = (Skill Match * 0.5) + (Interest Match * 0.3) + (Popularity * 0.2)
```

The implementation also adds a small collaborative and behavior boost so tracked feedback can influence the order.

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/users/activity`
- `POST /api/resume/upload`
- `GET /api/internships`
- `GET /api/internships/trending`
- `GET /api/internships/recommendations`
- `GET /api/internships/search?q=...`
- `GET /api/assistant/career-advice`
- `GET /api/assistant/resume-tips`
- `GET /api/assistant/interview-questions`

## Run Step-by-Step

### 1. Start MongoDB

Make sure MongoDB is running locally on `mongodb://localhost:27017`.

### 2. Run the backend

```bash
cd /Users/nitishkumar/Documents/WebDev/E-Commerce/AIproject/backend
npm install
cp .env.example .env
npm run dev
```

### 3. Run the frontend

```bash
cd /Users/nitishkumar/Documents/WebDev/E-Commerce/AIproject/frontend
npm install
cp .env.example .env
npm run dev
```

### 4. Open the app

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:8000/health`

## Suggested Demo Flow

1. Sign up with skills and interests.
2. Upload a PDF resume.
3. Visit the dashboard to inspect ranked recommendations.
4. Save or apply to internships to generate feedback data.
5. Use AI search for natural-language filtering.
6. Review missing skills and assistant suggestions.
