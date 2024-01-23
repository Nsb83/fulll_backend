import {getModelForClass, modelOptions, prop} from "@typegoose/typegoose"
import {Fleet} from "../../../Domain/Entities/Fleet"

@modelOptions({ schemaOptions: { collection: 'fleets', timestamps: true } })
export class FleetSchema {
    @prop({required: true})
    public _id!: string

    @prop({required: true})
    public userId!: string

    @prop({type: () => [String], default: []})
    public vehiclePlateNumber!: string[]

    constructor(id: string, userId: string, plateNumber?: string[]) {
        this._id = id
        this.userId = userId
        this.vehiclePlateNumber = plateNumber || []
    }

    toFleet(): Fleet {
        return new Fleet(this._id, this.userId, this.vehiclePlateNumber)
    }
}

export const fleetModel = getModelForClass(FleetSchema)
