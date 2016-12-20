
function routeGet(routeUrl, testName, expectedStatus)
{
    it(testName, function(callback) {
        $.get("http://localhost:3000" + routeUrl)
            .always((x, code, y) => {
                var status = x.status || y.status;
                callback(expectedStatus === status ? null : new Error(status));
            });
    });
}

function routePost(routeUrl, testName, expectedStatus, params)
{
    it(testName, function(callback) {
        $.post("http://localhost:3000" + routeUrl, params)
            .always((x, code, y) => {
                var status = x.status || y.status;
                callback(expectedStatus === status ? null : new Error(status));
            });
    });
}

function crypt(password, publicKey)
{
    return btoa(String.fromCharCode.apply(null, _encrypt(password, publicKey)));
}

var publicKey = $('#publicKey').val();


describe("root.js", function()
{
    describe("/", function()
    {
        routeGet("/", "Empty request", 200);
    });
});

describe("login.js", function ()
{
    describe("/login", function ()
    {
        routePost("/login", "Empty request", 401, {});
        routePost("/login", "Existing username only", 401, {username: "qwe"});
        routePost("/login", "Nonexistent username only", 401, {username: "zxc"});
        routePost("/login", "Password string only", 401, {password: "dead_beef"});
        routePost("/login", "Existing username and wrong password", 401, {username: "qwe", password: crypt("DeadBeef", publicKey)});
        routePost("/login", "Nonexistent username and password", 401, {username: "zxc", password: crypt("asd", publicKey)});
        routePost("/login", "Existing username and correct password", 200, {username: "qwe", password: crypt("asd", publicKey)});
        routePost("/login", "Existing username and empty password", 401, {username: "qwe", password: ""});
        routePost("/login", "Existing username and empty encrypted password", 401, {username: "qwe", password: crypt("", publicKey)});
    });

    describe("/logout", function ()
    {
        routePost("/logout", "Single logout", 200, {});
        routePost("/logout", "Double logout", 200, {});
    });

    describe("/signup", function ()
    {
        routePost("/signup", "Empty request", 500, {});
        routePost("/signup", "New user, no password", 500, {username: "ghj0"});
        routePost("/signup", "Existing user", 500, {username: "qwe"});
        routePost("/signup", "New user, arbitrary password", 200, {username: "ghj1", password: crypt("xcv", publicKey)});
        routePost("/signup", "Empty encrypted password", 200, {username: "ghj2", password: crypt("", publicKey)});
        routePost("/signup", "Empty password", 200, {username: "ghj3", password: ""});
    });
});

describe("article.js", function()
{
    describe("/article", function()
    {
        routeGet("/article", "Empty request", 400);
        routeGet("/article?version=584fd61f6414febe8250f450", "Existing version", 200);
        routeGet("/article?version=DeadBeef", "Invalid version", 500);
        routeGet("/article?version=584fd61f6414febe8250f451", "Nonexistent version", 404);
        routeGet("/article?article=vim", "Existing article", 200);
        routeGet("/article?article=vam", "Nonexistent article", 404);
        routeGet("/article?article=vim&version=584fd61f6414febe8250f450", "Existing article, existing version", 200);
        routeGet("/article?article=vim&version=DeadBeef", "Existing article, invalid version", 500);
        routeGet("/article?article=vim&version=584fd61f6414febe8250f451", "Existing article, nonexistent version", 404);
        routeGet("/article?article=vam&version=584fd61f6414febe8250f450", "Nonexistent article, existing version", 200);
        routeGet("/article?article=vam&version=DeadBeef", "Nonexistent article, invalid version", 500);
        routeGet("/article?article=vam&version=584fd61f6414febe8250f451", "Nonexistent article, nonexistent version", 404);
    });

    describe("/article-versions", function()
    {
        routeGet("/article-versions", "Empty request", 500);
        routeGet("/article-versions?article=DeadBeef", "Invalid article ID", 500);
        routeGet("/article-versions?article=584fd2dd6414febe8250f44e", "Nonexistent article ID", 404);
        routeGet("/article-versions?article=584fd2dd6414febe8250f44f", "Existing article ID", 200);
    });

    describe("/article-random", function()
    {
        routeGet("/article-random", "Empty request", 200);
    });
});

describe("article-edit.js", function()
{
    describe("/article-edit-section", function()
    {
        routePost("/article-edit-section", "Empty request", 404, {});
        routePost("/article-edit-section", "All but article identifier", 404, {asid: 1, newcontent: "DeadBeef"});
        routePost("/article-edit-section", "Nonexistent article", 404, {aid: "adcddcbaabcddcbaefabfeab", asid: 1, newcontent: "DeadBeef"});
        routePost("/article-edit-section", "No login", 401, {aid: "5855b3e68d325626c80959be", asid: 1, newcontent: "DeadBeef"});

        routePost("/login", "Logging in", 200, {username: "qwe", password: crypt("asd", publicKey)});

        routePost("/article-edit-section", "No ownership", 401, {aid: "5855b3e68d325626c80959be", asid: 1, newcontent: "DeadBeef"});
        routePost("/article-edit-section", "All valid", 200, {aid: "58531f13a936851da0aa4e90", asid: 0, newcontent: "DeadBeef"});

        routePost("/logout", "Logging out", 200, {});
    });

    describe("/article-clone", function()
    {
        routePost("/article-clone", "No login", 401, {aid: "5855b3e68d325626c80959be", asid: 1, newcontent: "DeadBeef"});

        routePost("/login", "Logging in", 200, {username: "qwe", password: crypt("asd", publicKey)});

        routePost("/article-clone", "Empty request", 500, {});
        routePost("/article-clone", "Nonexistent article", 500, {aid: "adcddcbaabcddcbaefabfeab", asid: 1, newcontent: "DeadBeef"});

        routePost("/article-clone", "All valid", 200, {aid: "5855b3e68d325626c80959be", asid: 1, newcontent: "DeadBeef"});
        routePost("/article-clone", "Own article", 200, {aid: "58531f13a936851da0aa4e90", asid: 0, newcontent: "DeadBeef"});

        routePost("/logout", "Logging out", 200, {});
    });

    describe("/article-create", function()
    {
        routeGet("/article-create?article=foo", "No login", 401);

        routePost("/login", "Logging in", 200, {username: "qwe", password: crypt("asd", publicKey)});

        routeGet("/article-create?", "Empty request", 400);
        routeGet("/article-create?article=vim", "Article already exists", 409);
        routeGet("/article-create?article=boo", "All valid", 200);

        routePost("/logout", "Logging out", 200, {});
    });
});