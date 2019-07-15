//To Do:
//Re-order element feature (drag and drop)
//Text editor
//Style editor
//Save function


//UI vars
var editHover;
$.get('../editor/UI/_editHover.html',function(data){
    editHover = data;
});
var editorUI;
$.get('../editor/UI/_mainEditorUI.html',function(data){
    editorUI = data;
});

var doneEditing;
$.get('../editor/UI/_doneEditing.html',function(data){
    doneEditing = data;
});

var gridGuide;
$.get('../editor/UI/_gridGuide.html',function(data){
    gridGuide = data;
});

var textEditorUI;
$.get('../editor/UI/_textEditorUI.html',function(data){
    textEditorUI = data;
});


//Editor vars
var screen = "desktop";
var viewDoc;

var initWidth = window.innerWidth;

var editable;
var toEdit;
var toEditInner;
var toEditParent;

var editorMode;
var editing = false;

//Resize vars
var handleLeft = '<div class="handleLeft" onmousedown="parent.dragging(event)">|||</div>';
var handleRight = '<div class="handleRight" onmousedown="parent.dragging(event)">|||</div>';

var toEditInitWidth;
var col = "col-lg-";
var colWidth;
var gutterWidth = 15;
var p1;
var p2;

//EditContent vars

var sel;
var selEl;
var selElSib;
var selElLen;
var selElChildLength;
var atElEnd;
var selRange;
var selNodes;

//Globals end

$(function () {
    $(document).ready(function(){
        viewDoc = $('#viewport')[0].contentWindow.document;
        $.get('../css/editorStyle.css',function(data){
            $('#viewport').contents().find('body').append('<style id="editorStyle">'+data+'</style>');
        });
        
        editable = $('#viewport').contents().find('[data-comp-edit="true"]');
        for(var i=0; i<editable.length; i++){
            $(editable[i]).attr("onClick","parent.editThis(this)");
            $(editable[i]).find(".inner").append(editHover);
        }
    });
});

function setScreen(s){
    $('#viewport').removeClass("mobWidth").removeClass("mobLWidth").removeClass("tabWidth").removeClass("deskWidth");
    screen = s;
    switch(s){
        case "mobile":
            col = "col-";
            $('#viewport').addClass("mobWidth");
            break;
        case "mobile-landscape":
            col = "col-sm-";
            $('#viewport').addClass("mobLWidth");
            break;
        case "tablet":
            col = "col-md-";
            $('#viewport').addClass("tabWidth");
            break;
        case "desktop":
            col = "col-lg-";
            $('#viewport').addClass("deskWidth");
            break;
    }
    $('#screenSize')[0].innerHTML=screen;
    resetResizeVars();
}

function editThis(el,reset){
    toEdit = el;
    toEditInner = $(toEdit).find('.inner')[0];
    toEditParent = $(toEdit).parent();
    $(toEdit).addClass("editing");
    if(!reset){
        for(var i=0; i<editable.length; i++){
            $(editable[i]).removeAttr("onclick");
        }
        $('#editorContainer').append(editorUI);
    } else {
        editable = $('#viewport').contents().find('[data-comp-edit="true"]');
    }
}

function setEditorMode(mode){
    $('#editType').remove();
    editorMode = mode;
    switch(mode){
        case "resize":
            enableResize();
            break;
        case "editContent":
            enableEditContent();
            break;
    }
    editing = true;
    $('#editorContainer').append(doneEditing);
}

// Resize

function enableResize(){
    toEditInitWidth = $(toEdit)[0].offsetWidth;
    $(toEdit).addClass("resizing");
    $(toEditParent).prepend(gridGuide);
    colWidth = $(toEditParent).find('.gridGuide [class*="col"]')[0].offsetWidth;
    $(toEdit).prepend(handleLeft);
    $(toEdit).append(handleRight);
}

