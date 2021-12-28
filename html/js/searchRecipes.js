$(function(){
    $("#searchRecipes").load("/htmlObject/searchRecipes.html"); 
});

function search(){
    $.get('ajax',{action:'rechercheRecette',value:JSON.stringify(listIngredientsId)},(data,status)=>{
        displayRecipes(JSON.parse(data));
    });
}

function displayRecipes(recipes){
    document.getElementById('removableRecipes').remove();
    div = document.createElement('div');
    div.id = 'removableRecipes';
    for(a=0;a!=recipes[0].length;a++){
        p = document.createElement('div');
        p.innerHTML = recipes[0][a];
        p.setAttribute('onclick',`recipeSelected(${recipes[1][a]})`);
        p.setAttribute('class','recipeList');
        div.appendChild(p);
    }
    document.getElementById('containsRecipes').appendChild(div);
}

function recipeSelected(id){
    window.location.replace(`recipe.html?recipe=${id}`)
}