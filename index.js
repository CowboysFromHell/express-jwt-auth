const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const passport = require("passport");

const app = express();
const port = 4000;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "USER_SECRET_KEY";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET,
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload.sub === "admin") done(null, true);
  else done(null, false);
});

passport.use(jwtAuth);

const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginUsename = (req, res, next) => {
  if (req.body.username === "admin" && req.body.password === "1234") {
    next();
  } else {
    res.send("Error: username or password is incorrect");
  }
};

let products = [
  { id: 1, 
    name: "Laptop", 
    category: "Electronics", 
    price: 1000, 
    stock: 5 
},
  { id: 2, 
    name: "Phone", 
    category: "Electronics", 
    price: 500, 
    stock: 10 },
];

app.post("/login", loginUsename, (req, res) => {
  const payload = {
    sub: req.body.username,
    iat: new Date().getTime(),
  };
  res.send(jwt.encode(payload, SECRET));
});

app.get("/products", requireJWTAuth, (req, res) => {
  res.status(200).json(products);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});