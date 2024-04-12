import {NostrliveryEventProcessor} from "./model/NostrliveryEventProcessor";
import {db} from "../database";
import {NostrliveryResponse} from "./model/NostrliveryResponse";
import {RelayService} from "../service/RelayService";

export class LoginEventProcessor implements NostrliveryEventProcessor {

    private relayService = new RelayService()

    async process(npub:string, params:Object): Promise<NostrliveryResponse | null> {
        const result = await db.get('SELECT npub FROM user WHERE npub = ?', npub)

        if (result) {
            const profileEvent = await this.relayService.getSingleEvent(
                {
                    authors: [npub],
                    kinds: [0],
                }
            )

            return new NostrliveryResponse(profileEvent["content"])
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