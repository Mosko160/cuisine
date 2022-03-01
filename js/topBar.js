$(function(){
    $("#topBar").load("/htmlObject/topBar.html"); 
});

function home(){
    location = '/html/index.html';
}

function setRight(){
    document.getElementById('searchIconByIngredients').style.right='calc(5% + 2em)'
}

function searchT(){
    location = '/html/searchByIngredients.html';
}

function searchR(){
    location = '/html/searchRecipe.html';
}

function ideaC(){
    location = '/html/ideas.html';
}

function setLeft(){
    document.getElementById('ideaIcon').style.left='calc(5% + 2em)'
}

