$(function(){
    $("#topBar").load("/htmlObject/topBar.html"); 
});

function home(){
    document.location.replace('/');
}

function setRight(){
    document.getElementById('searchIconByIngredients').style.right='calc(5% + 2em)'
}

function searchT(){
    document.location.replace('/searchByIngredients.html');
}

function searchR(){
    document.location.replace('/searchRecipe.html');
}

function ideaC(){
    document.location.replace('/ideas.html');
}

function setLeft(){
    document.getElementById('ideaIcon').style.left='calc(5% + 2em)'
}