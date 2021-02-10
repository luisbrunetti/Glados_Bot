
const arrays = require("./arrays_comentarios");
const {prefix,token} = require("./config.json");
console.log(arrays.array_deku[0]);

const discord = require("discord.js");
const client = new discord.Client();
const ytd1 = require("ytdl-core");
const { array_graos } = require("./arrays_comentarios");
//Canciones
const queue = new Map();
//const serverQueue= queue.get(message.guild.id);

var array_deku= ["Que asco encima pierdes arriba y me estan haciendo el sit en mid y mis suports rascandose la pinga",
"Putamare graos no se como haces para siempre siempre cagarme los dotas",
"Puta ni una runa me ganan estas cagadas su suport si lo tienen mimadito csm",
"Que lechero ese hijodeperra siempre le tocan las runas ptm ni una runa me a tocado"];

async function execute_song(msg, serverQueue){
    
    const args= msg.content.split(" ");
    console.log(args);
    const voice_channel = msg.member.voice.channel;
    if(!voice_channel){
        return msg.channel.send("Tienes que estar en un chat de voz para escuchar el audio ctmre ");
    }
    const permissions = voice_channel.permissionsFor(msg.client.user);
    if(!permissions.has("CONNECT") || !permissions.has("SPEAK")){
        return msg.channel.send(" Necsitas permisos wachi ctmre");
    }

    const songInfo = await ytd1.getInfo(args[2]);
    console.log("song info: "+ songInfo);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };


    console.log("serverqueue"+ serverQueue);

    var queueContruct = null;

    if (!serverQueue) {
        queueContruct = {
            textChannel: msg.channel,
            voiceChannel: voice_channel,
            connection: null,
            songs: [],
            volume: 20,
            playing: true
        };
    }else {
     serverQueue.songs.push(song);
     console.log(serverQueue.songs);
     return msg.channel.send(`${song.title} has been added to the queue!`);
    }
    queue.set(msg.guild.id, queueContruct);
    queueContruct.songs.push(song);///////////////

    try{
        var connection = await voice_channel.join();
        queueContruct.connection = connection;
        //Llamando al a funcion PLAY
        play(msg.guild,queueContruct.songs[0]);
    }catch(err){
        console.log(err);
        queue.delete(msg.guild.id);
        return msg.channel.send(err)
    }
}

function play(guild,song){
    const serverQueue = queue.get(guild.id);
    //console.log("Cancion a reproducir  "+ song.);
    if(!song){
        console.log("No hay cancion");
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.play(ytd1(song.url)).on("finish", () =>{
        serverQueue.songs.shift();
        play(guild,serverQueue.songs[0]);
    }).on("error", error => console.error(error));
    
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
function stop(message,serverQueue){
    if(!message.member.voice.channel) return message.channel.send( "Tienes que estare en un canal de voz para pooder pararla");
    if(!serverQueue) return message.channel.send("No hay musica para pararla");
    serverQueue.songs=[]
    serverQueue.connection.dispatcher.end();
}
function skip(message,serverQueue){
    if(!message.member.voice.channel) return message.channel.send(" Tienes que estar en un canal de voz para parar la musica wachi ctmre");
    if(!serverQueue) return message.channel.send("No hay cancion para mterle skip");
    serverQueue.connection.dispatcher.end();
}
async function quinchu_no(message,serverQueue){
    var queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        mp3: "./musicbot/NOOOOOOOO_by_quinchu.mp3",
        volume: 100,
        playing: true
    };
    try{
        var voiceChannel = message.member.voice.channel;
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;

        const dispatcher = queueContruct.connection.play(queueContruct.mp3)
        .on("end", () => {
            voiceChannel.leave();
        }).on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(queueContruct.volume);
        message.channel.send( "NOOOOOOOOOOOOOOOOOOOOOOOOOO !! 🥵🥵🥵🥵🥵");
    }catch(err){
        console.log(err);
        return msg.channel.send(err)
    }
    
}
async function deku_perdi(message,serverQueue){
    var queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        mp3: "./musicbot/perdi_wn_by_deku.mp3",
        volume: 15,
        playing: true
    };
    try{
        var voiceChannel = message.member.voice.channel;
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;

        const dispatcher = queueContruct.connection.play(queueContruct.mp3)
        .on("end", () => {
            voiceChannel.leave();
        }).on("error", error => console.error(error));

        dispatcher.setVolumeLogarithmic(queueContruct.volume);
        message.channel.send( "Perdi WNNNN..... !! (┬┬﹏┬┬)(┬┬﹏┬┬)");
    }catch(err){
        console.log(err);
        return msg.channel.send(err)
    }
    
}
client.on("ready", () => {
    console.log("Estoy ready > Glados" + + client.user.tag);
});

client.on("message", (message) => {
    // Definiendo el server queue
    console.log(message.guild.id);
    const serverQueue = queue.get(message.guild.id);
    //Iniciando comando PLAY 
    if(message.content.startsWith(prefix+" play")){
        message.channel.send('Hola soy Glados');
        execute_song(message,serverQueue);
    } else if(message.content.startsWith(prefix+" skip")){
        skip(message, serverQueue);
    } else if(message.content.startsWith(prefix+ " stop")){
        stop(message,serverQueue);
        return
    }else if(message.content.startsWith(prefix+ " quinchu_no")){
        quinchu_no(message,serverQueue);
    }else if(message.content.startsWith(prefix+ " deku_perdi")){
        deku_perdi(message,serverQueue);
    }else{
        //message.channel.send("Ingresa un comando valido wachi ctmre")
    }



    if(message.content === "yolo"){
        message.reply(arrays.array_yolo[random_number(arrays.array_yolo)]);
    }
    if(message.content === "shards"){
        message.reply(arrays.array_shards[random_number(arrays.array_shards)]);
    }
    if(message.content === "deku"){
        message.reply(arrays.array_deku[random_number(arrays.array_deku)]);
    }
    if(message.content === "graos"){
        message.reply(arrays.array_graos[random_number(arrays.array_graos)]);

    }if(message.content === "comandos"){
        message.reply("=====================Comandos=====================\n => Musica  ::   !g play <Link de YouTube> \n => Skipear ::   !g skip\n => Stop    ::   !g stop \n => Quinchu NO ! ::   !g quinchu_no \n => Deku Perdi  ::   !g deku_perdi \n => Nicks de los miembros \n ==================================================");
        
    }if(message.content === "xDD"){
    
    }

    if(message.content === "glados"){
        message.channel.send("Hola, le damos la bienvenida al centro computarizado de Aperture Science");
    }
    //Validación si el mensaje es del propio bot
    if(message.author.bot) return;
    
});


client.once('disconnect', () => {
    console.log('Disconnect!');
   });

client.login("ODA4NzExMzE1MTQ5MTYwNTE4.YCKhGg.PHqRxm0Xd7gQ6NpTNOHxFBzxCZY");


function random_number(array){
    var rand = Math.round((Math.random()*(array.length - 0) + 0));
    return rand;
}