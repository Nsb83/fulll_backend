export interface VehicleRegisterResult {
    fleetId: string
    vehiclePlateNumber: string
    message?: string
}

export class VehicleRegisterSuccess implements VehicleRegisterResult {
    fleetId: string
    vehiclePlateNumber: string

    constructor(fleetId: string, vehiclePlateNumber: string) {
        this.fleetId = fleetId
        this.vehiclePlateNumber = vehiclePlateNumber
    }
}

export class VehicleRegisterFailure implements VehicleRegisterResult {
    fleetId: string
    vehiclePlateNumber: string
    message?: string

    constructor(fleetId: string, vehiclePlateNumber: string, message: string) {
        this.fleetId = fleetId
        this.vehiclePlateNumber = vehiclePlateNumber
        this.message = message
    }
}
