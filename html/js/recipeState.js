$(function(){
    $("#recipeState").load("/htmlObject/recipeState.html"); 
});

stateNumber = 1;
function next(){
    document.getElementById('state'+stateNumber).style.display = 'none';
    stateNumber += 1;
    document.getElementById('state'+stateNumber).style.display = '';
    if(stateNumber == 3){state3();}
    else if(stateNumber == 4){document.getElementById('nextButton').style.display = 'none';}
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