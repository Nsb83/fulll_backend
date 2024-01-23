import {Before, Given, Then, When} from "@cucumber/cucumber";
import * as assert from "assert";
import {VehicleRegisterCommandHandler} from "../../src/App/Commands/Handlers/VehicleRegisterCommandHandler";
import {RegisterVehicleCommand} from "../../src/App/Commands/Dtos/VehicleCommands";
import {CreateFleetCommand} from "../../src/App/Commands/Dtos/FleetCommands";
import {FleetQueryHandler} from "../../src/App/Queries/Handlers/FleetQueryHandler";
import {FleetQuery} from "../../src/App/Queries/Dtos/FleetQuery";
import {
    VehicleRegisterFailure,
    VehicleRegisterResult
} from "../../src/App/Commands/Events/VehicleRegisterResult";
import {
    fleetCreationCommandHandler,
    fleetId,
    fleetRepository,
    fleetUserId,
    vehicle,
    vehicleRepository
} from "./common_steps";

let anotherFleetUserId: string
let anotherFleetId: string
let vehicleRegisterResult: VehicleRegisterResult
let vehicleRegisterCommandHandler: VehicleRegisterCommandHandler
let findFleetQuery: FleetQueryHandler

Before(function() {
    anotherFleetUserId = 'Fleet User Two'
    vehicleRegisterCommandHandler = new VehicleRegisterCommandHandler(vehicleRepository, fleetRepository)
    findFleetQuery = new FleetQueryHandler(fleetRepository)
})

When('I register this vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    await vehicleRegisterCommandHandler.handle(registerCommand)
});

Then('this vehicle should be part of my vehicle fleet', async function () {
    const fleet = await findFleetQuery.query(new FleetQuery(fleetUserId))
    assert.equal(fleet?.getPlateNumber().includes(vehicle.getPlateNumber()), true);
});

Given('I have registered this vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    await vehicleRegisterCommandHandler.handle(registerCommand)
});

When('I try to register this vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    vehicleRegisterResult = await vehicleRegisterCommandHandler.handle(registerCommand)
});

Then('I should be informed this this vehicle has already been registered into my fleet', async function () {
    assert.equal(vehicleRegisterResult instanceof VehicleRegisterFailure, true);
    assert.equal(vehicleRegisterResult.message, 'This vehicle has already been registered in this fleet');
});

Given('the fleet of another user', async function () {
    const createAnotherFleetCommand = new CreateFleetCommand(anotherFleetUserId)
    await fleetCreationCommandHandler.handle(createAnotherFleetCommand)
    const anotherFleetCreated = await findFleetQuery.query(new FleetQuery(fleetUserId))
    if (anotherFleetCreated) anotherFleetId = anotherFleetCreated.getId()
});

Given('this vehicle has been registered into the other user\'s fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(anotherFleetId, 'ABC')
    await vehicleRegisterCommandHandler.handle(registerCommand)
});

When('I register this other vehicle into my fleet', async function () {
    const registerCommand = new RegisterVehicleCommand(fleetId, 'ABC')
    await vehicleRegisterCommandHandler.handle(registerCommand)
});

Then('this other vehicle should be part of my vehicle fleet', async function () {
    const fleet = await findFleetQuery.query(new FleetQuery(fleetUserId))
    assert.equal(fleet?.getPlateNumber().includes(vehicle.getPlateNumber()), true);
});
