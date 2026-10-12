# 🎵 Mara Academy - Online Music Classes (Frontend)

React frontend for an online music learning platform. Students watch free demo classes, register, buy a 4 or 6 month plan, pay the fee (demo payment) and watch lessons. An admin panel manages courses, lessons, demo videos, students and enrollments.

> This is a learning / portfolio project. Course names, fees and videos are sample data.

**Backend repo:** https://github.com/MSowbarnika/mara-academy-backend

## Features
- Home page: banner, Student Login, Contact Info popup, "how to pay" video, course tiles, free demo buttons
- Free Keyboard and Flute demo classes (no login needed)
- Course page: 4 month and 6 month plans with India and Other Country fees, course procedures and syllabus
- Demo payment popup (UPI / Card / Net Banking) and plan validity with renewal
- Student Dashboard: "Your Class Packages", valid until date, progress and "Continue Learning"
- Progress is saved in the database, so it is the same on any phone or laptop
- Lesson player for YouTube videos with next / previous lesson
- Admin panel (open `/admin/login`): courses with fees, procedures, syllabus and photo, lessons, bulk lesson video links, demo videos, students, enrollments
- WhatsApp / email contact

## Tech Stack
React (Vite), React Router, plain CSS, Fetch API

## Run Locally
1. Start the backend (runs on `http://localhost:8080`).
2. Copy `.env.example` to `.env` and write your own details.
3. Then:

```bash
npm install
npm run dev
```
4. Open `http://localhost:5173`

## Settings (.env)
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend URL |
| `VITE_BRAND_NAME` | Academy name shown on the site |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number with country code, example `919876543210` |
| `VITE_CONTACT_EMAIL` | Contact email |
| `VITE_PAY_VIDEO_URL` | YouTube link of the "how to pay the fee" video (optional) |

## Pictures
The course photos and the banner are not part of this repository. Put your own pictures in the `public` folder with these names:
`keyboard1.jpeg`, `keyboard2.jpeg`, `flute.jpeg`, `banner.webp`.
If a picture is missing, an icon or the default banner is shown.

## Author
**Sowbarnika M** - Java Full Stack Developer (fresher)
