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
            p.innerHTML += `<h3>Étape ${a} :</h3> ${data[a]}\n<br>`;
        }
        document.getElementById('container').appendChild(p);
    });

    $.get('ajax',{action:'getTime',id:recipeId},(data,status)=>{
        //data = JSON.parse(JSON.parse(data));
        data = data.slice(1,-1);
        data = data.split('#');
        p = document.createElement('p');
        p.innerHTML = `Temps de préparation : ${data[0]}, temps de cuisson : ${data[1]}`;
        document.getElementById('containerT').appendChild(p);
    });
}