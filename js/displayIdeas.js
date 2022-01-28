$(function(){
    $("#displayIdeas").load("/htmlObject/displayIdeas.html"); 
});

function getIdeas(){
    $.get('ajax',{action:'getIdeas',type:document.getElementById('recipeType').value},(data,status)=>{
        displayIdeas(data);
    });
}

var ideasInfo = [];

function displayIdeas(contentData){
    data = JSON.parse(contentData);
    ideaName = data['names'];
    ideaLink = data['links'];
    ideaId = data['id'];
    ideasDisplay.list = ideaName;
    ideasInfo = [ideaName,ideaId,ideaLink];
}

function ideaClicked(id,url){
    if(document.getElementById('deleteButton').checked){
        $.get('ajax',{action:'deleteIdeas',id:id},(data,status)=>{});
        getIdeas();
    }else{
        window.open(url,"_blank");
    }
}

function addIdeas(){
    location = '/html/addIdeas.html';
}

function startVueDisplayIdeas(){
    ideasDisplay = new Vue({
        el : '#container',
        data : {
            list : []
        },
        methods : {
            clickedRecipe: function(name){
                index = ideasInfo[0].indexOf(name);
                ideaClicked(ideasInfo[1][index],ideasInfo[2][index]);
            }
        }
    });
}