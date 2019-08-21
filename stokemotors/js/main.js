$(function () {
    $(document).ready(function(){
        var cfi;
        var currentFilters = window.location.href;
        if(window.location.href.indexOf("?") > -1){
            cfi = window.location.href.indexOf("?") +1;
            currentFilters = currentFilters.substr(cfi).split("&");
        } 

        var selects = $('#filters select');
        for(var x=0; x<selects.length; x++){
            for(var i=0; i< currentFilters.length; i++){
                var filter = currentFilters[i].split("=");
                if(filter[1] != null && filter[0] == selects[x].id){
                    var options = $(selects[x]).find('option');
                    for(var o=0; o< options.length; o++){
                        if(options[o].value.toLowerCase() == filter[1].toLocaleLowerCase()){
                            $(options[o]).attr('selected','selected');
                        }
                    } 
                }
                if(filter[1] != null && selects[x].id == "price"){
                    var options = $(selects[x]).find('option');
                    for(var o=0; o< options.length; o++){
                        if(options[o].value.toLowerCase() == filter[1].toLowerCase()){
                            $(options[o]).attr('selected','selected');
                        }
                    } 
                }
            }
        }
    });
});



function addFilter(select){
    var currentFilters = window.location.href;
    var cfi;
    var uri;
    if(window.location.href.indexOf("?") > -1){
        cfi = window.location.href.indexOf("?") +1;
        uri = currentFilters.substr(0,cfi);
        currentFilters = currentFilters.substr(cfi).split("&");
    } else{
        cfi = window.location.href.length;
        currentFilters = Array();
        uri = window.location.href + "?";
    }

    var filter = $(select)[0].id;
    var value = $($(select)[0]).find('option:selected')[0].value;
    var newFilters = Array();
    var filterExists = false;
    
    for(var f in currentFilters){
        if(currentFilters[f].indexOf(filter) > -1){
            filterExists = true;
            if(value != ""){
                currentFilters[f] = filter+"="+value;
            } else{
                currentFilters.splice(f);
            }
            break;
        }
    }

    if(!filterExists && value != ""){
        currentFilters.push(filter+"="+value);
    }
    if(currentFilters.length > 0){
        window.location.href = uri + currentFilters.join("&");
    } else{
        window.location.href = uri.substr(0,uri.length -1);
    }
}

function orderBy(select){
    var currentFilters = window.location.href;
    var cfi;
    var uri;
    if(window.location.href.indexOf("?") > -1){
        cfi = window.location.href.indexOf("?") +1;
        uri = currentFilters.substr(0,cfi);
        currentFilters = currentFilters.substr(cfi).split("&");
    } else{
        cfi = window.location.href.length;
        currentFilters = Array();
        uri = window.location.href + "?";
    }
    
    var order = $(select)[0].id;
    var direction = $($(select)[0]).find('option:selected')[0].value;
    var orderExists = false;
    var directionExists = false;
    for(var f=0; f< currentFilters.length; f++){
        if(currentFilters[f] != null && currentFilters[f].indexOf("orderby") > -1){
            if(order != "" && direction != ""){
                currentFilters[f] = "orderby="+order;
            } else{
                currentFilters.splice(f);
            }
            orderExists = true;
        }
        if(currentFilters[f] != null && currentFilters[f].indexOf("direction") > -1){
            if(order != "" && direction != ""){
                currentFilters[f] = "direction="+direction;
            } else{
                currentFilters.splice(f);
            }
            directionExists = true;
        }
    }
    if(!orderExists){
        currentFilters.push("orderby="+order);
    }
    if(!directionExists){
        currentFilters.push("direction="+direction);
    }
    if(currentFilters.length > 0){
        window.location.href = uri + currentFilters.join("&");
    } else{
        window.location.href = uri.substr(0,uri.length -1);
    }
}

function post(form){
    $('#'+form).post();
}