import { connect, connection } from "mongoose";

// If application is running on Heroku, connect to MongoDB database via config variable
// If application is running on localHose, connect to MongoDB database via link
connect(
	process.env.MONGO,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

export default connection;