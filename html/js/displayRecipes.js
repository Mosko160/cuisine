$(function(){
    $("#displayRecipes").load("/htmlObject/displayRecipes.html"); 
});

function searchForRecipe(){
    data = document.getElementById('searchRecipeName').value;
    if(data == ''){
        $.get('ajax',{action:'searchRecipeByName',type:'random'},(data,status)=>{
            displayRecipe(data);
        });
    }
}

function displayRecipe(dataNonParse){
    data = JSON.parse(dataNonParse);
    Rid = data['id'];
    Rname = data['name'];
    l = Rid.length;
    for(a=0; a!=l; a++){
        element = document.createElement('p');
        element.innerHTML = Rname[a];
        element.setAttribute('onclick',`recipeSelected(${Rid[a]})`);
        document.getElementById('containerR').appendChild(element);
    }
}

function recipeSelected(id){
    window.location.replace(`recipe.html?recipe=${id}`)
}