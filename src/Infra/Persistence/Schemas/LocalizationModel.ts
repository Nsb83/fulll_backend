import {modelOptions, prop} from "@typegoose/typegoose"
import {Localization} from "../../../Domain/ValueObjects/Localization"

@modelOptions({ schemaOptions: { _id: false } })
export class LocalizationSchema {
    @prop({required: true})
    lat!: number

    @prop({required: true})
    lng!: number

    constructor(localization: Localization) {
        this.lat = localization.lat
        this.lng = localization.lng
    }

    toLocalization(): Localization {
        return new Localization(this.lng, this.lat)
    }
}
