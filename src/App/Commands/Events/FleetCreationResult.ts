export interface FleetCreationResult {}

export class FleetCreationSuccess implements FleetCreationResult {
    readonly userId: string

    constructor(userId: string) {
        this.userId = userId
    }
}

export class FleetCreationFailure implements FleetCreationResult {
    readonly userId: string
    message: string

    constructor(userId: string, message: string) {
        this.userId = userId
        this.message = message
    }
}
