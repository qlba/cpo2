/**
 * Created by qlba on 01.12.2016.
 */

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
    field.value = article.content[sid].sectContent;
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
    field.value = article.content[sid].sectName;
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
    var params = {
        aid: article._id,
        asid: sid
    };
    
    post("/article-delete-section", params);
}



function initSectionInserter(sid)
{
    var params = {
        aid: article._id,
        asid: sid
    };

    post("/article-insert-section", params);
}


function removePanels()
{
    var panels;

    while((panels = document.getElementsByClassName("EditPanel")).length > 0)
        [].forEach.call(panels, function(v) {
            v.parentNode.removeChild(v);
        });
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