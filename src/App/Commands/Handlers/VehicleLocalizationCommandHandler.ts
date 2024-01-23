import {IFleetRepository, IVehicleRepository} from "../../../Infra/Persistence/IRepository";
import {VehicleLocalizationCommand} from "../Dtos/VehicleLocalizationCommand";
import {
    VehicleLocalizationFailure,
    VehicleLocalizationResult,
    VehicleLocalizationSuccess
} from "../Events/VehicleLocalizationResult";

export class VehicleLocalizationCommandHandler {
    private vehicleRepository: IVehicleRepository
    private fleetRepository: IFleetRepository

    constructor(vehicleRepository: IVehicleRepository, fleetRepository: IFleetRepository) {
        this.vehicleRepository = vehicleRepository
        this.fleetRepository = fleetRepository
    }

    async handle(command: VehicleLocalizationCommand): Promise<VehicleLocalizationResult> {
        const fleet = await this.fleetRepository.getFleetById(command.fleetId)
        if (!fleet) return new VehicleLocalizationFailure('Fleet cannot be found')
        if (!fleet.isVehicleRegistered(command.vehiclePlateNumber)) {
            return new VehicleLocalizationFailure('This vehicle does not exist in your fleet')
        }
        const vehicle = await this.vehicleRepository.getVehicle(command.vehiclePlateNumber)
        if (!vehicle) return new VehicleLocalizationFailure('Vehicle cannot be found')
        if (vehicle.isLocalizationAlreadyExist(command.localization)) {
            return new VehicleLocalizationFailure('This vehicle has already been parked at this localization')
        }
        await this.vehicleRepository.updateLocalisation(command.vehiclePlateNumber, command.localization)
        return new VehicleLocalizationSuccess()
    }
}
