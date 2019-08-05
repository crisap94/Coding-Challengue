import * as express from 'express'
import * as path from 'path'

var app = express();

let port = 3000 || process.env;

app.use(express.static('public'));

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    console.info(`Requesting index File`);
    res.sendFile(path.dirname + 'public/index.html');
}); 

app.listen(port, ()=>{
    console.info(`App running on port ${port}`);
});