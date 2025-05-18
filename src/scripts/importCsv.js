import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/customerModel.js';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });

const results = [];

fs.createReadStream(path.resolve('data', 'customers.csv'), { encoding: 'utf-8' })
    .pipe(csv({ separator: ';' })) // karena pakai titik koma
    .on('data', (row) => {
        try {
            const customer = {
                _id: mongoose.Types.ObjectId.isValid(row['_id']) ? new mongoose.Types.ObjectId(row['_id']) : new mongoose.Types.ObjectId(),
                number: parseInt(row['Number']),
                nameOfLocation: row['Name of Location'],
                date: row['Date'],
                loginHour: row['Login Hour'],
                name: row['Name'],
                age: parseInt(row['Age']),
                gender: row['gender'],
                email: row['Email'],
                noTelp: row['No Telp'],
                brandDevice: row['Brand Device'],
                digitalInterest: row['Digital Interest'],
                location: row['Location Type'],
            };
            results.push(customer);
        } catch (err) {
            console.error('Row parsing error:', err);
        }
    })
    .on('end', async () => {
        try {
            await Customer.insertMany(results, { ordered: false });
            console.log(`✅ Import sukses (${results.length} data)`);
        } catch (err) {
            console.error('❌ Gagal import:', err);
        } finally {
            mongoose.disconnect();
        }
    });
