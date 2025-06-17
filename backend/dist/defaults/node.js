"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePrompt = void 0;
exports.basePrompt = '<BuildifyArtifact id=\"project-import\" title=\"Project Files\"><BuildifyAction type=\"file\" filePath=\"index.js\">// run `node index.js` in the terminal\n\nconsole.log(`Hello Node.js v${process.versions.node}!`);\n</BuildifyAction><BuildifyAction type=\"file\" filePath=\"package.json\">{\n  \"name\": \"node-starter\",\n  \"private\": true,\n  \"scripts\": {\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  }\n}\n</BuildifyAction></BuildifyArtifact>';
