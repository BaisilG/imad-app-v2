# TechPulse Blog Platform

Production-ready personal tech blogging platform built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

## Features

- Public homepage with latest published posts.
- SEO-friendly post pages: `/post/[slug]`.
- Admin dashboard (`/admin`) with authentication.
- Create/edit/delete posts.
- Rich text editor (TipTap): headings, bold/italic/underline, lists, image embed, code blocks, preview mode.
- Draft/Published status handling (drafts hidden publicly).
- Slug auto-generation from title.
- Search and pagination on homepage.
- Tag support and filtering.
- Dark mode toggle.
- Local image upload endpoint.
- Optional AI draft generation using OpenAI API.

## Project Structure

```txt
/app
/admin
/api
/components
/lib
/prisma
/styles
/public/uploads
```

## Environment Variables

Copy and edit:

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL` PostgreSQL connection string
- `JWT_SECRET` secure token signing secret
- `ADMIN_EMAIL` initial admin email for seed script
- `ADMIN_PASSWORD` initial admin password for seed script
- `NEXT_PUBLIC_APP_URL` app URL
- `OPENAI_API_KEY` optional for AI generation

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate Prisma client:

```bash
npm run prisma:generate
```

3. Run migrations:

```bash
npm run prisma:migrate -- --name init
```

4. Seed admin user:

```bash
npm run prisma:seed
```

5. Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Endpoints

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/posts` (public posts, supports `q`, `tag`, `page`, `pageSize`)
- `POST /api/posts` (admin create)
- `PATCH /api/posts/:id` (admin update)
- `DELETE /api/posts/:id` (admin delete)
- `GET /api/admin/posts` (admin list)
- `POST /api/upload` (admin image upload)
- `POST /api/ai/generate` (admin AI draft generation)

## Notes for Production

- Put uploads on S3 or Cloudinary instead of local storage.
- Serve with HTTPS and secure cookies.
- Add rate limiting and audit logging.
- Attach a CDN for images and pages.
- Consider adding refresh tokens and logout endpoint.
