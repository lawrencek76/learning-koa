
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-better-body');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

const monk =require('monk');

var db = monk("localhost/koa_test_users");

var users = db.get("users");

//app.use((ctx) => console.log(ctx.url));
router.post('/user', async (ctx, next) => {
    console.log("saveUser");
    var userFromReq = ctx.request.fields;
    var user = await users.insert(userFromReq);
    ctx.body = user;
    ctx.set("Location", `/user/${user._id}`);
    ctx.status = 201;
    
});

router.get('/user/:id', async (ctx, next) => {
    console.log("getuser");
    var user = await users.findOne(ctx.params.id);
    ctx.body = user;
    ctx.status = 200;
    
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
console.log(`Listening on ${process.env.PORT || 3000}`);