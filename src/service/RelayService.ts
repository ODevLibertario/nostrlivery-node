import {Relay} from "nostr-tools";
import {Filter} from "nostr-tools/lib/types/filter";
import {sleep} from "../util/utils";
import {NostrEvent} from "../model/NostrEvent";

export class RelayService {
    public relayList: Relay[]
    timeoutMs = 5000

    constructor() {
        if(!process.env['RELAY_URL_LIST']) {
            throw new Error(`RELAY_URL_LIST not defined`)
        }
        this.relayList = []

        const relayURLList = process.env['RELAY_URL_LIST'].split(',').map(url => {
            return url.trim();
        })

        console.log(relayURLList);
        relayURLList.forEach(relayURL => {
            if(relayURL) {
                this.relayList.push(new Relay(relayURL));
            }
        })
    }

    async getSingleEvent (filter: Filter): Promise<NostrEvent> {
        let eventToReturn: NostrEvent = undefined
        Promise.all(
            this.relayList.map(async relay => {
                await relay.connect()
                relay.subscribe(
                    [
                        filter
                    ],
                    {
                        onevent(event) {
                            eventToReturn = event
                            this.relay.close()
                        },
                    },
                )
            })
        )

        //TODO use a less hacky approach for waiting for a response
        let waitTime = 0
        while (!eventToReturn) {
            waitTime += 10
            await sleep(10)
            if(waitTime >= this.timeoutMs) {
                throw "Timed out waiting from relay response"
            }
        }

        return eventToReturn

    }

}