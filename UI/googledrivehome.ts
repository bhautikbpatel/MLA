import { chromium, Browser, Page } from 'playwright';
import { setTimeout } from "timers/promises";
import dotenv from 'dotenv';
import path from 'path';
import {readEnvFile} from './../utils/utils.spec';

dotenv.config({ path: path.resolve(__dirname, '..', 'my.env') });
const envFilePath = 'env/Test.env';
const envVariables = readEnvFile(envFilePath);

export async function loginToGoogleDrive(username: string, password: string): Promise<Page> {
    // Launch the browser
    const browser: Browser = await chromium.launch({
        ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages']
      });

    // Create a new page
    const page: Page = await browser.newPage();

    // Decode a base64 encoded string
    password = Buffer.from(password, 'base64').toString('utf-8');
    try {
        // Navigate to Google Drive login page
        await page.goto('https://drive.google.com');

        // Click on the "Go to Google Drive" button
        await page.click(`.${'centered-started'}:has-text("Go to Drive")`);
        
        //  // Wait for a new page to open
        //  const pages = await browser.contexts()[0].pages();
        //  console.log("TOTAL TABS ---------- "+pages.length)
        //  const newPage = pages[1]; // Assuming the new page is the second page in the list
 
        //  // Switch to the new page
        //  await newPage.bringToFront();

        const newPage = await page.waitForEvent('popup');

         //  // Switch to the new page
         await newPage.bringToFront();

        // Wait for the email input field to appear
        await newPage.waitForSelector('input[type="email"]');

        // Enter the username (email)       
        await newPage.type('input[type="email"]', username);

        // Click on the "Next" button
        await newPage.click('text="Next"');

        // Wait for the password input field to appear
        await newPage.waitForSelector('input[type="password"]');

        // Enter the password
        await newPage.type('input[type="password"]', password);

        // Click on the "Next" button
        await newPage.click('text="Next"');

        // Wait for the Google Drive interface to load
        await newPage.waitForLoadState('networkidle');

        if(await newPage.isVisible('text="Confirm your recovery email"')){
                
            await newPage.click('text="Confirm your recovery email"');            
            await newPage.type('input[type="email"]', envVariables['RECOVERY_EMAIL']);
            // Click on the "Next" button
            await newPage.click('text="Next"');
            await newPage.click('text="Not now"');

        }
        // Return the page after successful login
        return newPage;
    } catch (error) {
        console.error('Error logging in to Google Drive:', error);
        // Close the browser in case of error
        await browser.close();
        throw error;
    }
}

export async function uploadFileToGoogleDrive(page: Page, filePath: string): Promise<void> {
    try {
        // Click on the "New" button
        await page.click('text="New"');

        // Click on the "File upload" option
        await page.click('text="File upload"');

        await page.isHidden('text="File upload"');

        await setTimeout(5000);
        // Wait for the file input element to be available
        const fileInput = await page.waitForSelector('input[type="file"]');

        
        // Upload the file
        await fileInput.setInputFiles(filePath);

        console.log(`File "${filePath}" uploaded successfully to Google Drive.`);
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        throw error;
    }
}