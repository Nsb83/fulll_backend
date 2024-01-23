import {IFleetRepository, IVehicleRepository} from "../../../Infra/Persistence/IRepository";
import {RegisterVehicleCommand} from "../Dtos/VehicleCommands";
import {makeNewVehicle} from "../../../Domain/Entities/Vehicle";
import {VehicleRegisterFailure, VehicleRegisterResult, VehicleRegisterSuccess} from "../Events/VehicleRegisterResult";

export class VehicleRegisterCommandHandler {
    private vehicleRepository: IVehicleRepository
    private fleetRepository: IFleetRepository

    constructor(vehicleRepository: IVehicleRepository, fleetRepository: IFleetRepository) {
        this.vehicleRepository = vehicleRepository
        this.fleetRepository = fleetRepository
    }

    async handle(command: RegisterVehicleCommand): Promise<VehicleRegisterResult> {
        const fleet = await this.fleetRepository.getFleetById(command.fleetId)
        if (!fleet) return new VehicleRegisterFailure(command.fleetId, command.vehiclePlateNumber, 'Fleet cannot be found')
        if (fleet.isVehicleRegistered(command.vehiclePlateNumber)) {
            return new VehicleRegisterFailure(command.fleetId, command.vehiclePlateNumber, 'This vehicle has already been registered in this fleet')
        }
        const vehicle = await this.vehicleRepository.getVehicle(command.vehiclePlateNumber)
        if (!vehicle) {
            await this.vehicleRepository.createVehicle(makeNewVehicle(command.vehiclePlateNumber))
        }
        await this.fleetRepository.registerVehicle(command.fleetId, command.vehiclePlateNumber)
        return new VehicleRegisterSuccess(command.fleetId, command.vehiclePlateNumber)
    }
}
