import {IFleetRepository} from "../../../Infra/Persistence/IRepository";
import {CreateFleetCommand} from "../Dtos/FleetCommands";
import {FleetCreationResult, FleetCreationSuccess} from "../Events/FleetCreationResult";
import {makeNewFleet} from "../../../Domain/Entities/Fleet";

export class FleetCreationCommandHandler {
    private fleetRepository: IFleetRepository

    constructor(fleetRepository: IFleetRepository) {
        this.fleetRepository = fleetRepository
    }

    async handle(command: CreateFleetCommand): Promise<FleetCreationResult> {
        const newFleet = makeNewFleet(command.userId)
        await this.fleetRepository.createFleet(newFleet)
        return new FleetCreationSuccess(command.userId)
    }
}
