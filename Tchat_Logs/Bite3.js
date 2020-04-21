const tmi= require("tmi.js");
const fs = require("fs");
const oauth=process.env.oauth;
function getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const datee = year + "-" + month + "-" + day ;
    return datee;
}
function getTime() {
    let date1 = new Date();
    let hours1 = date1.getHours();
    let minutes1 = date1.getMinutes();
    if (minutes1<10) {
        minutes1 = "0"+ minutes1
    }
    const date11 = hours1 + ":" + minutes1;
    return date11;
}
const config={
    options:{
        debug : false
    },
    connection:{
        reconnect : true
    },
    identity:{
        username : "Poui213",
        password : oauth
    },
    channels:["Chatdesbois"],
}
let client = new tmi.client(config);
client.connect().then(function () {
    console.log("Yes je suis en vie");
})

client.on('chat', (channel, userstate, message, self) => {
    let username = userstate["username"]
    console.log("[" + getTime() + "]" + " " + userstate.username +" : "+ message)
    let tchat = "[" + getTime() + "]" + " " + userstate.username +" : "+ message + "\n"
    fs.writeFile("./Tchat_Logs/logs/" + getDate()+ ".txt",tchat,{mode:0o755,flag:"a"},_ => {});
});
