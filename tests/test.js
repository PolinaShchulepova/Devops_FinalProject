const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});


afterAll(async () => {
  await mongoose.connection.close();
});


describe('Event Reminder API', () => {
    it('GET /events returns array', async () => {
        const res = await request(app).get('/events');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    
    it('POST /events creates a new event', async () => {
        const event = {
            title: "Meeting with psychologic",
            date: "2025-06-17",
            time: "10:00"
        };
        const res = await request(app).post('/events').send(event);
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("Meeting with psychologic");
    });

    it('POST /events returns 400 if date is missing', async () => {
    const incompleteEvent = {
        title: "Missing date test",
        time: "12:00"
    };

    const res = await request(app).post('/events').send(incompleteEvent);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing title, date or time");  
    });

    it('POST /events returns 400 if all fields are missing', async () => {
    const res = await request(app).post('/events').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing title, date or time");
    });
});