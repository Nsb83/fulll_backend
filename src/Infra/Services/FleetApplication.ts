import {CreateFleetCommand} from "../../App/Commands/Dtos/FleetCommands"
import {FleetCreationCommandHandler} from "../../App/Commands/Handlers/FleetRegisterCommandHandler"
import {FleetQueryHandler} from "../../App/Queries/Handlers/FleetQueryHandler"
import {FleetQuery} from "../../App/Queries/Dtos/FleetQuery"
import {IFleetRepository, IVehicleRepository} from "../Persistence/IRepository"
import {RegisterVehicleCommand} from "../../App/Commands/Dtos/VehicleCommands"
import {VehicleRegisterCommandHandler} from "../../App/Commands/Handlers/VehicleRegisterCommandHandler"
import {VehicleRegisterResult} from "../../App/Commands/Events/VehicleRegisterResult"
import {VehicleLocalizationCommand} from "../../App/Commands/Dtos/VehicleLocalizationCommand"
import {Localization} from "../../Domain/ValueObjects/Localization"
import {VehicleLocalizationCommandHandler} from "../../App/Commands/Handlers/VehicleLocalizationCommandHandler"
import {VehicleLocalizationResult} from "../../App/Commands/Events/VehicleLocalizationResult"
import {Vehicle} from "../../Domain/Entities/Vehicle"
import {VehicleQuery} from "../../App/Queries/Dtos/VehicleQuery"
import {VehicleQueryHandler} from "../../App/Queries/Handlers/VehicleQueryHandler"

export class FleetApplication {
    private readonly fleetRepository: IFleetRepository
    private readonly vehicleRepository: IVehicleRepository

    constructor(fleetRepository: IFleetRepository, vehicleRepository: IVehicleRepository) {
        this.fleetRepository = fleetRepository
        this.vehicleRepository = vehicleRepository
    }

    async createFleet(userId: string): Promise<string | undefined> {
        const createFleetCommand = new CreateFleetCommand(userId)
        const fleetCreationHandler = new FleetCreationCommandHandler(this.fleetRepository)
        await fleetCreationHandler.handle(createFleetCommand)
        const findFleetQuery = new FleetQueryHandler(this.fleetRepository)
        const fleetCreated = await findFleetQuery.query(new FleetQuery(userId))
        return fleetCreated?.getId()
    }

    async registerVehicle(fleetId: string, vehiclePlateNumber: string): Promise<VehicleRegisterResult> {
        const registerCommand = new RegisterVehicleCommand(fleetId, vehiclePlateNumber)
        const vehicleRegisterCommandHandler = new VehicleRegisterCommandHandler(this.vehicleRepository, this.fleetRepository)
        return await vehicleRegisterCommandHandler.handle(registerCommand)
    }

    async parkVehicle(fleetId: string, vehiclePlateNumber: string, lat: string, lng: string): Promise<VehicleLocalizationResult> {
        const localization = new Localization(Number(lng), Number(lat))
        const vehicleLocalizationCommandHandler = new VehicleLocalizationCommandHandler(this.vehicleRepository, this.fleetRepository)
        const vehicleLocalizationCommand = new VehicleLocalizationCommand(fleetId, vehiclePlateNumber, localization)
        return vehicleLocalizationCommandHandler.handle(vehicleLocalizationCommand)
    }

    async locateVehicle(fleetId: string, vehiclePlateNumber: string): Promise<Vehicle | null> {
        const vehicleQuery = new VehicleQuery(fleetId, vehiclePlateNumber)
        const vehicleQueryHandler = new VehicleQueryHandler(this.fleetRepository, this.vehicleRepository)
        return vehicleQueryHandler.query(vehicleQuery)
    }
}
