const express = require("express");
const fs = require("fs");
const cors = require("cors");

const { sendApplication } = require("../bot/bot");

const app = express();

app.use(express.json());
app.use(cors());

const DB = "./database.json";

function readDB(){
return JSON.parse(fs.readFileSync(DB));
}

function writeDB(data){
fs.writeFileSync(DB, JSON.stringify(data,null,2));
}

app.post("/apply",(req,res)=>{

const db = readDB();

const userId = req.body.userId;

const existing = db.find(a => a.userId === userId && a.status === "pending");

if(existing){
return res.json({error:"Application already pending"});
}

const appData = {
userId:userId,
nation:req.body.nation,
exp:req.body.exp,
plan:req.body.plan,
status:"pending"
};

db.push(appData);
writeDB(db);

sendApplication(appData);

res.json({success:true});

});

app.listen(3000,()=>{
console.log("Server running");
});
