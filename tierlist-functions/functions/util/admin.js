import admin from "firebase-admin";
import config from "./config.js";
import { readFile } from 'fs/promises';

const json = JSON.parse(
  await readFile(new URL('../admin.json', import.meta.url))
);

const app = admin.initializeApp({
    ...config,
    credential: admin.credential.cert(json)
});

const db = admin.firestore();

export { app, admin, db };