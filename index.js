const server = require("./src/app")


const PORT = 3001

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})