function submit(){
    name = document.getElementById('nom').value.replaceAll("'","&#39;");
    quantityI = [];
    for(element of listIngredientsName){
        quantityI.push(document.getElementById('inputQt'+element).value.replaceAll("'","&#39;"));
    }
    stepI = [];
    for(a = 1; a != step+1; a++){
        stepI.push(document.getElementById('taStep'+a).value.replaceAll("'","&#39;"));
    }
    file = document.getElementById('imageInput').files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var request;
    reader.onload = function () {
        request = {
            action: 'addRecipe',
            name: name,
            listIngredients: listIngredientsId,
            listNameIngredients: listIngredientsName,
            time : [document.getElementById('preparationTime').value,document.getElementById('cookTime').value.replaceAll("'","&#39;")],
            quantity: quantityI,
            typeRecipe : document.getElementById('recipeType').value.replaceAll("'","&#39;"),
            step: stepI,
            image: reader.result
        }
        $.get('ajax',request,(data,status)=>{
            document.location.href = '/';
        });
    };
    
}