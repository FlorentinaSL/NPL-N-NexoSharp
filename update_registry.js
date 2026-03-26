const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'nexoweb', 'public', 'registry.json');
let registry = {};
if (fs.existsSync(registryPath)) {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
}

const libsDir = path.join(__dirname, 'NexoLogic', 'Libs', 'nexocore');
const files = fs.readdirSync(libsDir).filter(f => f.endsWith('.nexo'));

for (const file of files) {
    const lib = file.replace('.nexo', '');
    const code = fs.readFileSync(path.join(libsDir, file), 'utf-8');
    
    registry[`nexocore.${lib}`] = {
        name: `nexocore.${lib}`,
        version: "1.0.0",
        author: "Nexo Core Security",
        code: code,
        timestamp: new Date().toISOString()
    };
}

fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf-8');
console.log('Automated Registry payload constructed successfully with ' + files.length + ' modular protocols.');
