// pages/api/users.js
import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        const { name, email } = req.body;

        try {
            const user = await User.create({ name, email });
            return res.status(201).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'User creation failed' });
        }
    }

    if (req.method === 'GET') {
        const users = await User.find();
        return res.status(200).json(users);
    }

    return res.status(405).end();
}
