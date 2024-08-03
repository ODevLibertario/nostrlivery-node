export class EntityAssociation {
    entityName: string
    status: EntityAssociationStatus

    constructor(entityName: string, status: EntityAssociationStatus) {
        this.entityName = entityName;
        this.status = status
    }
}

export enum EntityAssociationStatus {
    PENDING, ACCEPTED, REJECTED, DELETED
}