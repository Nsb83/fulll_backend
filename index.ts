import {FleetApplication} from "./src/Infra/Services/FleetApplication"
import {program} from 'commander'
import {FleetCLI} from "./src/Interface/CLI/FleetCLI"
import {MongoDBFleetRepository, MongoDBVehicleRepository} from "./src/Infra/Persistence/Repositories/MongoDBRepository"

const fleetApplication = new FleetApplication(new MongoDBFleetRepository(), new MongoDBVehicleRepository())
const fleetCLI = new FleetCLI(fleetApplication)

fleetCLI.createFleet(program)
fleetCLI.registerVehicle(program)
fleetCLI.parkVehicle(program)
fleetCLI.localizeVehicle(program)
program.parse(process.argv)
