import {Vehicle} from "../../../Domain/Entities/Vehicle";
import {Fleet} from "../../../Domain/Entities/Fleet";
import {IFleetRepository, IVehicleRepository} from "../IRepository";
import {Localization} from "../../../Domain/ValueObjects/Localization";

export class InMemoryFleetRepository implements IFleetRepository {
    private fleets: Fleet[] = []

    async createFleet(fleet: Fleet): Promise<void> {
        this.fleets.push(fleet)
        return Promise.resolve()
    }

    async getFleetById(fleetId: string): Promise<Fleet | null> {
        const results = this.fleets.filter(f => {
            return f.getId() === fleetId
        })
        if (results.length > 0) {
            return Promise.resolve(results[0])
        } else {
            return Promise.resolve(null)
        }
    }

    async getFleetByUserId(userId: string): Promise<Fleet | null> {
        const results = this.fleets.filter(f => {
            return f.getUserId() === userId
        })
        if (results.length > 0) {
            return Promise.resolve(results[0])
        } else {
            return Promise.resolve(null)
        }
    }

    async registerVehicle(fleetId: string, vehiclePlateNumber: string): Promise<void> {
        const fleet = await this.getFleetById(fleetId)
        if (fleet) {
            fleet.setPlateNumber(vehiclePlateNumber)
        }
        return Promise.resolve()
    }
}

export class InMemoryVehicleRepository implements IVehicleRepository {
    private vehicles: Vehicle[] = []

    createVehicle(vehicle: Vehicle): Promise<void> {
        this.vehicles.push(vehicle)
        return Promise.resolve()
    }

    getVehicle(plateNumber: string): Promise<Vehicle | null> {
        const results = this.vehicles.filter(f => {
            return f.getPlateNumber() === plateNumber
        })
        if (results.length > 0) {
            return Promise.resolve(results[0])
        } else {
            return Promise.resolve(null)
        }
    }

    async updateLocalisation(vehiclePlateNumber: string, localization: Localization): Promise<void> {
        const vehicle = await this.getVehicle(vehiclePlateNumber)
        if (vehicle) {
            vehicle.setLocalization(localization)
        }
        return Promise.resolve()
    }
}

