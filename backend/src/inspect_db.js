import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

import HabitEntry from './models/HabitEntry.js';
import Habit from './models/Habit.js';

const inspectEntries = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        console.log('Connecting to DB...');
        await mongoose.connect(mongoUri);
        console.log('Connected.');

        const entries = await HabitEntry.find({}).sort({ date: -1 }).populate('habit', 'name');

        let output = '--- All Habit Entries ---\n';
        entries.forEach(e => {
            output += `Habit: ${e.habit?.name} | Date: ${e.date.toISOString()} | Completed: ${e.completed} | ID: ${e._id}\n`;
        });
        output += '-------------------------\n';

        await fs.promises.writeFile('db_dump.txt', output);
        console.log('Dumped to db_dump.txt');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

inspectEntries();
