$(function(){
    $("#displayIdeas").load("/htmlObject/displayIdeas.html"); 
});

function getIdeas(){
    $.get('ajax',{action:'getIdeas',type:document.getElementById('recipeType').value},(data,status)=>{
        displayIdeas(data);
    });
}

function displayIdeas(contentData){
    data = JSON.parse(contentData);
    ideaName = data['names'];
    ideaLink = data['links'];
    console.log(data);
    ideaId = data['id'];
    l = ideaLink.length;
    container = document.createElement('div');
    container.id = 'containerIdeas';
    for(a=0; a != l; a++){
        d = document.createElement('div');
        d.innerHTML = ideaName[a];
        d.setAttribute('onclick',`ideaClicked("${ideaId[a]}","${ideaLink[a]}")`);
        d.setAttribute('class','ideaList');
        d.id = ideaId[a];
        container.appendChild(d);
    }
    document.getElementById('containerIdeas').remove();
    document.getElementById('container').appendChild(container)
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
    location = '/addIdeas.html';
}