# 🎓 Kampus Scheduler API

REST API untuk sistem penjadwalan mata kuliah yang diampuh dosen dan mahasiswa, dibangun dengan NestJS, Prisma ORM, dan PostgreSQL.

## 📋 Features

- ✅ Manajemen data Dosen
- ✅ Manajemen data Mahasiswa
- ✅ Manajemen data Mata Kuliah
- ✅ Manajemen Jadwal Perkuliahan
- ✅ Manajemen KRS (Kartu Rencana Studi)
- ✅ Validasi input data
- ✅ Pagination & filtering
- ✅ Error handling
- ✅ API documentation dengan Swagger
- ✅ Database relationships & constraints

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 6.x
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.18.0
- PostgreSQL >= 13
- npm >= 10.8.0

### Installation

1. Clone repository

```bash
git clone https://github.com/noerkholis-me/kampus-scheduler-api
cd kampus-scheduler-api
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env
# Edit .env dengan database credentials Anda
```

4. Setup database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

5. Run application

```bash
# Development mode
npm run dev

## 📚 API Documentation

Setelah aplikasi berjalan, akses Swagger UI:

```

http://localhost:3000/api/docs

```

### Base URL

```

http://localhost:3000/api/v1

````

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kampus_scheduler"
PORT=3000
NODE_ENV=development
````

## 📈 Future Improvements

- [ ] Authentication & Authorization (JWT)
- [ ] Role-based access control
- [ ] Attendance tracking
- [ ] Grade calculation
- [ ] Export data to PDF/Excel
- [ ] Email notifications
- [ ] Real-time updates with WebSocket

## 👨‍💻 Author

**Nurkholis Majid**

- GitHub: [@noerkholis-me](https://github.com/noerkholis-me/)