function dragging(e){
    e = e || window.event;
    e.preventDefault();
    p1 = e.clientX;
    $(viewDoc)[0].onmousemove = function(x){drag(x);}
    $(viewDoc)[0].onmouseup = function(){endDrag();}
    $('#viewport').mouseout(function(){endDrag();});
}

function drag(e){
    e = e || window.event;
    e.preventDefault();
    p2 = e.clientX;
    var dif = p2 - p1;
    $(toEdit).css({
        maxWidth: "100%",
        width: toEditInitWidth + dif,
        flex: "none"
    });
    if(p2 > p1){
        if(dif >= colWidth){
            changeCol(true);
            stepCol();
        }
    } else {
        if(dif <= -(colWidth)){
            changeCol(false);
            stepCol();
        }
    }
}

function stepCol(){
    endDrag();
    dragging();
}

function endDrag(){
    p1=0;
    p2=0;
    $(toEdit).removeAttr("style");
    if($(toEdit)[0] != undefined){
        toEditInitWidth = $(toEdit)[0].offsetWidth;
    }
    $(viewDoc)[0].onmousemove = null;
}

function changeCol(increase){
    var colNum;
    var s;
    if(screen == "mobile"){
        for(var x=0; x<toEdit.classList.length; x++){
            if(toEdit.classList[x].length < 7){
                if(toEdit.classList[x].indexOf(col) > -1){
                    s = toEdit.classList[x].indexOf(col) + 4;
                    colNum = toEdit.classList[x].substr(s,2).trim();
                } 
            }
        }
    } else{
        if(toEdit.classList.value.indexOf(col) > -1){
            s = toEdit.classList.value.indexOf(col) + 7;
            colNum = toEdit.classList.value.substr(s,2).trim();
        }
    }
    
    if(increase){
        if(colNum == undefined){colNum = 11;}
        if(colNum > 0 && colNum < 12){
            $(toEdit).removeClass(col + colNum);
            $(toEdit).addClass(col + (parseInt(colNum) + 1));
        }
    } else{
        if(colNum == undefined){colNum = 12;}
        if(colNum > 1 && colNum < 13){
            $(toEdit).removeClass(col + colNum);
            $(toEdit).addClass(col + (parseInt(colNum) - 1) );
        }
    }
}

//Edit Content

function enableEditContent(){
    $(toEdit).addClass("editContent");
    $('#editorContainer').append(textEditorUI);
    $(toEdit).find('.editHover').remove();
    $('#textEditorUI code').append(toEdit.cloneNode(true));
    $('#textEditorUI code .inner').attr("contenteditable",true);
    $('#textEditorUI code .inner').focus();
    $('#textEditorUI code .inner').blur(function(){
        $('#textEditorUI code .inner').focus();
    });
    $('#textEditorUI code .inner').mouseup(function(){
        setSelection();
    });
    $('#textEditorUI code .inner').keydown(function(){
        setSelection();
    });
}

function setSelection(){
    sel = $(document)[0].getSelection();
    selEl = sel.anchorNode.parentElement;
    getElementSibling();
    selElLen= selEl.innerText.length;
    selElChildLength = 0;
    selRange = sel.getRangeAt(0);
    for(var i=0; i<selEl.childElementCount; i++){
        selElChildLength += selEl.children[0].innerText.length;
    }
    atElEnd = (sel.anchorOffset + selElChildLength) == selElLen;
    /*console.log("Selected: ");
    console.log(sel);
    console.log("Selected Element: ");
    console.log(selEl);
    console.log("End of Element: "+ atElEnd);*/
}

function getElementSibling(){
    if(selEl.nextElementSibling != null){
        selElSib = selEl.nextElementSibling;
    } else {
        selElSib = sel.anchorNode.nextElementSibling;
    }
}

