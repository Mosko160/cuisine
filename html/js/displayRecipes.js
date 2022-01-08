$(function(){
    $("#displayRecipes").load("/htmlObject/displayRecipes.html"); 
});

function searchForRecipe(){
    dataI = document.getElementById('searchRecipeName').value;
    if(dataI == ''){
        $.get('ajax',{action:'searchRecipeByName',type:'random'},(data,status)=>{
            displayRecipe(data);
        });
    }else{
        $.get('ajax',{action:'searchRecipeByName',type:'search',content:dataI},(data,status)=>{
            displayRecipe(data);
        });
    }
}

function displayRecipe(dataNonParse){
    data = JSON.parse(dataNonParse);
    Rid = data['id'];
    Rname = data['name'];
    l = Rid.length;
    document.getElementById('containerR').remove();
    d = document.createElement('div');
    d.id = 'containerR';
    for(a=0; a!=l; a++){
        element = document.createElement('p');
        element.innerHTML = Rname[a];
        element.setAttribute('onclick',`recipeSelected(${Rid[a]})`);
        d.appendChild(element);
    }
    document.getElementById('CONTAINERR').appendChild(d);
}

function recipeSelected(id){
    window.location.replace(`recipe.html?recipe=${id}`)
}