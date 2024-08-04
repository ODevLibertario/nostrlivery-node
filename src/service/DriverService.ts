
import {EntityAssociation, EntityAssociationStatus} from "../model/EntityAssociation"
import {NostrEventKinds} from "../model/NostrEventKinds"
import {hasTag, removePrefix} from "../util/utils"
import {ProfileService} from "./ProfileService"
import {relayService} from "../app"

export class DriverService {

    private profileService = new ProfileService()

    public async getCompanyAssociations(driverNpub: string): Promise<EntityAssociation[]> {
        const events = await relayService.getEvents({
            kinds: [NostrEventKinds.EPHEMERAL, NostrEventKinds.REPLACEABLE],
            authors: [removePrefix(driverNpub)],
            '#type': ['DRIVER_ASSOCIATION_REQUEST', 'DRIVER_ASSOCIATION_REJECTION', 'DRIVER_ASSOCIATION'],
            '#driverNpub': [driverNpub]
        })

        const associations: EntityAssociation[] = []

        for (const event of events) {
            const isDriverAssociationRequest = hasTag(event.tags, 'type', 'DRIVER_ASSOCIATION_REQUEST')

            if (isDriverAssociationRequest &&
                events.find(e => hasTag(e.tags, 'type', 'DRIVER_ASSOCIATION_REJECTION') &&
                    e.created_at > event.created_at) == undefined) {
                const companyName = await this.profileService.getUsername(event.pubkey)
                associations.push(new EntityAssociation(companyName, event.pubkey, EntityAssociationStatus.PENDING))
            }

            const isDriverAssociation = event.tags.filter(tag => tag[0] === 'type' && tag[1] == 'DRIVER_ASSOCIATION')[0][1] != undefined

            if (isDriverAssociation && JSON.parse(event.content)['removed'] != true) {
                const companyName = await this.profileService.getUsername(event.pubkey)
                associations.push(new EntityAssociation(companyName, event.pubkey, EntityAssociationStatus.ACCEPTED))
            }
        }

        return associations

    }

}