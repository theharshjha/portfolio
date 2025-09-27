import { buildHTML } from "../utils/index.js";

export const command = 'build';

export const describe = 'Build til.html file';

export const handler = async (argv) => {
    await buildHTML();    
}