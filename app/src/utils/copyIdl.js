const fs = require("fs");
const idl = require("../../../target/idl/gif_portal.json");

fs.writeFileSync("./app/src/idl.json", JSON.stringify(idl));