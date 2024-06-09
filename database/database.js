// const mongoose= require("mongoose")
// // External files
// // function (connection)
// // MAke a unique function name 
// // Export 
// const connectDatabase= () =>{
//     mongoose.connect(process.env.MONGODB_CLOUD).then(()=>{
//     console.log("Database Connected")
//     })
// }
// // Exporting the Function
// module.exports = connectDatabase

const mongoose = require('mongoose')

// External File
// Functions (connection)
// Make a unique function name
// Export

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_LOCAL).then(() => {
        console.log("Database connected!")
    })
}

//Exporting the function

module.exports = connectDatabase 