function textEditor(method,type){
    var toAdd;
    var toChange;
    
    if(method == "add"){
        
        switch(type){
            case "ul":
                toAdd = document.createElement("ul");
                toAdd.appendChild(document.createElement("li"))
                break;
            case "ol":
                toAdd = document.createElement("ol");
                toAdd.appendChild(document.createElement("li"))
                break;
        }
        
        if(atElEnd){
            try{
                selEl.insertBefore(toAdd,selElSib);
            } catch(error){
                try{
                    sel.getRangeAt(0).insertNode(toAdd);
                } catch(err){
                    console.log(err);
                }
            }
        } else {
            sel.getRangeAt(0).insertNode(toAdd);
        }
        getElementSibling();
        sel.extend(toAdd);
    } else if(method == "change" && selRange.startOffset != selRange.endOffset){
        var newEl = document.createElement("span");
        var className;
        var parentClasses;
        
        var selNodes = selRange.commonAncestorContainer.childNodes
        
        /*
        
        var startAt = 1;
        
        if(selRange.commonAncestorContainer.childNodes.length == 0 ){
            //var nodeText = selRange.commonAncestorContainer.data;
            //var selText = nodeText.substring(selRange.startOffset,selRange.endOffset);
            newEl = document.createElement(tagName);
            if((selRange.commonAncestorContainer.localName != undefined) && selRange.commonAncestorContainer.localName != tagName || selRange.commonAncestorContainer.parentNode.localName != tagName){
                newEl = document.createElement(tagName);
                selRange.surroundContents(newEl);
            } else {
                var c = selRange.startContainer.nodeValue.substring(selRange.startOffset,selRange.endOffset);
                selRange.extractContents();
                selRange.endContainer.parentNode.parentNode.insertBefore(document.createTextNode(c), selRange.endContainer.parentNode.nextSibling);
            }
            clearEmptyNodes();
        } else{
            //selected text in multipleNodes
            selNodes = selRange.commonAncestorContainer.childNodes;
            var childLength = selNodes.length;
            
            var firstRange = document.createRange();
            firstRange.setStart(selRange.startContainer,selRange.startOffset);
            firstRange.setEnd(selRange.startContainer,selRange.startContainer.length);
            
            if((firstRange.commonAncestorContainer.localName != undefined) && firstRange.commonAncestorContainer.localName != tagName || firstRange.commonAncestorContainer.parentNode.localName != tagName){
                newEl = document.createElement(tagName);
                firstRange.surroundContents(newEl);
            } else {
                var c = firstRange.startContainer.nodeValue.substring(firstRange.startOffset,firstRange.endOffset);
                firstRange.extractContents();
                firstRange.endContainer.parentNode.parentNode.insertBefore(document.createTextNode(c), firstRange.endContainer.parentNode.nextSibling);
                startAt = 2;
            }
            clearEmptyNodes();
            
            var lastRange = document.createRange();
            lastRange.setStart(selRange.endContainer,0);
            lastRange.setEnd(selRange.endContainer,selRange.endOffset);

            if((lastRange.commonAncestorContainer.localName != undefined) && lastRange.commonAncestorContainer.localName != tagName || lastRange.commonAncestorContainer.parentNode.localName != tagName){
                newEl = document.createElement(tagName);
                lastRange.surroundContents(newEl);
            } else {
                var c = lastRange.startContainer.nodeValue.substring(lastRange.startOffset,lastRange.endOffset);
                lastRange.extractContents();
                lastRange.endContainer.parentNode.parentNode.insertBefore(document.createTextNode(c), lastRange.endContainer.parentNode.nextSibling);
            }
            clearEmptyNodes();
            
            if(childLength > 2){
                for(var i = startAt; i<selNodes.length -2; i++){
                    var node = selNodes[i];
                        var nodeLength;
                        if(node.tagName != undefined){
                            nodeLength = node.innerHTML.length;
                        } else{
                            nodeLength = node.length;
                        }
                        if(nodeLength > 0){
                            var newRange = document.createRange();
                            try{
                                newRange.setStart(node,0);
                                newRange.setEnd(node,nodeLength);
                            } catch(err){
                                node = node.firstChild;
                                if(node.tagName != undefined){
                                    nodeLength = node.innerHTML.length;
                                } else{
                                    nodeLength = node.length;
                                }
                                newRange.setStart(node,0);
                                newRange.setEnd(node,nodeLength);
                            }
                            if((newRange.commonAncestorContainer.localName != undefined && newRange.commonAncestorContainer.localName != tagName) || newRange.commonAncestorContainer.parentNode.localName != tagName){
                                newEl = document.createElement(tagName);
                                newRange.surroundContents(newEl);
                            } else {
                                var c = newRange.startContainer.nodeValue.substring(newRange.startOffset,newRange.endOffset);
                                newRange.extractContents();
                                newRange.endContainer.parentNode.parentNode.insertBefore(document.createTextNode(c), newRange.endContainer.parentNode.nextSibling);
                            }
                        } else{

                        }
                    clearEmptyNodes();
                }
            }
        }*/
    }
    /*
    cleanUpNodes();
    setSelection();
    */
}

