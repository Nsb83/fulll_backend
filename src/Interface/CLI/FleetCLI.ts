import {connectToDb, disconnectFromDb} from "../../Infra/Persistence/MongoDBConnection"
import {Command} from 'commander'
import {FleetApplication} from "../../Infra/Services/FleetApplication"
import {MONGO_DATABASE, MONGO_DB_URL} from "../../Infra/Environment/EnvironmentConfig";

export class FleetCLI {
    private readonly fleetApplication: FleetApplication
    private readonly url: string = `${MONGO_DB_URL}/${MONGO_DATABASE}`

    constructor( fleetApplication: FleetApplication) {
        this.fleetApplication = fleetApplication
    }

    createFleet(program: Command) {
        program
            .command("create <userId>")
            .description("Create a new fleet")
            .action(async (userId) => {
                console.log(`Creating fleet for user ${userId}`)
                await connectToDb(this.url)
                const fleetCreatedId = await this.fleetApplication.createFleet(userId)
                if (fleetCreatedId) {
                    console.log(`Your fleetId is: ${fleetCreatedId}`)
                } else {
                    console.log('Fleet cannot be created')
                }
                await disconnectFromDb(this.url)
            })
    }

    registerVehicle(program: Command) {
        program
            .command("register-vehicle <fleetId> <vehiclePlateNumber>")
            .description("Register a vehicle to a fleet")
            .action(async (fleetId, vehiclePlateNumber) => {
                console.log(`Registering vehicle ${vehiclePlateNumber} to fleet ${fleetId}`)
                await connectToDb(this.url)
                const registering = await this.fleetApplication.registerVehicle(fleetId, vehiclePlateNumber)
                console.log(registering.message || 'Vehicle successfully registered')
                await disconnectFromDb(this.url)
            })
    }

    parkVehicle(program: Command) {
        program
            .command("park-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng>")
            .description("Park a vehicle")
            .action(async (fleetId, vehiclePlateNumber, lat, lng) => {
                console.log(`Saving vehicle ${vehiclePlateNumber} for fleet ${fleetId} at location lat: ${lat} | lng: ${lng}`)
                await connectToDb(this.url)
                const parkResult = await this.fleetApplication.parkVehicle(fleetId, vehiclePlateNumber, lat, lng)
                console.log(parkResult.message || 'Vehicle location updated')
                await disconnectFromDb(this.url)
            })
    }

    localizeVehicle(program: Command) {
        program
            .command("localize-vehicle <fleetId> <vehiclePlateNumber>")
            .description("Localize a vehicle in a fleet")
            .action(async (fleetId, vehiclePlateNumber) => {
                console.log(`Localizing vehicle ${vehiclePlateNumber} in fleet ${fleetId}`)
                await connectToDb(this.url)
                const vehicle = await this.fleetApplication.locateVehicle(fleetId!, vehiclePlateNumber!)
                if (vehicle) {
                    console.log(`Your vehicle is located at this position: lat ${vehicle.getLocalization()?.lat}, lng: ${vehicle.getLocalization()?.lng}`)
                } else {
                    console.log('Your vehicle cannot be found')
                }
                await disconnectFromDb(this.url)
            })
    }
}
