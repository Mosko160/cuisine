$(function(){
    $("#stepList").load("/htmlObject/addStep.html"); 
});

step = 1;
function addStep(){
    step += 1;
    li = document.createElement('li');
    ta = document.createElement('textarea');
    li.id = 'liStep'+step;
    ta.id = 'taStep'+step;
    ta.setAttribute('onfocusout',"testEmpty('"+step+"')");
    li.appendChild(ta);
    document.getElementById('ulStep').appendChild(li)
}

function testEmpty(id){
    if(document.getElementById('taStep'+id).value == ""){
        document.getElementById('liStep'+id).remove();
        step -= 1;
    }
}