import createApp from "./src/app.js"

const startServer = ()=>{
    const server = createApp();

    server.listen(()=>{
        console.log("Server running on http://localhost:3000");
    });
}

startServer();