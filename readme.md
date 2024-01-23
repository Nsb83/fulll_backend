## [back/ddd/cqrs] Vehicle fleet parking management

### Project Structuration
Each instruction step is contained in a specific branch (step_one, step_two, step_three). Main is full project (eg: step_three)

### Projet setup
First of all, in main branch, enter in your terminal:
```shell
yarn install
```

For the branch step_one, you can run the tests with the following command:
```shell
git fetch
git checkout step_one
yarn test
```

For the step_two branch, in order to use the MongoDB database,
please do the following:
```shell
git checkout step_two
```

1. If you want to use the database contained in the docker-compose.yml,
   create a .env file at the root level of the project containing the following
   element (you also can adapt these elements if you have MongoDB installed locally) :
```
MONGO_DB_URL=mongodb://user:pass@localhost:27019
MONGO_DATABASE=fulll_backend
MONGO_TEST_DATABASE=fulll_test
```

2. Change the permission of the fleet file to use the CLI:
```shell
chmod +x ./fleet
```

3. Build the project:
```shell
yarn build
```

4. Start the database by entering:
```shell
docker-compose up -d
```

The CLI accepts the following commands:
```shell
./fleet                                                          #Print all the possible commands
./fleet create <userId>                                          #Create a new fleet
./fleet register-vehicle <fleetId> <vehiclePlateNumber>          #Register a vehicle to a fleet
./fleet park-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng>  #Park a vehicle
./fleet localize-vehicle <fleetId> <vehiclePlateNumber>          #Localize a vehicle in a fleet
```

5. In order to run the tests, you can:
```shell
yarn test          # runs all the tests
yarn test-critical # runs only critical tests
```
_NB: Datas won't persist in database once all the tests are completed._


#### Step 3 answers
_**For code quality, you can use some tools : which one and why (in a few words) ?**_
Usually, for code quality in Typescript, I use _ESLint_ to flag programming errors, bugs, stylistic errors, and suspicious constructs,
and _Prettier_ to automatically format my code which helps keeping consistency.


_**You can consider to setup a ci/cd process : describe the necessary actions in a few words**_
1. Choose a tool: in my previous experience, we were using Teamcity
2. Setup build automation: attach build step to specific git branches (for example, "preprod" for internal testing and "prod" for customer use)
3. Setup test Automation: run all the tests before any other steps
4. Setup deployment: create a docker image after each build, send it to docker hub in order to replace current image

### Thank you for reading
