function submit(){
    name = document.getElementById('nom').value;
    quantityI = [];
    for(element of listIngredientsName){
        quantityI.push(document.getElementById('inputQt'+element).value);
    }
    stepI = [];
    for(a = 1; a != step+1; a++){
        stepI.push(document.getElementById('taStep'+a).value);
    }
    request = {
        action: 'addRecipe',
        name: name,
        listIngredients: listIngredientsId,
        listNameIngredients: listIngredientsName,
        time : [document.getElementById('preparationTime').value,document.getElementById('cookTime').value],
        quantity: quantityI,
        step: stepI
    }
    $.get('ajax',request,(data,status)=>{
        document.location.href = '/';
    });
}