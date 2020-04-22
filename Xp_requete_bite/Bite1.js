const tmi=require("tmi.js");
const axios=require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const requete=require("request");
var Client = require('ftp');
var c = new Client();

const configftp = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password
}
c.connect(configftp);

var liveon=false;
const oauth=process.env.oauth;
function getTime() {
    let date1 = new Date();
    let hours1 = date1.getHours();
    let minutes1 = date1.getMinutes();
    const date11 = hours1 + ":" + minutes1;
    return date11;
}
console.log(getTime()+" "+"Et on tourne les serviettes")
live()

const config={
    options:{
        debug:false
    },
    connection:{
        reconnect:true
    },
    identity:{
        username:"Poui213",
        password:oauth
    },
    channels:["Chatdesbois"],
}

function live() {
    var options={
        url:"https://api.twitch.tv/helix/streams?user_login=Chatdesbois",
        method:"GET",
        headers:{"Authorization": "Bearer "+oauth.split(':')[1]},
    }
    requete(options,function(error,response,body){
        if (response && response.statusCode == 200) {
            let data=JSON.parse(body)
            if (data.data.length != 0) {
                console.log(getTime() + " " + "LOL ELLE EST EN LIVE MDR");
                if (!liveon) {
                    liveon=true // Recupérer l'xp
                    getData()
                }
                
            } else {
                console.log(getTime() + " " + "T'AS LOUPE LE STREAM RETROUVE MOI SUR LES INTERNETS \nT'es naze")
                if (liveon) {
                    liveon=false
                    getData()
                    // clearTimeout(liveinterval)
                }
            }
        }
    })  

}

function getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const datee = year + "-" + month + "-" + day + "-" + hours + "-" + minutes;
    return datee;
}
async function getData() {
    const result = await axios.get("https://chatdesbois.herokuapp.com/mensuel/1")
    const searchData = cheerio.load(result.data)
    var textevidepourlinstant = "";
    searchData('.mikuia-card.mikuia-card-ranking').each(function(i, element){
        var a = searchData(this);
        textevidepourlinstant = textevidepourlinstant + "---------------------------------\n" + a.children(".mikuia-card-block.mikuia-card-ranking-block").next().children().children().next().children('h4').children().text() + "\n" + a.children(".mikuia-card-block.mikuia-card-ranking-block").next().next().children('h3').text() + "\n"
    });
   console.log(getTime() + " " + "test") 
   c.put(textevidepourlinstant, "/Xp_requete_bite/logs/" + getDate()+ ".txt", (error) => {
       if (error) throw error
   })
    // fs.writeFileSync("./Xp_requete_bite/logs/" + getDate()+ ".txt",textevidepourlinstant);
  
  };


var liveinterval=setInterval(()=>{
    live()

}, 1*60*1000 )
