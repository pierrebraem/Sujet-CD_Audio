const axios = require('axios');
const sinon = require('sinon');

describe('Test integration front CD', () => {
    let stubGet
    beforeEach(() => {
        stubGet = sinon.stub(axios, 'get');
        stubPost = sinon.stub(axios, 'post');
        stubDelete = sinon.stub(axios, 'delete');
    });

    afterEach(() => {
        stubGet.restore();
        stubPost.restore();
        stubDelete.restore();
    });

    test('Récupérer tous les cds', async () => {
        const data = [
            {
                id: 1,
                title: "Test CD",
                artist: "Test Artist",
                year: 2023
            },
            {
                id: 2,
                title: "Test CD2",
                artist: "Test Artist2",
                year: 2024
            },
        ];

        stubGet.resolves({status: 200, data});

        const response = await axios.get('http://localhost:5050/api/cds');

        expect(response.status).toBe(200);
        expect(response.data).toBe(data);
    });

    test('Ajouter un cd', async () => {
        const data = {
            id: 1,
            title: "Test CD Ajout",
            artist: "Test Artist Ajout",
            year: 204
        }

        stubPost.resolves({status: 201, data});

        const response = await axios.post('http://localhost:5050/api/cds');

        expect(response.status).toBe(201);
        expect(response.data).toBe(data);
    });

    test('Ajouter un cd sans le label "title"', async () => {
        const data = {
            id: 1,
            artist: "Test Artist Ajout",
            year: 204
        }

        stubPost.resolves({status: 500, data: 'null value in column "title" of relation "cds" violates not-null constraint'});

        const response = await axios.post('http://localhost:5050/api/cds');

        expect(response.status).toBe(500);
        expect(response.data).toBe('null value in column "title" of relation "cds" violates not-null constraint');
    });

    test('Supprimer un cd', async () => {
        stubDelete.resolves({status: 204});
        const response = await axios.delete('http://localhost:5050/api/cds/1');

        expect(response.status).toBe(204);
    });
});