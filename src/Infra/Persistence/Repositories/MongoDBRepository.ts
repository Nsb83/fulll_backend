import {IFleetRepository, IVehicleRepository} from "../IRepository"
import {Fleet} from "../../../Domain/Entities/Fleet"
import {fleetModel, FleetSchema} from "../Schemas/FleetModel"
import {Vehicle} from "../../../Domain/Entities/Vehicle"
import {Localization} from "../../../Domain/ValueObjects/Localization"
import {vehicleModel, VehicleSchema} from "../Schemas/VehicleModel"
import {LocalizationSchema} from "../Schemas/LocalizationModel"

export class MongoDBFleetRepository implements IFleetRepository {
    async createFleet(fleet: Fleet): Promise<void> {
        const fleetToInsert = new FleetSchema(fleet.getId(), fleet.getUserId())
        await fleetModel.create(fleetToInsert)
        return
    }

    async getFleetById(fleetId: string): Promise<Fleet | null> {
        const fleetSchema = await fleetModel.findById(fleetId)
        return fleetSchema ? fleetSchema.toFleet() : null
    }

    async getFleetByUserId(userId: string): Promise<Fleet | null> {
        const fleetSchema = await fleetModel.findOne({ userId: userId})
        return fleetSchema ? fleetSchema.toFleet() : null
    }

    async registerVehicle(fleetId: string, vehiclePlateNumber: string): Promise<void> {
        const fleet = await fleetModel.findById(fleetId)
        if (fleet) {
            fleet.vehiclePlateNumber.push(vehiclePlateNumber)
            await fleetModel.updateOne({ _id: fleetId }, fleet)
        }
    }
}

export class MongoDBVehicleRepository implements IVehicleRepository {
    async createVehicle(vehicle: Vehicle): Promise<void> {
        const vehicleSchema = new VehicleSchema(vehicle.getPlateNumber())
        await vehicleModel.create(vehicleSchema)
        return
    }

    async getVehicle(plateNumber: string): Promise<Vehicle | null> {
        const vehicleSchema = await vehicleModel.findOne({ plateNumber: plateNumber })
        return vehicleSchema ? vehicleSchema.toVehicle() : null
    }

    async updateLocalisation(vehiclePlateNumber: string, localization: Localization): Promise<void> {
        const localizationSchema = new LocalizationSchema(localization)
        await vehicleModel.updateOne({ plateNumber: vehiclePlateNumber }, { localization: localizationSchema })
        return
    }

}
