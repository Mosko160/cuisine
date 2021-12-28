function getContent(){
    const urlParams = new URLSearchParams(window.location.search);
    recipeId = urlParams.get('recipe');

    $.get('ajax',{action:'getQuantity',id:recipeId},(data,status)=>{
        data = JSON.parse(JSON.parse(data));
        for(a=0;a!=data['liste'].length;a++){
            p = document.createElement('p');
            p.innerHTML = data['liste'][a]+' : '+data[data['liste'][a]]
            document.getElementById('container').appendChild(p);
        }
    });

    $.get('ajax',{action:'getRecipe',id:recipeId},(data,status)=>{
        data = JSON.parse(JSON.parse(data));
        for(a=1;a!=data.etapes+1;a++){
            p = document.createElement('p');
            p.innerHTML = data[a];
            document.getElementById('container').appendChild(p);
        }
    });
}