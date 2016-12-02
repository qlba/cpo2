/**
 * Created by qlba on 01.12.2016.
 */

function initEditor(sid) {

    var thatSection = document.getElementById(sid);
    var div = thatSection.getElementsByTagName("div")[0];
    var p = thatSection.getElementsByTagName("p")[0];

    var form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "/article-edit-section");
    form.setAttribute("class", "EditorForm");


    var field = document.createElement("textarea");
    field.setAttribute("name", "newcontent");
    field.value = article.content.find(function(s){return s.sectId == sid;}).sectContent;
    field.oninput = function(){
        p.innerHTML = markdown.toHTML(field.value);
        field.setAttribute("rows", ((field.value.match(/\n/g) || []).length + 1).toString());
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

    div.parentNode.insertBefore(form, div);



    removePanels();

}


function removePanels()
{
    var panels;

    while((panels = document.getElementsByClassName("EditPanel")).length > 0)
        [].forEach.call(panels, function(v) {
            v.parentNode.removeChild(v);
        });
}
