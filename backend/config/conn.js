const mongoose = require("mongoose");
require("dotenv/config");
console.log(process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
    useNewUrlParser: true,
  })
  .then((success) => console.log("connection successfull"))
  .catch((failed) => console.log("connection failed.", failed));

// const mongoose = require("mongoose");

// module.exports = async function connection() {
//     try {
//         const connectionParams = {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false,
//         };
//         await mongoose.connect(process.env.MONGODB_URI, connectionParams);
//         console.log("connected to database");
//     } catch (error) {
//         console.log(error);
//         console.log("could not connect to database");
//     }
// };
