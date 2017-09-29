var app = require("./app.js");
var request = require("supertest").agent(app.listen());

describe("HTTP Test user", () => {
    var a_user = {};
    beforeEach(function () {
        a_user = {
            name: "SuperTester",
            age: 22,
            height: 5.5
        };
    });
    after(async function () {
    return await app.users.remove({name : /.*Tester.*/});
    });
    it("adds new users", function (done) {
        request
            .post("/user")
            .send(a_user)
            .expect("location", /^\/user\/[0-9a-fA-F]{24}$/)
            .expect(201)
            .end(done);
    });
    it("fails with validation error for user with no name", function (done) {
        delete a_user.name;
        request
            .post("/user")
            .send(a_user)
            .expect("name required")
            .expect(400, done);
    });
    it("get existing user by id", function (done) {
        app.users.insert(a_user).then(user => {
            var url = `/user/${user._id}`;
            request
                .get(url)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(/SuperTester/)
                .expect(/22/)
                .expect(200, done)
        });
    });
    it("update existing user by id", function (done) {
        app.users.insert(a_user).then(user => {
            var url = `/user/${user._id}`;
            request
                .put(url)
                .send({
                    name: "SuperTester More super",
                    age: 23,
                    height: 5.6
                })
                .expect("location", url)
                .expect(204, done)
        });
    });
    it("delete existing user by id", function (done) {
        app.users.insert(a_user).then(user => {
            var url = `/user/${user._id}`;
            request
                .delete(url)
                .expect(200, done)
        });
    });
});