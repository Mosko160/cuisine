function save(){
    valueN = document.getElementById('ingredientsName').value;
    $.get('ajax',{action:'addIngredients',value:valueN},(data,status)=>{});
}