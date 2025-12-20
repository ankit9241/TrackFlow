import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import HabitEntry from './models/HabitEntry.js';
import Habit from './models/Habit.js';

const migrate = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        console.log('Connecting to DB...');
        await mongoose.connect(mongoUri);
        console.log('Connected.');

        const entries = await HabitEntry.find({});
        console.log(`Found ${entries.length} entries. Processing...`);

        let modified = 0;
        let merged = 0;

        for (const entry of entries) {
            const date = new Date(entry.date);
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();

            // Check if it's an "Old Format" date (18:30 UTC = 00:00 IST previous day representation)
            if (hours === 18 && minutes === 30) {
                // Calculate Target Date: This corresponds to the NEXT DAY 00:00 UTC
                const targetDate = new Date(date);
                targetDate.setUTCDate(targetDate.getUTCDate() + 1);
                targetDate.setUTCHours(0, 0, 0, 0);

                // Check if a "New Format" entry already exists for this target date
                const existingNewEntry = await HabitEntry.findOne({
                    user: entry.user,
                    habit: entry.habit,
                    date: targetDate
                });

                if (existingNewEntry) {
                    // COLLISION: We have both. The New one (00:00) is likely the User's latest action.
                    // We should keep the New one.
                    // Merge checks: If New one is "Complete: False", and Old is "True", keep False (User unmarked it).
                    // If New one is "Complete: True" (maybe created separately?), keep True.
                    // Basically, New Entry wins for status.

                    // We might want to preserve metadata from the Old entry if the New one lacks it?
                    // Assuming New Entry is barebones (created by toggle).
                    let needsSave = false;
                    if (!existingNewEntry.notes && entry.notes) {
                        existingNewEntry.notes = entry.notes;
                        needsSave = true;
                    }
                    // (Merge other fields if necessary)

                    if (needsSave) {
                        await existingNewEntry.save();
                    }

                    // Delete the Old entry
                    console.log(`Merging duplicates for ${targetDate.toISOString().split('T')[0]}: Deleting old entry.`);
                    await HabitEntry.findByIdAndDelete(entry._id);
                    merged++;
                } else {
                    // NO COLLISION: Just update the date of this Old entry to the New format.
                    console.log(`Migrating date for ${targetDate.toISOString().split('T')[0]}: ${date.toISOString()} -> ${targetDate.toISOString()}`);
                    entry.date = targetDate;
                    await entry.save();
                    modified++;
                }
            }
        }

        console.log(`Migration Complete. Modified: ${modified}, Merged/Deleted: ${merged}`);
        process.exit(0);
    } catch (error) {
        console.error('Migration Error:', error);
        process.exit(1);
    }
};

migrate();
