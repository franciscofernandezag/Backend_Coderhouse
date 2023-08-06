import cluster from 'cluster'
import {cpus} from 'os'
import express from 'express'

const numeroProcesadores = cpus().length;
console.log(numeroProcesadores);


    if(cluster.isPrimary){
        for(let i=0 ; i<numeroProcesadores ; i++){
            cluster.fork();
        }
    }

else{
    console.log("fui un proceso forkeado entonces soy un worker ")
    console.log(`El proceso del worker tiene el siguiente id ${process.pid}`)
}

if(cluster.isPrimary){
    console.log("Inicio el proceso primario, generando proceso trabajador")
    for(let i=0; i<numeroProcesadores ;i++){
      cluster.fork();
    }
  }else{
    console.log(" Fui un proceso forkeado  entonces soy un worker")
    console.log(`El proceso del worker tiene el siguiente id ${process.pid}`)
  
     const app = express();
     app.get('/',(req,res)=>{
      res.send({status:"success", message:"Peticion atentendida por un worker"})
     })
  
     app.listen(8081,()=>console.log("Server Arriba"))

     
  app.get('/operacionSencilla',(req,res)=>{
    let sum=0;
    for(let i=0; i<100000;i++){
      sum+=i;
    }
    res.send({status:"success", message:`La peticon fue atendida por ${process.pid} el resultado fue: ${sum}`})
  })
  
  app.get('/operacionCompleja',(req,res)=>{
    let sum=0;
    for(let i=0; i<5e8;i++){
      sum+=i;
    }
    res.send({status:"success", message:`La peticon fue atendida por ${process.pid} el resultado fue: ${sum}`})
  })
  }

//   Comandos ejecucion artillery

//   artillery quick --count 40  --num 50 "http://localhost:8082/operacionSencilla" -o jsonSencilla.json
// artillery quick --count 40  --num 50 "http://localhost:8082/operacionCompleja" -o jsonCompleja.json