function clearEmptyNodes(){
    selNodes = selRange.commonAncestorContainer.childNodes;
    var childLength = selNodes.length;
    for(var i=0; i< childLength; i++){
        var node = selNodes[i];
        var nodeLength;
        if(node != undefined && node.tagName != undefined){
            nodeLength = node.innerHTML.length;
        } else{
            nodeLength = node.length;
        }
        if(nodeLength == 0 || (nodeLength == 1 && node.innerText == " ")){
            node.remove();
            childLength --;
            i--;
        }
    }
}

function cleanUpNodes(){
    var node = selRange.commonAncestorContainer;
    var len = node.childNodes.length
    for(var i=0; i<len; i++){
        console.log(node.childNodes[i]);
        if( i+1!=len && node.childNodes[i].nodeType == node.childNodes[i + 1].nodeType){
            var cut = node.childNodes[i+1].innerText;
            node.childNodes[i+1].remove();
            node.childNodes[i].innerText+=cut;
            console.log(node.childNodes[i]);
            i++;
            clearEmptyNodes();
        }
    }
}


//Shared

function finishedEditing(){
    switch(editorMode){
        case "resize":
            disableResize();
            break;
        case "editContent":
            disableEditContent();
            break;
    }
    
    $('#editDone').remove();
    $(toEdit).removeClass("editing");
    for(var i=0; i<editable.length; i++){
        $(editable[i]).attr('onclick', 'parent.editThis(this)');
    }

    editorMode = null;
    toEdit = null;
    editing = false;
}

function disableResize(){
    $(toEdit).removeClass("resizing");
    $(toEditParent).find(".gridGuide").remove();
    $(toEditParent).find(".handleLeft").remove();
    $(toEditParent).find(".handleRight").remove();
}

function disableEditContent(){
    var newEl = $('#textEditorUI code')[0].innerHTML;
    $('#editorContainer').find("#textEditorUI").remove();
    $(toEdit).replaceWith(newEl);
    editThis($(viewDoc).find('.editing'),true);
    $(toEdit).removeClass("editContent");
    $(toEdit).find('.inner').removeAttr("contenteditable");
}

function resetResizeVars(){
    if(editing){
        colWidth = $(toEditParent).find('.gridGuide [class*="col"]')[0].offsetWidth;
        toEditInitWidth = $(toEdit)[0].offsetWidth;
        p1=0;
        p2=0;
    }
}

function disableEditor(){
    for(var i=0; i<editable.length; i++){
        $(editable[i]).removeAttr("onClick");
    }
    $($("#viewport")[0].contentWindow.document).find("#editorStyle").remove();
}

function save(){
    disableEditor();
    //Ajax call:
    //write: $($("#viewport")[0].contentWindow.document.documentElement)[0].innerHTML;
    //to:    $("#viewport").attr("src");
}