import createApp from "./src/app.js"
import env from "./config/env.js";

const startServer = ()=>{
    const server = createApp();
    server.listen(env.PORT,()=>{
        console.log(`Server running on http://localhost:${env.PORT}`);
    });
}

startServer();