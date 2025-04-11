// pages/api/jobs/index.js
import connectToDatabase from '../../lib/mongoose.js';
import Job from '../../models/job.js';

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'GET') {
        try {
            const jobs = await Job.find({});
            return res.status(200).json(jobs);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch jobs' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
