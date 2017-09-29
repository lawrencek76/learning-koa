
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');

const app = module.exports = new Koa();
const router = new Router();

app.use(bodyParser());

const monk =require('monk');

var db = monk("localhost/koa_test_users");

var users = module.exports.users = db.get("users");

router.post('/user', async (ctx, next) => {
    var userFromReq = ctx.request.body;
    if(!userFromReq.name){
        ctx.throw(400,"name required")
    }
    var user = await users.insert(userFromReq);
    ctx.body = user;
    ctx.set("location", `/user/${user._id}`);
    ctx.status = 201;
    
});

router.put('/user/:id', async (ctx, next) => {
    var userFromReq = ctx.request.body;
    if(!userFromReq.name){
        ctx.throw(400,"name required")
    }
    var user = await users.update(ctx.params.id, userFromReq);
    ctx.body = user;
    ctx.set("location", `/user/${ctx.params.id}`);
    ctx.status = 204;
    
});

router.get('/user/:id', async (ctx, next) => {
    var user = await users.findOne(ctx.params.id);
    ctx.body = user;
    ctx.status = 200;    
});

router.delete('/user/:id', async (ctx, next) => {
    var user = await users.remove(ctx.params.id);
    ctx.status = 200;    
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
console.log(`Listening on ${process.env.PORT || 3000}`);