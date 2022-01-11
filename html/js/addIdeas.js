function addIdea(){
    request = {
        action: 'addIdea',
        ideaName: document.getElementById('ideaName').value,
        ideaLink: document.getElementById('ideaLink').value,
        type: document.getElementById('recipeType').value
    };
    $.get('ajax',request,(data,status)=>{
        location = '/ideas.html';
    });
}