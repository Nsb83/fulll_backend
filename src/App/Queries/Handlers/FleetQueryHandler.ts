import {IFleetRepository} from "../../../Infra/Persistence/IRepository";
import {FleetQuery} from "../Dtos/FleetQuery";
import {Fleet} from "../../../Domain/Entities/Fleet";

export class FleetQueryHandler {
    private fleetRepository: IFleetRepository

    constructor(fleetRepository: IFleetRepository) {
        this.fleetRepository = fleetRepository
    }

    async query(query: FleetQuery): Promise<Fleet | null> {
        return this.fleetRepository.getFleetByUserId(query.userId)
    }
}
