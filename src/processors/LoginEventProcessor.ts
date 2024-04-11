import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor";
import {db} from "../database";
import {NostrliveryResponse} from "./model/NostrliveryResponse";

export class LoginEventProcessor implements NostrliveryEventProcessor {
    async process(npub:string, params:Object): Promise<NostrliveryResponse | null> {
        const result = await db.get('SELECT npub FROM user WHERE npub = ?', npub)

        if (result) {
            console.log('existing user')
        } else {
            const profile = validateProfile(params['profile'])
            await db.run('INSERT INTO user VALUES (?)', npub)
            await db.run(`INSERT INTO profile_${profile} (npub)
                          VALUES (?)`, npub)
        }
        return new NostrliveryResponse({"message": "success"})
    }

}

function validateProfile(profile: string | undefined) {
    if(!profile) {
        throw 'Profile is mandatory'
    }

    if(profile.toLowerCase() !in ['company']) {
        throw 'Invalid profile '+ profile
    }

    return profile
}