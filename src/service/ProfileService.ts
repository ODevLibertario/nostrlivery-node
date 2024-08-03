import {relayService} from "./RelayService";
import {removePrefix} from "../util/utils";

export class ProfileService {

    // TODO add a cache here, to keep usernames for 15 minutes
    async getUsername(npub: string) {
        const profileEvent = await relayService.getSingleEvent({
            kinds: [0],
            authors: [removePrefix(npub)]
        })

        if(profileEvent) {
            return JSON.parse(profileEvent.content)["name"]
        } else {
           return null
        }
    }
}