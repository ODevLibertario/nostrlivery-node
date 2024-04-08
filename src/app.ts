import express from 'express';
import {nip19} from "nostr-tools";
import { getPublicKey } from 'nostr-tools'
import {db, openDb} from "./database";
import {createHash} from "crypto";

const app = express();
app.use(express.json());
const port = 3000;

openDb()

function validateProfile(profile: string | undefined) {
    if(!profile) {
        throw 'Profile is mandatory'
    }

    if(profile.toLowerCase() !in ['company']) {
        throw 'Invalid profile '+ profile
    }

    return profile
}

//TODO how do we stop an attack where some registers millions of fake users
app.post('/login', async (req, res) => {
    try {
        const nsec = req.body['nsec']

        const nsecHash = createHash('sha256').update(nsec).digest('base64');
        const result = await db.get('SELECT id FROM user WHERE id = ?', nsecHash)

        //Existing user
        if(result) {
            console.log('existing user')
            return res.send({"message": "success"})
        } else {
            console.log('new user')
            const decodedNsec = nip19.decode(nsec)
            let npub = nip19.npubEncode(getPublicKey(decodedNsec.data as Uint8Array))

            if (decodedNsec.type == 'nsec') {
                const profile = validateProfile(req.body['profile'])
                await db.run('INSERT INTO user VALUES (?,?)', nsecHash, npub)
                await db.run(`INSERT INTO profile_${profile} (user_id) VALUES (?)`, nsecHash)

                return res.send({"message": "success"})
            } else {
                return res.status(400).json({error: "Nsec is invalid"})
            }
        }
    } catch (e) {
        return res.status(500).json({error: e.message})
    }

});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});