# NodeJS JWT API Authentication 

A JSON Web Token Authentication API using NodeJS and Express with support for User Register and Login.

## What are Web Tokens?
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

Find out more here: https://jwt.io/introduction

## Installation
Clone the repository and install npm ```npm install```. Use ```npm start``` to start to run ```index.js``` file. 

## Database
Mongoose library is used as the primary database for above API. Make sure you are connected to the database before testing the API. Connection string can be defined
in ```.env``` file as DB_CONNECTION.

```sh
DB_CONNECTION = <connectionstring>
```

## Token
Standard JWT token is used encrypt/sign the tokens for authentication. A random complex string can be used as a secret token. The secret token can be defined in 
```.env``` as TOKEN_SECRET.

```sh
TOKEN_SECRET = <randomsecrettoken>
```

## POST ```/api/user/```
### ```/register```
Requires necessary information such as ```username```, ```email``` and ```password```. Validation is done using ```@hapi/joi```. Multiple registration with same
email is prohibited. Password is hashed with ```bcryptjs```. Hashed password is stored in database. 

```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);
```

Saves user in database once all validations are performed. Displays the error if there is any.

### ```/login```
Requires ```email``` and ```password```. ```@hapi/joi``` perfomrs validations first and then it is compared to the hashed password. Signs the token with TOKEN_SECRET on successful login. This token can be further used to authorize necessary actions.

```javascript
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
res.header('auth-token', token).send(token);
```

## GET ```/api/secret```
A sample secret page only accessible if the logged in user has access token. This GET method first verifies the token through a middleware and then based on the
response grants/denies access to the page.

```javascript
router.get('/', verify, (req, res) => {
    res.send(req.user);
});
```

```javascript
module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied!');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err){
        res.status(400).send('Invalid token!');
    }
}
```

## Necessary dependencies
Make sure the following dependencies are installed. These can be found in ```package.json```.
* @hapi/joi (Validation)
* bcryptjs (Password Hashing)
* dotenv (Environment Variables)
* express
* jsonwebtoken (Handling JWT)
* mongoose (Database Connection)




