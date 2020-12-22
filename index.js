const express = require('express')
const app = express()
const port = 5000
const { User } = require("./models/User")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require("./config/key")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log("MongoDB Connected.."))
  .catch(error => console.log(error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    });
})

app.post("/login", (req, res) => {
  const user = new User(req.body);

  User.findOne({ email: user.email }, (err, userInfo) => {
    if(!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  })

  user.comparePassword(user.password, (err, isMatch) => {
    if(!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
    } 
    user.generateToken((err, user) => {
      console.log(user)

      if(err) {
       return res.status(400).send(err);
      }


      return res.cookie("x_auth", user.token)
      .status(200)
      .json({loginSuccess: true, userId: user._id})
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})