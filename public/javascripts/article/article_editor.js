
function initSectionEditor(sid)
{
    var thatSection = document.getElementById(sid);
    var previewer = thatSection.getElementsByTagName("div")[1];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-edit-section");
    form.setAttribute("class", "EditorForm");

    var field = document.createElement("textarea");
    field.setAttribute("name", "newcontent");
    field.setAttribute("wrap", "soft");
    field.value = article.content[sid].text;
    field.oninput = function(){
        previewer.innerHTML = markdown.toHTML(field.value);
    };

    var commitButton = document.createElement("input");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Apply changes");

    var rollbackButton = document.createElement("input");
    rollbackButton.setAttribute("type", "button");
    rollbackButton.setAttribute("value", "Discard changes");
    rollbackButton.onclick = function () {
        location.reload();
    };

    var aid = document.createElement("input");
    aid.setAttribute("type", "hidden");
    aid.setAttribute("name", "aid");
    aid.setAttribute("value", article._id);

    var asid = document.createElement("input");
    asid.setAttribute("type", "hidden");
    asid.setAttribute("name", "asid");
    asid.setAttribute("value", sid);



    form.appendChild(field);
    form.appendChild(commitButton);
    form.appendChild(rollbackButton);
    form.appendChild(aid);
    form.appendChild(asid);

    previewer.parentNode.insertBefore(form, previewer);


    removePanels();
}

function initSectionRenamer(sid)
{
    var thatSection = document.getElementById(sid);
    var previewer = thatSection.getElementsByTagName("h1")[0];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-rename-section");
    form.setAttribute("class", "EditorForm");

    var field = document.createElement("input");
    field.setAttribute("name", "newname");
    field.value = article.content[sid].name;
    field.oninput = function(){
        previewer.innerHTML = field.value;
    };

    var commitButton = document.createElement("input");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Apply changes");

    var rollbackButton = document.createElement("input");
    rollbackButton.setAttribute("type", "button");
    rollbackButton.setAttribute("value", "Discard changes");
    rollbackButton.onclick = function () {
        location.reload();
    };

    var aid = document.createElement("input");
    aid.setAttribute("type", "hidden");
    aid.setAttribute("name", "aid");
    aid.setAttribute("value", article._id);

    var asid = document.createElement("input");
    asid.setAttribute("type", "hidden");
    asid.setAttribute("name", "asid");
    asid.setAttribute("value", sid);



    form.appendChild(field);
    form.appendChild(commitButton);
    form.appendChild(rollbackButton);
    form.appendChild(aid);
    form.appendChild(asid);

    previewer.parentNode.insertBefore(form, previewer);


    removePanels();
}

function initSectionDeleter(sid)
{
    var r = confirm("Delete section \"" + article.content[sid].name + "\"?");

    if (r == true)
    {
        var params = {
            aid: article._id,
            asid: sid
        };

        post("/article-delete-section", params);
    }
}

function initSectionInserter(sid)
{
    var params = {
        aid: article._id,
        asid: sid
    };

    post("/article-insert-section", params);
}

function initBriefEditor()
{
    var previewer = document
        .getElementById("articleBriefBox")
        .getElementsByTagName("div")[1];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-edit-brief");
    form.setAttribute("class", "EditorForm");

    var field = document.createElement("textarea");
    field.setAttribute("name", "newcontent");
    field.setAttribute("wrap", "soft");
    field.value = article.brief;
    field.oninput = function(){
        previewer.innerHTML = markdown.toHTML(field.value);
    };

    var commitButton = document.createElement("input");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Apply changes");

    var rollbackButton = document.createElement("input");
    rollbackButton.setAttribute("type", "button");
    rollbackButton.setAttribute("value", "Discard changes");
    rollbackButton.onclick = function () {
        location.reload();
    };

    var aid = document.createElement("input");
    aid.setAttribute("type", "hidden");
    aid.setAttribute("name", "aid");
    aid.setAttribute("value", article._id);

    form.appendChild(field);
    form.appendChild(commitButton);
    form.appendChild(rollbackButton);
    form.appendChild(aid);

    previewer.parentNode.insertBefore(form, previewer);

    removePanels();
}

function initTableRenamer()
{
    var previewer = document.getElementById("articleHeadRight").getElementsByTagName("h3")[0];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-rename-table");
    form.setAttribute("class", "EditorForm");

    var field = document.createElement("input");
    field.setAttribute("name", "newname");
    field.value = article.tableName;
    field.oninput = function(){
        previewer.innerHTML = field.value;
    };

    var commitButton = document.createElement("input");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Apply changes");

    var rollbackButton = document.createElement("input");
    rollbackButton.setAttribute("type", "button");
    rollbackButton.setAttribute("value", "Discard changes");
    rollbackButton.onclick = function () {
        location.reload();
    };

    var aid = document.createElement("input");
    aid.setAttribute("type", "hidden");
    aid.setAttribute("name", "aid");
    aid.setAttribute("value", article._id);

    form.appendChild(field);
    form.appendChild(commitButton);
    form.appendChild(rollbackButton);
    form.appendChild(aid);

    previewer.parentNode.insertBefore(form, previewer);

    removePanels();
}

function initTableEditor()
{
    var previewer = document
        .getElementById("articleRightTableBox")
        .getElementsByTagName("table")[0];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-edit-table");
    form.setAttribute("class", "EditorForm");

    var field = document.createElement("textarea");
    field.setAttribute("name", "newcontent");
    field.setAttribute("wrap", "soft");
    field.setAttribute("placeholder", "Syntax: <key> RETURN <value> RETURN RETURN");
    field.value = unparseTable(article.table);
    field.oninput = function(){
        updateTable(parseTable(field.value));
    };


    var commitButton = document.createElement("input");
    commitButton.setAttribute("type", "submit");
    commitButton.setAttribute("value", "Apply changes");

    var rollbackButton = document.createElement("input");
    rollbackButton.setAttribute("type", "button");
    rollbackButton.setAttribute("value", "Discard changes");
    rollbackButton.onclick = function () {
        location.reload();
    };

    var aid = document.createElement("input");
    aid.setAttribute("type", "hidden");
    aid.setAttribute("name", "aid");
    aid.setAttribute("value", article._id);

    form.appendChild(field);
    form.appendChild(commitButton);
    form.appendChild(rollbackButton);
    form.appendChild(aid);

    previewer.parentNode.insertBefore(form, previewer);

    removePanels();
}


function unparseTable(data)
{
    return data.reduce(function(previousValue, currentValue) {
        return previousValue + currentValue.k + "\n" + currentValue.v + "\n\n";
    }, "");
}

function parseTable(str)
{
    var result = [];

    str
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n\n").forEach((row) =>
        {
            var rowComponents = row.split("\n");

            result.push({
                k: rowComponents.shift(),
                v: rowComponents.join("\n")
            });
        });

    return result;
}

function updateTable(data)
{
    var tbody = $("#rightTable");

    tbody.find("tr").remove();

    data.forEach((row) => {
        var key = $("<td/>", {
            class: "RightTableCell",
            align: "right"
        }).text(row.k);

        var value = $("<td/>", {
            class: "RightTableCell",
            align: "left"
        }).text(row.v);

        var tr = $("<tr/>", {}).appendTo(tbody);

        tr.append(key);
        tr.append(value);
    });
}


function removePanels()
{
    $(".EditPanel").remove();
}

function post(path, params)
{
    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}
