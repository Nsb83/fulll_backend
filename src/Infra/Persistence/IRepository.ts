import {Vehicle} from "../../Domain/Entities/Vehicle";
import {Fleet} from "../../Domain/Entities/Fleet";
import {Localization} from "../../Domain/ValueObjects/Localization";

export interface IFleetRepository {
    createFleet(fleet: Fleet): Promise<void>
    getFleetById(fleetId: string): Promise<Fleet | null>
    getFleetByUserId(userId: string): Promise<Fleet | null>
    registerVehicle(fleetId: string, vehiclePlateNumber: string): Promise<void>
}

export interface IVehicleRepository {
    createVehicle(vehicle: Vehicle): Promise<void>
    getVehicle(plateNumber: string): Promise<Vehicle | null>
    updateLocalisation(vehiclePlateNumber: string, localization: Localization): Promise<void>
}
