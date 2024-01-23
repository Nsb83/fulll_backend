db = db.getSiblingDB('fulll_backend')
db.createUser(
	{
		user: "user",
		pwd: "pass",
		roles: [
			{
				role: "readWrite",
				db: "fulll_backend"
			},
		]
	}
)
db.createCollection("fleets")

db = db.getSiblingDB('fulll_test')
db.createUser(
	{
		user: "user",
		pwd: "pass",
		roles: [
			{
				role: "readWrite",
				db: "fulll_test"
			}
		]
	}
)
db.createCollection("fleets")
