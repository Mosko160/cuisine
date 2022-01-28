$(function(){
    $("#searchRecipes").load("/htmlObject/searchRecipes.html"); 
});

var recipeInfo = null;

function searchForRecipe(){
    $.get('ajax',{action:'rechercheRecette',value:JSON.stringify(listIngredientsId)},(data,status)=>{
        if(data != 'none'){
            displayRecipes(JSON.parse(data));
        }
    });
}

function displayRecipes(recipes){
    recipeInfo = recipes;
    recipeDisplay.list = recipeInfo[0];
}

function recipeSelected(id){
    location = `/html/recipe.html?recipe=${id}`;
}

function startVueRecipe(){
    recipeDisplay = new Vue({
        el : '#containsRecipes',
        data : {
            list : []
        },
        methods : {
            recipeClicked: function(name){
                recipeSelected(recipeInfo[1][recipeInfo[0].indexOf(name)]);
            }
        }
    });
}