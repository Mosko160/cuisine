function getContent(){
    const urlParams = new URLSearchParams(window.location.search);
    recipeId = urlParams.get('recipe');

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
        //data = JSON.parse(JSON.parse(data));
        data = data.slice(1,-1);
        data = data.split('#');
        p = document.createElement('p');
        p.innerHTML = `<u>Temps de préparation : </u>${data[0]}<br><u>Temps de cuisson : </u>${data[1]}`;
        document.getElementById('containerT').appendChild(p);
    });
}