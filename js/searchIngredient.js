$(function(){
    $("#searchIngredients").load("/htmlObject/searchIngredients.html"); 
});

var dataI;
var listIngredientsId = [];
var listIngredientsName = [];
autoSearch = false;

function changeInputValue(reset){
    $.get('ajax',{action:'rechercheIngredient',value:document.getElementById('searchInput').value.replaceAll("'","&#39;")},(data,status)=>{
        if(reset || data == 'none'){ingredientsSelector.pre = [];}
        else{
            dataI = JSON.parse(data);
            ingredientsSelector.pre = dataI[0];
        }
    });
}

function clickPre(Name){
    if(!listIngredientsName.includes(Name)){
        listIngredientsName.push(Name);
        listIngredientsId.push(dataI[1][dataI[0].indexOf(Name)]);
        displayIngredients();
        document.getElementById('searchInput').value = '';
        changeInputValue(true);
    }                
}

function displayIngredients(){
    ingredientsSelector.picked = listIngredientsName;
    if(autoSearch){
        searchForRecipe();
    }
}

function removeIngredient(i){
    listIngredientsId.splice(i,1);
    listIngredientsName.splice(i,1)
    displayIngredients();
}

function startVueIngredients(){
    ingredientsSelector = new Vue({
        el : '#ingredientsContainer',
        data : {
            pre : [],
            picked : []
        },
        methods : {
            clickedPre: function(name){
                clickPre(name);
            },
            clickedIng: function(name){
                removeIngredient(listIngredientsName.indexOf(name));
            }
        }
    });
}