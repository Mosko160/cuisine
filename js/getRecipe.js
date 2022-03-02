function getContent(){
    const urlParams = new URLSearchParams(window.location.search);
    recipeId = urlParams.get('recipe');

    $.get('ajax',{action:'getRecipeImage', idRecipe:recipeId},(data,status)=>{
        document.getElementById('imageRecipe').src = data;   
    });

    $.get('ajax',{action:'getRecipeName',idRecipe:recipeId},(data,status)=>{
        document.getElementById('containerN').innerHTML = `<h1>${data}</h1><br/>`;
    });

    $.get('ajax',{action:'getQuantity',id:recipeId},(data,status)=>{
        data = JSON.parse(JSON.parse(data));
        for(a=0;a!=data['liste'].length;a++){
            p = document.createElement('p');
            p.innerHTML = data['liste'][a]+' : '+data[data['liste'][a]]
            document.getElementById('containerQt').appendChild(p);
        }
    });

    $.get('ajax',{action:'getRecipe',id:recipeId},(data,status)=>{
        data = JSON.parse(JSON.parse(data));
        p = document.createElement('p');
        for(a=1;a!=data.etapes+1;a++){   
            p.innerHTML += `<div class="step"><h3 class="stepNum">Étape ${a} :</h3> </div><br><div class="stepContent">${data[a]}</div>\n<br>`;
        }
        document.getElementById('container').appendChild(p);
    });

    $.get('ajax',{action:'getTime',id:recipeId},(data,status)=>{
        data = data.slice(1,-1);
        data = data.split('#');
        p = document.createElement('p');
        p.innerHTML = `<u>Temps de préparation : </u>${data[0]}<br><u>Temps de cuisson : </u>${data[1]}`;
        document.getElementById('containerT').appendChild(p);
    });
}

function deleteRecipe(){
    if(confirm('Voulez vous vraiment supprimer cette recette ?')){
        $.get('ajax',{action:'deleteRecipe',id:recipeId},()=>{});
        document.location.href = 'searchRecipe.html';
    }
}