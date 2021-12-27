$(function(){
    $("#recipeState").load("/htmlObject/recipeState.html"); 
});

state = 1;
function next(){
    document.getElementById('state'+state).style.display = 'none';
    state += 1;
    document.getElementById('state'+state).style.display = '';
    if(state == 3){state3();}
    else if(state == 4){document.getElementById('nextButton').style.display = 'none';}
}
            
function state3(){
    for(element of listIngredientsName){
        p = document.createElement('p');
        p.innerHTML = element;
        i = document.createElement('input');
        i.id = 'inputQt'+element;
        p.appendChild(i);
        document.getElementById('containerQt').appendChild(p);
    }
}