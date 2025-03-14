const { addCD, deleteCD } = require('../Controllers/cdController');
const pool = require('../configs/db');

jest.mock('../configs/db');

describe('test unitaire CD', () => {
    /* pool.query.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    title: 'Test CD',
                    artist: 'Test Artist',
                    year: 2023
                },
                {
                    id: 2,
                    title: 'Test CD2',
                    artist: 'Test Artist2',
                    year: 2024
                }
            ]
        }); */

    test('Ajouter un cd', async () => {
        const req = { body: { title: 'Test Title1', artist: 'Test artist1', year: 2023 }};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        pool.query.mockResolvedValue({
            rows: [{id: 1, title: 'Test Title1', artist: 'Test artist1', year: 2023}],
        });

        await addCD(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({id: 1, title: 'Test Title1', artist: 'Test artist1', year: 2023});
    });

    test('Supprimer un cd', async () => {
        const req = { params: { id: 1 }};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        pool.query.mockResolvedValue({ rowCount: 1 });

        await deleteCD(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });
});