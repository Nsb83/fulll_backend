import {AfterAll, Before, BeforeAll, Given} from "@cucumber/cucumber";
import {CreateFleetCommand} from "../../src/App/Commands/Dtos/FleetCommands";
import {FleetQuery} from "../../src/App/Queries/Dtos/FleetQuery";
import {makeNewVehicle, Vehicle} from "../../src/Domain/Entities/Vehicle";
import {FleetCreationCommandHandler} from "../../src/App/Commands/Handlers/FleetRegisterCommandHandler";
import {FleetQueryHandler} from "../../src/App/Queries/Handlers/FleetQueryHandler";
import {InMemoryFleetRepository, InMemoryVehicleRepository} from "../../src/Infra/Persistence/Repositories/InMemoryRepository";
import {
    MongoDBFleetRepository,
    MongoDBVehicleRepository
} from "../../src/Infra/Persistence/Repositories/MongoDBRepository";
import {connectToDb, disconnectFromDb} from "../../src/Infra/Persistence/MongoDBConnection";
import {MONGO_DB_URL, MONGO_TEST_DATABASE} from "../../src/Infra/Environment/EnvironmentConfig";
import {fleetModel} from "../../src/Infra/Persistence/Schemas/FleetModel";
import {vehicleModel} from "../../src/Infra/Persistence/Schemas/VehicleModel";

export let fleetUserId: string
export let vehicle: Vehicle
export let inMemoryFleetCreationCommandHandler: FleetCreationCommandHandler
export let fleetId: string
export let mongoDBFleetId: string
export let inMemoryFindFleetQuery: FleetQueryHandler
export let inMemoryVehicleRepository = new InMemoryVehicleRepository()
export let inMemoryFleetRepository = new InMemoryFleetRepository()
export let mongoDBVehicleRepository = new MongoDBVehicleRepository()
export let mongoDBFleetRepository = new MongoDBFleetRepository()
export let mongoDBFleetCreationCommandHandler: FleetCreationCommandHandler
export let mongoDBFindFleetQuery: FleetQueryHandler
let url: string

BeforeAll(async function() {
    url = `${MONGO_DB_URL}/${MONGO_TEST_DATABASE}`
    await connectToDb(url)
    fleetUserId = 'Fleet User One'
    mongoDBVehicleRepository = new MongoDBVehicleRepository()
    mongoDBFleetRepository = new MongoDBFleetRepository()
    mongoDBFleetCreationCommandHandler = new FleetCreationCommandHandler(mongoDBFleetRepository)
    await mongoDBFleetCreationCommandHandler.handle(new CreateFleetCommand(fleetUserId))
    mongoDBFindFleetQuery = new FleetQueryHandler(mongoDBFleetRepository)
    const fleetCreated = await mongoDBFindFleetQuery.query(new FleetQuery(fleetUserId))
    if (fleetCreated) mongoDBFleetId = fleetCreated.getId()
})

AfterAll(async function() {
    await fleetModel.deleteMany({})
    await vehicleModel.deleteMany({})
    await disconnectFromDb(url)
})

Before(function() {
    inMemoryVehicleRepository = new InMemoryVehicleRepository()
    inMemoryFleetRepository = new InMemoryFleetRepository()
    inMemoryFleetCreationCommandHandler = new FleetCreationCommandHandler(inMemoryFleetRepository)
    inMemoryFindFleetQuery = new FleetQueryHandler(inMemoryFleetRepository)
})

Given('my fleet', async function () {
    const createFleetCommand = new CreateFleetCommand(fleetUserId)
    await inMemoryFleetCreationCommandHandler.handle(createFleetCommand)
    const fleetCreated = await inMemoryFindFleetQuery.query(new FleetQuery(fleetUserId))
    if (fleetCreated) fleetId = fleetCreated.getId()
});

Given('a vehicle', async function () {
    vehicle = makeNewVehicle('ABC')
});
