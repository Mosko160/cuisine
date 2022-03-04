function save(){
    valueN = document.getElementById('ingredientsName').value.replaceAll("'","&#39;");
    $.get('ajax',{action:'addIngredients',value:valueN},(data,status)=>{
        document.getElementById('ingredientsName').value = '';
        document.getElementById('checkImage').style.animation = '1s linear slidein'
        setTimeout(() => {document.getElementById('checkImage').style.animation = ''}, 1000);
    });
}