$(function(){
    $("#addIngredients").load("/htmlObject/addIngredients.html"); 
});

var dataI;
var listIngredientsId = [];
var listIngredientsName = [];

function changeInputValue(){
    $.get('ajax',{action:'rechercheIngredient',value:document.getElementById('searchInput').value},(data,status)=>{
        dataI = JSON.parse(data);
        for(a=0;a!=3;a++){
            while(dataI[0].length < 3){dataI[0].push(' ');}
            document.getElementById(`pre${a}`).innerHTML = dataI[0][a];
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
        changeInputValue();
    }                
}

function displayIngredients(){
    document.getElementById('removableIngredients').remove();
    div = document.createElement('div');
    div.id = 'removableIngredients';
    for(a=0;a!=listIngredientsName.length;a++){
        p = document.createElement('p');
        p.innerHTML = listIngredientsName[a];
        p.setAttribute('onclick',`removeIngredient(${a})`);
        div.appendChild(p);
    }
    document.getElementById('containsIngredients').appendChild(div);
}

function removeIngredient(i){
    console.log(listIngredientsId)
    listIngredientsId.splice(i,1);
    listIngredientsName.splice(i,1)
    displayIngredients();
}