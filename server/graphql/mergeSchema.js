import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------
// Load GraphQL type definitions (SDL)
// ------------------
const typesArray = loadFilesSync(path.join(__dirname, 'schema/**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

// ------------------
// Dynamically load resolver files (ESM-safe for Windows)
// ------------------
const resolversDir = path.join(__dirname, 'resolvers');
const resolverFiles = fs
  .readdirSync(resolversDir)
  .filter((f) => f.endsWith('.js'));

const resolversArray = await Promise.all(
  resolverFiles.map(async (file) => {
    const fullPath = path.join(resolversDir, file);
    const moduleUrl = pathToFileURL(fullPath).href; // Convert to file:// URL
    const imported = await import(moduleUrl);
    return imported.default || imported; // Use default export if it exists
  })
);

const resolvers = mergeResolvers(resolversArray);

export { typeDefs, resolvers };
