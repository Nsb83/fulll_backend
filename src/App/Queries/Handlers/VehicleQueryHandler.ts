import {IFleetRepository, IVehicleRepository} from "../../../Infra/Persistence/IRepository";
import {VehicleQuery} from "../Dtos/VehicleQuery";
import {Vehicle} from "../../../Domain/Entities/Vehicle";

export class VehicleQueryHandler {
    private fleetRepository: IFleetRepository
    private vehicleRepository: IVehicleRepository

    constructor(fleetRepository: IFleetRepository, vehicleRepository: IVehicleRepository) {
        this.fleetRepository = fleetRepository
        this.vehicleRepository = vehicleRepository
    }

    async query(query: VehicleQuery): Promise<Vehicle | null> {
        const fleet = await this.fleetRepository.getFleetById(query.fleetId)
        if (!fleet) return null
        if (!fleet.isVehicleRegistered(query.vehiclePlateNumber)) {
            return null
        }
        return this.vehicleRepository.getVehicle(query.vehiclePlateNumber)
    }
}
