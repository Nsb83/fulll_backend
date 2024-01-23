import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose"
import {Vehicle} from "../../../Domain/Entities/Vehicle"
import {LocalizationSchema} from "./LocalizationModel"

@modelOptions({ schemaOptions: { collection: 'vehicles', timestamps: true } })
export class VehicleSchema {
    @prop({required: true})
    public plateNumber!: string

    @prop({type: () => LocalizationSchema})
    public localization?: LocalizationSchema

    constructor(plateNumber: string, localizationSchema?: LocalizationSchema) {
        this.plateNumber = plateNumber
        this.localization = localizationSchema
    }

    toVehicle(): Vehicle {
        return new Vehicle(this.plateNumber, this.localization?.toLocalization())
    }
}

export const vehicleModel = getModelForClass(VehicleSchema)
