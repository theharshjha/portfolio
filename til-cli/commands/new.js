import inquirer from 'inquirer';
import { add } from './../utils/index.js';


export const command = 'new';

export const describe = 'Create a new #TIL entry interactively';

export const builder = (yargs) => {
    return yargs
        .option('no-editor', {
            alias: 'n',
            type: 'boolean',
            default: false,
            description: 'Whether to open an external editor or not',
        });
};

export const handler = async (argv) => {
    let til = '';
    let isConfirmed = false;
    let tags = [];

    do {
        const promptType = argv.noEditor ? "input" : "editor";
        const answers = await inquirer.prompt([
            {
                type: promptType,
                name: 'text',
                message: '✍️ What did you learn today?',
                default: til
            }
        ]);
        til = answers.text;

        if (!til.trim()) {
            console.log('⚠️ Entry cannot be empty. Please write something!');
            til = ''
            continue;
        }

        const confirmation = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isCorrect',
                message: `You've Entered\n\n${til}\n\nIs this correct?`,
                default: true
            }
        ]);
        isConfirmed = confirmation.isCorrect;

        if (!isConfirmed) {
            console.log('\n🔄 No problem, let\'s try that again.\n');
        }
    } while (!isConfirmed);

    isConfirmed = false;
    let tagInput = '';

    do {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'tags',
                message: '🏷️ Enter tags for this TIL (comma-separated):',
                default: tagInput
            }
        ]);

        tagInput = answer.tags;

        tags = tagInput.split(',')
            .map(tag => tag.trim())
            .filter(Boolean);

        const confirmation = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'isCorrect',
                message: `You've entered the tags: [${tags.join(', ')}]\nIs this correct?`,
                default: true
            }
        ]);
        isConfirmed = confirmation.isCorrect;
        if (!isConfirmed) {
            console.log('\n🔄 No problem, let\'s try that again.');
        }
    } while (!isConfirmed);

    console.log('\n✨ All done! Your TIL has been saved. Keep learning!');
    console.log('--------------------------------------------------');
    await add(til, tags);
    console.log(`📖 Entry:\n${til}`);
    console.log(`🏷️ Tags: [${tags.join(', ')}]`);
    console.log('--------------------------------------------------');
};