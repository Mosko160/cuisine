function addIdea(){
    request = {
        action: 'addIdea',
        ideaName: document.getElementById('ideaName').value.replaceAll("'","&#39;"),
        ideaLink: document.getElementById('ideaLink').value.replaceAll("'","&#39;"),
        type: document.getElementById('recipeType').value.replaceAll("'","&#39;")
    };
    $.get('ajax',request,(data,status)=>{
        location = '/html/ideas.html';
    });
}