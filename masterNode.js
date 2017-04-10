const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
let i = 0;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    console.log(numCPUs);

    // Fork workers.
    for (let i = 0; i < numCPUs*10; i++) {
        let worker = cluster.fork();
        //pass action to master
        worker.on('message', function(msg) {
            console.log('you should add this to cue '+ JSON.stringify(msg));
        });
    }
} else {
    http.createServer((req, res) => {
        res.writeHead(200);
        process.send({request:'forwarded request from child process to master process'});
        res.end('you have reached a page'+(i++));
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}