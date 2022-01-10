$(function(){
    $("#topBar").load("/htmlObject/topBar.html"); 
});

function home(){
    location = '/';
}

function setRight(){
    document.getElementById('searchIconByIngredients').style.right='calc(5% + 2em)'
}

function searchT(){
    location = '/searchByIngredients.html';
}

function searchR(){
    location = '/searchRecipe.html';
}

function ideaC(){
    location = '/ideas.html';
}

function setLeft(){
    document.getElementById('ideaIcon').style.left='calc(5% + 2em)'
}