export interface VehicleLocalizationResult {
    message?: string
}

export class VehicleLocalizationSuccess implements VehicleLocalizationResult {}

export class VehicleLocalizationFailure implements VehicleLocalizationResult {
    message?: string

    constructor(message: string) {
        this.message = message
    }
}
