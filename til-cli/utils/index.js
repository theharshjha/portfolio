
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, '..', 'data.json');


const DEFAULT_DATA = { tils: {} };

async function readData() {
    try {
        const data = await readFile(DATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await writeFile(DATA_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
            return DEFAULT_DATA;
        }
    }
}

// A simple function to escape HTML special characters
function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '</br>');
}

export async function buildHTML() {
    const data = await readData();

    // Use .map() to transform each day's data into an HTML string, then .join() them together.
    const tilsHtml = Object.entries(data.tils).map(([date, tils]) => `
        <div id="day">
            <div id="date">${date}</div>
            ${tils.map(til => `
                <div id="til">
                    <div id="data">
                        ${escapeHTML(til.til)}
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');

    const mainContent = `
        <div id="data-container">
            Anyday I Learn something new, I add it here. (kind of tweets)
            <br>
            <br>
            ${tilsHtml}
        </div>`;

    // Use robust, absolute paths for all files
    const startPath = path.join(__dirname, 'startTIL.txt');
    const endPath = path.join(__dirname, 'endTIL.txt');
    const outputPath = path.join(__dirname, '..', '..', 'til.html');
    const start = await readFile(startPath, 'utf-8');
    const end = await readFile(endPath, 'utf-8');

    await writeFile(outputPath, start + mainContent + end);
    console.log('✅ HTML file built successfully!');
}

export async function add(til, tags) {
    try {
        const data = await readData();
        const yyyymmdd = (new Date()).toISOString().slice(0, 10);
        data.tils[yyyymmdd] = data.tils[yyyymmdd] || [];

        data.tils[yyyymmdd].push({ til, tags });

        await writeFile(DATA_PATH, JSON.stringify(data, null, 2));

    } catch (err) {
        console.error('❌ Error saving TIL:', err);
    }
}