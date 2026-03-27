const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Authentication Endpoints', () => {
    // In-memory MongoDB for testing
    beforeAll(async () => {
        // Use test database
        const testDB = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/dyslexia-helper-test';
        await mongoose.connect(testDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear users before each test
        await User.deleteMany({});
    });

    describe('POST /auth/signup', () => {
        it('should create a new user with valid data', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'Test123!'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user).not.toHaveProperty('password');
        });

        it('should reject signup with existing email', async () => {
            // Create a user first
            await User.create({
                name: 'Existing User',
                email: 'existing@example.com',
                password: 'Password123!'
            });

            const res = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'New User',
                    email: 'existing@example.com',
                    password: 'NewPass123!'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('already registered');
        });

        it('should reject signup with invalid email', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'invalid-email',
                    password: 'Test123!'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should reject signup with short password', async () => {
            const res = await request(app)
                .post('/auth/signup')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: '123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Test123!'
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Test123!'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('user');
            expect(res.body.data).toHaveProperty('token');
        });

        it('should reject login with wrong password', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword!'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should reject login with non-existent email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Test123!'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});
