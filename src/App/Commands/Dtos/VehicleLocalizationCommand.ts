import {Localization} from "../../../Domain/ValueObjects/Localization";

export class VehicleLocalizationCommand {
    constructor(public fleetId: string, public vehiclePlateNumber: string, public localization: Localization) {}
}
