#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
    // Get current git branch
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    console.log(`Current branch: ${branch}`);

    // Determine which config to use
    const configFile = branch === 'main' ? 'webflow.main.json' : 'webflow.test.json';
    const configPath = path.join(process.cwd(), configFile);
    const targetPath = path.join(process.cwd(), 'webflow.json');

    // Check if config file exists
    if (!fs.existsSync(configPath)) {
        console.error(`Error: ${configFile} not found!`);
        process.exit(1);
    }

    // Copy config file
    fs.copyFileSync(configPath, targetPath);
    console.log(`Copied ${configFile} to webflow.json`);

    // Read VERSION from version.ts
    const versionPath = path.join(process.cwd(), 'src', 'version.ts');
    if (!fs.existsSync(versionPath)) {
        console.error('Error: src/version.ts not found!');
        process.exit(1);
    }

    const versionContent = fs.readFileSync(versionPath, 'utf8');
    const versionMatch = versionContent.match(/export const VERSION = ['"]([^'"]+)['"]/);
    if (!versionMatch) {
        console.error('Error: Could not extract VERSION from src/version.ts');
        process.exit(1);
    }

    const version = versionMatch[1];
    console.log(`Found VERSION: ${version}`);

    // Read and modify webflow.json to append version to library name
    const webflowConfig = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    const originalName = webflowConfig.library.name;
    webflowConfig.library.name = `${originalName} v${version}`;

    // Write back the modified config
    fs.writeFileSync(targetPath, JSON.stringify(webflowConfig, null, 2));
    console.log(`Updated library name from "${originalName}" to "${webflowConfig.library.name}"`);

    // Run the original deploy command
    console.log('Running webflow library share...');
    execSync('npx webflow library share --no-input', { stdio: 'inherit' });

} catch (error) {
    console.error('Deploy failed:', error.message);
    process.exit(1);
}