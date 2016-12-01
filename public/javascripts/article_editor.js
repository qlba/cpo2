/**
 * Created by qlba on 01.12.2016.
 */

var x = 1;

function initEditor(sid) {

    var thatSection = document.getElementById(sid);
    var div = thatSection.getElementsByTagName("div")[0];
    var p = thatSection.getElementsByTagName("p")[0];

    var field = document.createElement("textarea");
    field.setAttribute("class", "EditorField");
    field.value = article.content.find(function(s){return s.sectId == sid;}).sectContent;
    field.oninput = function(){
        p.innerHTML = markdown.toHTML(field.value);
        field.setAttribute("rows",
            (field.value.match(/\n/g) || []).length + 1
        );

        console.log((field.value.match(/\n/g) || []).length + 1);
    };

    var commitButton = document.createElement("button");
    field.setAttribute("class", "EditorField");


    div.parentNode.insertBefore(field, div);






    // document.getElementsByClassName("EditPanel").forEach(function(elem){
    //     elem.parentNode.removeChild(elem);
    // });


}


function removePanels()
{
    var panels;

    while((panels = document.getElementsByClassName("EditPanel")).length > 0)
    {
        console.log("Wiping " + panels.length + " elements");

        [].forEach.call(panels, function(v) {
            v.parentNode.removeChild(v);
        });
    }
}