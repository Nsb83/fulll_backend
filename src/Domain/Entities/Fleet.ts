import { v4 as uuid } from 'uuid'

export class Fleet {
    private readonly id: string
    private readonly userId: string
    private readonly vehiclePlateNumber: string[] = []
    constructor(id: string, userId: string, plateNumber?: string[]) {
        this.id = id
        this.userId = userId
        this.vehiclePlateNumber = plateNumber || []
    }

    getId(): string {
        return this.id
    }

    getUserId(): string {
        return this.userId
    }

    getPlateNumber(): string[] {
        return this.vehiclePlateNumber
    }

    setPlateNumber(vehiclePlateNumber: string): void {
        this.vehiclePlateNumber.push(vehiclePlateNumber)
    }

    isVehicleRegistered(plateNumber: string): boolean {
        return this.vehiclePlateNumber.includes(plateNumber)
    }
}

export function makeNewFleet(userId: string): Fleet {
    return new Fleet(uuid().toString(), userId)
}
