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
    l = ideaLink.length;
    container = document.createElement('div');
    container.id = 'containerIdeas';
    for(a=0; a != l; a++){
        d = document.createElement('div');
        d.innerHTML = ideaName[a];
        d.setAttribute('onclick',`window.open("${ideaLink[a]}","_blank")`);
        d.setAttribute('class','ideaList');
        container.appendChild(d);
    }
    document.getElementById('container').appendChild(container)
}