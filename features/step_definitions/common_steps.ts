import {Before, Given} from "@cucumber/cucumber";
import {CreateFleetCommand} from "../../src/App/Commands/Dtos/FleetCommands";
import {FleetQuery} from "../../src/App/Queries/Dtos/FleetQuery";
import {makeNewVehicle, Vehicle} from "../../src/Domain/Entities/Vehicle";
import {FleetCreationCommandHandler} from "../../src/App/Commands/Handlers/FleetRegisterCommandHandler";
import {FleetQueryHandler} from "../../src/App/Queries/Handlers/FleetQueryHandler";
import {InMemoryFleetRepository, InMemoryVehicleRepository} from "../../src/Infra/Persistence/Repositories/InMemoryRepository";

export let fleetUserId: string
export let vehicle: Vehicle
export let fleetCreationCommandHandler: FleetCreationCommandHandler
export let fleetId: string
export let findFleetQuery: FleetQueryHandler
export let vehicleRepository = new InMemoryVehicleRepository()
export let fleetRepository = new InMemoryFleetRepository()

Before(function() {
    fleetUserId = 'Fleet User One'
    vehicleRepository = new InMemoryVehicleRepository()
    fleetRepository = new InMemoryFleetRepository()
    fleetCreationCommandHandler = new FleetCreationCommandHandler(fleetRepository)
    findFleetQuery = new FleetQueryHandler(fleetRepository)
})

Given('my fleet', async function () {
    const createFleetCommand = new CreateFleetCommand(fleetUserId)
    await fleetCreationCommandHandler.handle(createFleetCommand)
    const fleetCreated = await findFleetQuery.query(new FleetQuery(fleetUserId))
    if (fleetCreated) fleetId = fleetCreated.getId()
});

Given('a vehicle', async function () {
    vehicle = makeNewVehicle('ABC')
});
