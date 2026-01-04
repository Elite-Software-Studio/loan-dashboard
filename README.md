# Loan Admin - Backend API & Admin Dashboard

A comprehensive backend API and admin dashboard for the Loan Management System, built with React Router, Prisma, and PostgreSQL.

## 🌟 Features

- 🚀 RESTful API endpoints
- 🔐 JWT-based authentication with bcrypt password hashing
- 📊 Admin dashboard for loan management
- 💰 Loan processing and payment management
- 📈 Transaction and budget tracking
- 📄 Document management
- 🗄️ PostgreSQL database with Prisma ORM
- 🐳 Docker support
- ☸️ Kubernetes deployment ready
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (via Docker or local installation)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/loan_db"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   ```

3. **Start PostgreSQL database**
   ```bash
   npm run db:start
   ```
   Or use your own PostgreSQL instance and update `DATABASE_URL`.

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

The API endpoints are available at `http://localhost:5173/api/*`

## 📚 API Endpoints

### Authentication
- `POST /api/auth` - Sign in / Sign up
- `GET /api/auth?userId={id}` - Get user by ID
- `GET /api/auth` (with Bearer token) - Get current user

### Loans
- `GET /api/loans` - Get loans (with filters)
- `POST /api/loans` - Create loan application
- `PUT /api/loans` - Update loan
- `DELETE /api/loans` - Delete loan

### Payments
- `GET /api/payments` - Get payments
- `POST /api/payments` - Create payment

### Transactions
- `GET /api/transactions` - Get transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions` - Update transaction
- `DELETE /api/transactions` - Delete transaction

### Budgets
- `GET /api/budgets` - Get budgets
- `POST /api/budgets` - Create/update budget
- `DELETE /api/budgets` - Delete budget

### Documents
- `GET /api/documents` - Get documents
- `POST /api/documents` - Upload document

See individual route files in `app/api/` for complete documentation.

## 🔐 Authentication

The API uses JWT tokens with bcrypt password hashing:

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration (configurable via `JWT_EXPIRES_IN`)
- **Secret Key**: Configurable via `JWT_SECRET` environment variable
- **Token Format**: Bearer token in Authorization header

### Example Request

```bash
curl -X POST http://localhost:5173/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signin",
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM.

### Database Management

**View database schema:**
```bash
npm run prisma:studio
```

**Create migration:**
```bash
npm run prisma:migrate
```

**Reset database:**
```bash
npm run prisma:reset
```

**Seed database:**
```bash
npm run prisma:seed
```

## 🏗️ Building for Production

Create a production build:

```bash
npm run build
```

## 🚢 Deployment

### Docker Deployment

See `DOCKER_DEPLOYMENT.md` for detailed Docker setup.

**Quick start:**
```bash
docker-compose up -d
```

### Kubernetes Deployment

See `K8S_DEPLOYMENT.md` for Kubernetes deployment instructions.

**Quick start with K3D (local):**
```bash
npm run k3d:setup
npm run k3d:build-load
npm run k3d:deploy
```

### Platform Deployment

The containerized application can be deployed to:

- AWS ECS / EKS
- Google Cloud Run / GKE
- Azure Container Apps / AKS
- Digital Ocean App Platform
- Fly.io
- Railway
- Heroku

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-production-secret-key"
JWT_EXPIRES_IN="7d"
NODE_ENV="production"
PORT=3000
```

## 📖 Additional Documentation

- `SETUP.md` - Detailed setup instructions
- `DOCKER_DEPLOYMENT.md` - Docker deployment guide
- `K8S_DEPLOYMENT.md` - Kubernetes deployment guide
- `K3D_QUICKSTART.md` - Local Kubernetes testing
- `BRANCH_MANAGEMENT.md` - Branch management system
- `NPM_SCRIPTS.md` - Available npm scripts

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## 📦 Project Structure

```
loan_admin/
├── app/
│   ├── api/              # API route handlers
│   ├── components/       # React components
│   ├── lib/              # Utilities (JWT, Prisma, etc.)
│   └── routes/           # Page routes
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── k8s/                  # Kubernetes manifests
├── scripts/              # Utility scripts
└── docker-compose.yml    # Docker setup
```

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- CORS headers configured
- Environment variable for secrets
- SQL injection protection via Prisma

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React Router, Prisma, and PostgreSQL.
