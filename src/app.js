var express = require("express");
var path = require("path");
 
var app = express();
var user = require('./user')
var post = require('./post')
var session = require('express-session')

app.listen(7777,function(){
  console.log("Started listening on port", 7777);
})
var bodyParser = require("body-parser");
app.use(bodyParser.json());


app.use(session({secret: 'my-secret'})); 
var sessions; 

app.use(express.static(path.join(__dirname,"/html")));

app.get('/', function(req,res){
  res.sendFile(__dirname + '/html/index.html');
})

app.get('/home', function(req, res){
  if(sessions && sessions.username){
    res.sendFile(__dirname + '/html/home.html');
  }
  else{
    res.send('unauthorized');
  }
})


app.post('/signin', function (req, res) {
  sessions = req.session; 
  var user_name=req.body.email;
  var password=req.body.password;
  user.validateSignIn(user_name, password, function(result){
    if (result){
      sessions.username = user_name; 
      res.send('success')
    }
  });
})


app.post('/signup', function (req, res) {
  var name=req.body.name;
  var email=req.body.email;
  var password=req.body.password;
 
  if(name && email && password){
      user.signup(name, email, password)
  }
  else{
    res.send('Failure');
  }
})

app.post('/addPost', function (req, res) {
  var title = req.body.title;
  var subject = req.body.subject;
  var id = req.body.id;
  console.log('app', id); 
  if(id == '' || id == undefined){
    console.log('add');
    post.addPost(title, subject ,function(result){
      res.send(result);
    }); 
  }
  else{
    console.log('update',title,subject);
    post.updatePost(id, title, subject ,function(result){
      res.send(result);
    }); 
  }
  
})

app.post('/getPost', function(req, res){
  post.getPost(function(result){
    res.send(result); 
  }); 
  
})

app.post('/getPostWithId', function(req,res){
  var id = req.body.id; 
  post.getPostWithId(id, function(result){
    res.send(result)
  })
})

app.post('/deletePost', function(req, res){
  var id = req.body.id; 
  post.deletePost(id, function(result){
    res.send(result)
  })
})


/* class App extends Component {


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App; */
