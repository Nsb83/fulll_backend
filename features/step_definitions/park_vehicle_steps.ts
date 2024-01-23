import {Before, Given, Then, When} from "@cucumber/cucumber";
import {Localization} from "../../src/Domain/ValueObjects/Localization";
import {VehicleLocalizationCommandHandler} from "../../src/App/Commands/Handlers/VehicleLocalizationCommandHandler";
import {VehicleLocalizationCommand} from "../../src/App/Commands/Dtos/VehicleLocalizationCommand";
import {
    fleetId,
    inMemoryFleetRepository,
    vehicle,
    inMemoryVehicleRepository,
    mongoDBFleetRepository, mongoDBVehicleRepository, mongoDBFleetId
} from "./common_steps";
import {VehicleQueryHandler} from "../../src/App/Queries/Handlers/VehicleQueryHandler";
import {VehicleQuery} from "../../src/App/Queries/Dtos/VehicleQuery";
import * as assert from "assert";
import {VehicleLocalizationFailure, VehicleLocalizationResult} from "../../src/App/Commands/Events/VehicleLocalizationResult";

let location: Localization
let inMemoryVehicleLocalizationCommandHandler: VehicleLocalizationCommandHandler
let mongoDBVehicleLocalizationCommandHandler: VehicleLocalizationCommandHandler
let mongoDBVehicleQueryHandler: VehicleQueryHandler
let vehicleLocalizationResult: VehicleLocalizationResult

Before(function() {
    inMemoryVehicleLocalizationCommandHandler = new VehicleLocalizationCommandHandler(inMemoryVehicleRepository, inMemoryFleetRepository)
    mongoDBVehicleLocalizationCommandHandler = new VehicleLocalizationCommandHandler(mongoDBVehicleRepository, mongoDBFleetRepository)
    mongoDBVehicleQueryHandler = new VehicleQueryHandler(mongoDBFleetRepository, mongoDBVehicleRepository)
})

Given('a location', function () {
    location = new Localization(4.808704, 45.783085)
});

When('I park my vehicle at this location', async function () {
    await mongoDBVehicleLocalizationCommandHandler.handle(new VehicleLocalizationCommand(mongoDBFleetId, vehicle.getPlateNumber(), location))
    await inMemoryVehicleLocalizationCommandHandler.handle(new VehicleLocalizationCommand(fleetId, vehicle.getPlateNumber(), location))
});

Then('the known location of my vehicle should verify this location', async function () {
    const vehicleQuery = new VehicleQuery(mongoDBFleetId, vehicle.getPlateNumber())
    const savedVehicle = await mongoDBVehicleQueryHandler.query(vehicleQuery)
    assert.equal(savedVehicle?.isLocalizationAlreadyExist(location), true)
});

Given('my vehicle has been parked into this location', async function () {
    const vehicleLocalizationCommand = new VehicleLocalizationCommand(fleetId, vehicle.getPlateNumber(), location)
    await inMemoryVehicleLocalizationCommandHandler.handle(vehicleLocalizationCommand)
});

When('I try to park my vehicle at this location', async function () {
    const vehicleLocalizationCommand = new VehicleLocalizationCommand(fleetId, vehicle.getPlateNumber(), location)
    vehicleLocalizationResult = await inMemoryVehicleLocalizationCommandHandler.handle(vehicleLocalizationCommand)
});

Then('I should be informed that my vehicle is already parked at this location', function () {
    assert.equal(vehicleLocalizationResult instanceof VehicleLocalizationFailure, true);
    assert.equal(vehicleLocalizationResult.message, 'This vehicle has already been parked at this localization');

});
