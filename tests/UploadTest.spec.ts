import { test, Page, defineConfig } from '@playwright/test';
import {generateTextFile,readEnvFile} from './../utils/utils.spec';
import {loginToGoogleDrive, uploadFileToGoogleDrive} from './../UI/googledrivehome';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', 'my.env') });
// // Define the text content you want to write to the file
const textContent = `This is a sample text content that will be written to the file using Playwright.`;

test('Generate Text File and upload to Google Drive', async ({ }) => {

    // Define the file path where you want to save the text file
    const filePath = 'output/sample.txt';

    // Call the function to generate the text file
    generateTextFile(filePath, textContent).catch(console.error);

    const envFilePath = 'env/Test.env';
    const envVariables = readEnvFile(envFilePath);

    // Now you can access environment variables like normal
    console.log();
    const page: Page = await loginToGoogleDrive(envVariables['EMAIL'],envVariables['PASSWORD']);
    
    await uploadFileToGoogleDrive(page, filePath);

});