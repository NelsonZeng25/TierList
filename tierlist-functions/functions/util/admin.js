import admin from "firebase-admin";
import config from "./config.js";

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
const { credential: _credential } = admin;

import { readFile } from 'fs/promises';

const json = JSON.parse(
  await readFile(new URL('../admin.json', import.meta.url))
);

const app = initializeApp({
    ...config,
    credential: _credential.cert(json),
});

const db = getFirestore(app);

export { app, admin, db };