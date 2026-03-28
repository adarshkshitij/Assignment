const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const fs = require('fs');

const authFile = path.resolve('./routes/authRoutes.js');
const taskFile = path.resolve('./routes/taskRoutes.js');

console.error('Auth file:', authFile);
console.error('Auth exists:', fs.existsSync(authFile));
console.error('Task file:', taskFile);
console.error('Task exists:', fs.existsSync(taskFile));

const opts = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Test', version: '1.0.0' }
  },
  apis: [authFile, taskFile]
};

const specs = swaggerJsDoc(opts);
fs.writeFileSync('swagger-debug.json', JSON.stringify(specs, null, 2), 'utf-8');
console.error('Paths found:', Object.keys(specs.paths || {}));
console.error('Written to swagger-debug.json');
