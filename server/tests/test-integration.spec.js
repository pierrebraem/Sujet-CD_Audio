const request = require('supertest');
const app = require('../server');
const pool = require('../configs/db');

describe('Test integration back CD', () => {
    beforeAll(async () => {
        await pool.query(`CREATE TABLE IF NOT EXISTS cds (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            artist VARCHAR(255) NOT NULL,
            year INTEGER NOT NULL
        );`);
    });

    beforeEach(async () => {
        await pool.query(`INSERT INTO cds VALUES (1, 'Test CD', 'Test Artist', 2023);`);
    });
        
    afterEach(async () =>  {
        await pool.query(`DELETE FROM cds;`);
    });
    
    afterAll(async () => {
        await pool.end();
    });

    test('Récupérer tous les cds', async () => {
        const response = await request(app).get('/api/cds');
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Test CD');
    });

    test('Vérifie que les cds sont bien triés en fonction de l\'id', async () => {
        await pool.query(`INSERT INTO cds VALUES (2, 'Test CD2', 'Test Artist2', 2024);`);
        await pool.query(`INSERT INTO cds VALUES (3, 'Test CD3', 'Test Artist3', 2025);`);

        const response = await request(app).get('/api/cds');
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
        expect(response.body[0].id).toBe(1);
        expect(response.body[1].id).toBe(2);
        expect(response.body[2].id).toBe(3);
    });

    test('Ajouter un cd', async () => {
        const response = await request(app).post('/api/cds').send({
            title: "Coucou",
            artist: "Salut",
            year: 2022
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe("Coucou");
        expect(response.body.artist).toBe("Salut");
        expect(response.body.year).toBe(2022);
    });

    test('Ajouter un cd sans le label "title"', async () => {
        const response = await request(app).post('/api/cds').send({
            artist: "Salut",
            year: 2022
        });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('null value in column "title" of relation "cds" violates not-null constraint');
    });

    test('Supprimer un cd', async () => {
        const response = await request(app).delete('/api/cds/1');

        expect(response.status).toBe(204);
    });
});