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
        return (await this.getEvents(filter))[0]
    }

    async getEvents(filter: Filter): Promise<NostrEvent[]> {
        const events = await this.collectEventsFromRelay(filter)

        const sortedEvents =  events.sort((a: NostrEvent, b: NostrEvent) => b.created_at - a.created_at)

        const latestItemsMap = new Map<string, NostrEvent>()

        for (const sortedEvent of sortedEvents) {
            const key = `${sortedEvent.tags}-${sortedEvent.kind}-${sortedEvent.npub}`
            if (!latestItemsMap.has(key)) {
                latestItemsMap.set(key, sortedEvent)
            }
        }

        return Array.from(latestItemsMap.values())
    }

    private async collectEventsFromRelay(filter: Filter) {
        const events = []
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

        subscription.close()
        if(events.length == 0) {
            return undefined
        } else {
            return events
        }
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

export const relayService = new RelayService();