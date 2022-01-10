$(function(){
    $("#searchIngredients").load("/htmlObject/searchIngredients.html"); 
});

var dataI;
var listIngredientsId = [];
var listIngredientsName = [];
autoSearch = false;

function changeInputValue(reset){
    $.get('ajax',{action:'rechercheIngredient',value:document.getElementById('searchInput').value},(data,status)=>{
        dataI = JSON.parse(data);
        for(a=0;a!=3;a++){
            if(reset){
                document.getElementById(`pre${a}`).style.display = 'none';
            }else{
                while(dataI[0].length < 3){dataI[0].push(' ');}
                document.getElementById(`pre${a}`).innerHTML = dataI[0][a];
                if(dataI[0][a] == ' '){
                    document.getElementById(`pre${a}`).style.display = 'none';
                }else{
                    document.getElementById(`pre${a}`).style.display = 'block';
                }
            }   
        }
    })
}

function clickPre(id){
    Name = document.getElementById(id).innerHTML;
    if(!listIngredientsName.includes(Name)){
        listIngredientsName.push(Name);
        listIngredientsId.push(dataI[1][dataI[0].indexOf(Name)]);
        displayIngredients();
        document.getElementById('searchInput').value = '';
        changeInputValue(true);
    }                
}

function displayIngredients(){
    document.getElementById('removableIngredients').remove();
    div = document.createElement('div');
    div.id = 'removableIngredients';
    for(a=0;a!=listIngredientsName.length;a++){
        p = document.createElement('div');
        p.innerHTML = listIngredientsName[a];
        p.setAttribute('class','ingredientList');
        p.setAttribute('onclick',`removeIngredient(${a})`);
        div.appendChild(p);
    }
    document.getElementById('containsIngredients').appendChild(div);
    if(autoSearch){
        searchForRecipe();
    }
}

function removeIngredient(i){
    listIngredientsId.splice(i,1);
    listIngredientsName.splice(i,1)
    displayIngredients();
}