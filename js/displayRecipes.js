$(function(){
    $("#displayRecipes").load("/htmlObject/displayRecipes.html"); 
});

var recipeInfos = [];

function searchForRecipe(){
    dataI = document.getElementById('searchRecipeName').value;
    if(dataI == ''){
        $.get('ajax',{action:'searchRecipeByName',type:'random',recipeType:document.getElementById('recipeType').value},(data,status)=>{
            displayRecipe(data);
        });
    }else{
        $.get('ajax',{action:'searchRecipeByName',type:'search',content:dataI,recipeType:document.getElementById('recipeType').value},(data,status)=>{
            displayRecipe(data);
        });
    }
}

function displayRecipe(dataNonParse){
    data = JSON.parse(dataNonParse);
    searchRecipeDisplay.list = data['name'];
    Rid = data['id'];
    Rname = data['name'];
    recipeInfos = [Rname,Rid]
}

function recipeSelected(id){
    location = `/html/recipe.html?recipe=${id}`;
}

function startVueSearchRecipe(){
    searchRecipeDisplay = new Vue({
        el : '#CONTAINERR',
        data : {
            list : []
        },
        methods : {
            clickedRecipe: function(name){
                recipeSelected(recipeInfos[1][recipeInfos[0].indexOf(name)]);
            }
        }
    });
}