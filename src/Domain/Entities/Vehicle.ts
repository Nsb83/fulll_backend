import {Localization} from "../ValueObjects/Localization";

export class Vehicle {
    private readonly plateNumber: string
    private localization?: Localization
    constructor(plateNumber: string, localization?: Localization) {
        this.plateNumber = plateNumber
        this.localization = localization
    }

    getPlateNumber(): string {
        return this.plateNumber
    }

    getLocalization(): Localization | undefined {
        return this.localization
    }

    setLocalization(localization: Localization) {
        this.localization = localization
    }

    isLocalizationAlreadyExist(localization: Localization): boolean {
        return this.localization?.lng === localization.lng && this.localization.lat === localization.lat
    }
}

export function makeNewVehicle(plateNumber: string): Vehicle {
    return new Vehicle(plateNumber)
}
