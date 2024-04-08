import {createHash} from 'crypto'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export let db = undefined

export async function openDb () {
    db = await open({
        filename: '/tmp/database2.db',
        driver: sqlite3.Database
    })
    await createTables()
}

async function createTables() {
   await db.exec('CREATE TABLE user (id TEXT NOT NULL, npub TEXT NOT NULL)')
   await db.exec('CREATE TABLE profile_company (user_id TEXT NOT NULL, name TEXT NULL, address TEXT NULL, latitude TEXT NULL, longitude TEXT NULL)')
}

