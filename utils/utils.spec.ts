import * as fs from 'fs';

export async function generateTextFile(filePath: string, content: string): Promise<void> {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log(`Text file created successfully at: ${filePath}`);
    });
}



interface EnvVariables {
    [key: string]: string;
}

export function readEnvFile(filePath: string): EnvVariables {
    const envVariables: EnvVariables = {};

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n');

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, value] = trimmedLine.split('=');
                envVariables[key.trim()] = value.trim();
            }
        });
    } catch (error) {
        console.error('Error reading environment file:', error);
    }

    return envVariables;
}
