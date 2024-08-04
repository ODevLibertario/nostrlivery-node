export class EntityAssociation {
    entityName: string
    entityNpub: string
    status: EntityAssociationStatus

    constructor(entityName: string, entityNpub: string, status: EntityAssociationStatus) {
        this.entityName = entityName
        this.entityNpub = entityNpub
        this.status = status
    }
}

export enum EntityAssociationStatus {
    PENDING, ACCEPTED, REJECTED, DELETED
}