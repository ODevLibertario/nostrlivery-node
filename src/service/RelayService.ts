import {Relay} from "nostr-tools"
import {Filter} from "nostr-tools/lib/types/filter"
import {sleep} from "../util/utils"
import {NostrEvent} from "../model/NostrEvent"

export class RelayService {
    public relayList: Relay[]
    timeoutMs = 2000

    constructor() {
        if (!process.env['RELAY_URL_LIST']) {
            throw new Error(`RELAY_URL_LIST not defined`)
        }
        this.relayList = []

        const relayURLList = process.env['RELAY_URL_LIST'].split(',').map(url => {
            return url.trim()
        })

        relayURLList.forEach(relayURL => {
            if (relayURL) {
                this.relayList.push(new Relay(relayURL))
            }
        })

        this.relayList[0].connect()
    }

    async getSingleEvent(filter: Filter): Promise<NostrEvent> {
        let events = []
        const subscription = this.relayList[0].subscribe(
            [filter],
            {

                onevent(event) {
                    events.push(event)
                },
            },
        )

        let waitTime = 0
        while (this.timeoutMs >= waitTime) {
            waitTime += 10
            await sleep(10)
        }

        if(events.length == 0) {
            return undefined
        }

        subscription.close()
        return events[events.length - 1]
    }

    async publish(event: NostrEvent) {
        const relay = this.relayList[0]
        try {
            return await relay.publish(event)
        } catch (e) {
            console.log(e)
        }
    }

}