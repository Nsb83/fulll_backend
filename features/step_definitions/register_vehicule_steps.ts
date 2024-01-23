import {Before, Given, Then, When} from "@cucumber/cucumber";
import * as assert from "assert";
import {VehicleRegisterCommandHandler} from "../../src/App/Commands/Handlers/VehicleRegisterCommandHandler";
import {RegisterVehicleCommand} from "../../src/App/Commands/Dtos/VehicleCommands";
import {CreateFleetCommand} from "../../src/App/Commands/Dtos/FleetCommands";
import {FleetQuery} from "../../src/App/Queries/Dtos/FleetQuery";
import {
    VehicleRegisterFailure,
    VehicleRegisterResult
} from "../../src/App/Commands/Events/VehicleRegisterResult";
import {
    inMemoryFleetCreationCommandHandler,
    fleetId,
    inMemoryFleetRepository,
    fleetUserId,
    vehicle,
    inMemoryVehicleRepository,
    mongoDBFleetRepository,
    mongoDBVehicleRepository,
    mongoDBFleetId,
    mongoDBFindFleetQuery,
    inMemoryFindFleetQuery
} from "./common_steps";

let anotherFleetUserId: string
let anotherFleetId: string
let vehicleRegisterResult: VehicleRegisterResult
let inMemoryVehicleRegisterCommandHandler: VehicleRegisterCommandHandler
let mongoDBVehicleRegisterCommandHandler: VehicleRegisterCommandHandler

Before(function() {
    anotherFleetUserId = 'Fleet User Two'
    inMemoryVehicleRegisterCommandHandler = new VehicleRegisterCommandHandler(inMemoryVehicleRepository, inMemoryFleetRepository)
    mongoDBVehicleRegisterCommandHandler = new VehicleRegisterCommandHandler(mongoDBVehicleRepository, mongoDBFleetRepository)
})

When('I register this vehicle into my fleet', async function () {
    await inMemoryVehicleRegisterCommandHandler.handle(new RegisterVehicleCommand(fleetId, 'ABC'))
    await mongoDBVehicleRegisterCommandHandler.handle(new RegisterVehicleCommand(mongoDBFleetId, 'ABC'))
});

Then('this vehicle should be part of my vehicle fleet', async function () {
    const fleet = await mongoDBFindFleetQuery.query(new FleetQuery(fleetUserId))
    assert.equal(fleet?.getPlateNumber().includes(vehicle.getPlateNumber()), true);
});

Given('I have registered this vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    await inMemoryVehicleRegisterCommandHandler.handle(registerCommand)
});

When('I try to register this vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    vehicleRegisterResult = await inMemoryVehicleRegisterCommandHandler.handle(registerCommand)
});

Then('I should be informed this this vehicle has already been registered into my fleet', async function () {
    assert.equal(vehicleRegisterResult instanceof VehicleRegisterFailure, true);
    assert.equal(vehicleRegisterResult.message, 'This vehicle has already been registered in this fleet');
});

Given('the fleet of another user', async function () {
    const createAnotherFleetCommand = new CreateFleetCommand(anotherFleetUserId)
    await inMemoryFleetCreationCommandHandler.handle(createAnotherFleetCommand)
    const anotherFleetCreated = await inMemoryFindFleetQuery.query(new FleetQuery(fleetUserId))
    if (anotherFleetCreated) anotherFleetId = anotherFleetCreated.getId()
});

Given('this vehicle has been registered into the other user\'s fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(anotherFleetId, 'ABC')
    await inMemoryVehicleRegisterCommandHandler.handle(registerCommand)
});

When('I register this other vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    await inMemoryVehicleRegisterCommandHandler.handle(registerCommand)
});

Then('this other vehicle should be part of my vehicle fleet', async function () {
    const fleet = await inMemoryFindFleetQuery.query(new FleetQuery(fleetUserId))
    assert.equal(fleet?.getPlateNumber().length, 1)
    assert.equal(fleet?.getPlateNumber().includes(vehicle.getPlateNumber()), true);
});
