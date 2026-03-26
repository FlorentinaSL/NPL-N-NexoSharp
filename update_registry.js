const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'nexoweb', 'public', 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));

const libs = ['fs', 'string', 'time', 'crypto', 'map'];
for (const lib of libs) {
    const libPath = path.join(__dirname, 'NexoLogic', 'Libs', 'nexocore', `${lib}.nexo`);
    const code = fs.readFileSync(libPath, 'utf-8');
    
    registry[`nexocore.${lib}`] = {
        name: `nexocore.${lib}`,
        version: "1.0.0",
        author: "Nexo Core Security",
        code: code,
        timestamp: new Date().toISOString()
    };
}

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log('Registry dynamically updated successfully.');
