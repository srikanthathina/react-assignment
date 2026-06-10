# AI-Powered ATS Resume Screening Backend

Production-style backend project for recruiters to screen resumes against job descriptions. It parses PDF/DOCX resumes, extracts skills, calculates ATS match scores, ranks candidates, and exposes recruiter dashboard APIs.

## Why This Project Is Resume Strong

This project combines backend engineering, AI-style text processing, authentication, database modeling, file upload, API documentation, testing, and deployment readiness. It matches a fresher profile with MERN, AI/ML, MongoDB, SQL, Python, OpenAI API, and automation experience.

## Tech Stack

- Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication
- Multer file upload
- PDF/DOCX resume parsing
- ATS scoring engine
- Swagger API documentation
- Jest tests
- Docker-ready structure

## Features

- Candidate, recruiter, and admin registration/login
- JWT-protected APIs
- Recruiter-only job creation
- Resume upload as PDF or DOCX
- Resume text extraction
- Skill and experience extraction
- Resume vs job matching score out of 100
- Missing skills and keyword gap detection
- Candidate ranking by job
- Recruiter analytics dashboard
- Search, filter, pagination
- Centralized validation and error handling
- Rate limiting and security headers

## Project Structure

```txt
src/
  app.js
  server.js
  config/
  controllers/
  docs/
  middleware/
  models/
  routes/
  services/
  utils/
  validators/
tests/
```

## Setup

```bash
cd ats-resume-screening-backend
npm install
copy .env.example .env
npm run dev
```

API runs at:

```txt
http://localhost:5000
```

Swagger docs:

```txt
http://localhost:5000/api/docs
```

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ats_resume_screening
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE_MB=5
```

## Important API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | API health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |
| POST | `/api/jobs` | Create job as recruiter/admin |
| GET | `/api/jobs` | List jobs |
| POST | `/api/resumes` | Upload resume PDF/DOCX |
| GET | `/api/resumes` | List my resumes |
| POST | `/api/screenings` | Score resume against job |
| GET | `/api/screenings` | List screening results |
| GET | `/api/dashboard/recruiter` | Recruiter dashboard analytics |

## Sample Register Request

```json
{
  "name": "Srikanth Athini",
  "email": "srikanth@example.com",
  "password": "password123",
  "role": "recruiter"
}
```

## Sample Job Request

```json
{
  "title": "Backend Developer Intern",
  "company": "TechCorp",
  "location": "Hyderabad",
  "description": "Looking for a backend developer with Node.js, Express, MongoDB, JWT, REST API, and testing knowledge.",
  "requiredSkills": ["node", "express", "mongodb", "jwt", "rest api"],
  "minExperience": 0
}
```

## Resume Bullet Points

- Built a production-style ATS resume screening backend using Node.js, Express.js, MongoDB, and JWT authentication.
- Implemented PDF/DOCX resume upload, text extraction, skill detection, and ATS match scoring.
- Designed database models for users, jobs, resumes, and screening history with recruiter analytics APIs.
- Added validation, centralized error handling, rate limiting, Swagger documentation, and backend tests.

## Run Tests

```bash
npm test
```

## Deployment

Deploy on Render, Railway, or Fly.io. Add environment variables from `.env.example` and connect a MongoDB Atlas database.
