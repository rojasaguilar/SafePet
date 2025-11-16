import dotenv_conf from "./config/dotenv_conf.js";
import app from "./app.js";

const port = dotenv_conf.PORT

app.listen(port, () => console.log(`Listening on port: ${port}`));