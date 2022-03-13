const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const qs = require('querystring');
const sql = require('sqlite3').verbose();

const host = process.argv[2];
const port = process.argv[3];

const RED = '\033[0;31m';
const WHITE = '\033[0m';

if(host == null || port == null){
    console.log(`${RED}Please execute : sudo node --max-http-header-size=1000000 app.js host port`);
    process.exit();
}

const recettesDB = new sql.Database(__dirname+'/database/recettes.sqlite');
const ingredientsDB = new sql.Database(__dirname+'/database/ingredients.sqlite');
const ideasDB = new sql.Database(__dirname+'/database/ideas.sqlite');
const logDB = new sql.Database(__dirname+'/database/log.sqlite');
var start;

const requestListener = function(req,res){
    start = new Date();
    var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress || null;
    file = url.parse(req.url).pathname;
    if(file != '/html/ajax'){
        if(file == '/'){file='/html/index.html';}
        fs.readFile(__dirname+file).then(contents =>{
            fileType = file.split('.')[file.split('.').length - 1];
            switch(fileType){
                case 'html':
                    res.setHeader('Content-Type','text/html');
                    break;
                case 'css':
                    res.setHeader('Content-Type','text/css');
                    break;
                case 'js':
                    res.setHeader('Content-Type','application/javascript');
                    break;
                case 'png':
                    res.setHeader('Content-Type','image/png');
                    break;
            }
            res.writeHead(200);
            res.end(contents);
            log(ip,'getFile',__dirname+'/html'+file,'file',false);
        }).catch(err =>{
            log(ip,'getFile',__dirname+'/html'+file,'ERROR',true);
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not Found\n");
            res.end()
        });
    }else{
        data = qs.parse(url.parse(req.url).query);
        action = data['action'];
        switch (action){
            case 'rechercheIngredient':
                if(data['value'] == ''){
                    res.setHeader('Content-type','text/plain');
                    res.end('none');
                }else{
                    var sql = `select * from ingredients where nom like '${data['value']}%' limit 3;`;
                    var resultsName = [];
                    var resultsId = [];
                    ingredientsDB.all(sql,[],(err,rows)=>{
                        if(err){log(ip,action,sql,err.toString(),true)}
                        else{
                            rows.forEach((row)=>{
                                resultsName.push(row.nom);
                                resultsId.push(row.id)
                            });
                        }
                        res.setHeader('Content-Type','text/plain');
                        res.end(JSON.stringify([resultsName,resultsId]));
                        log(ip,action,sql,JSON.stringify([resultsName,resultsId]),false);
                    });
                }
                break;
            case 'rechercheRecette':
                if(data['value'] != '[]'){
                    ingredients = JSON.parse(data['value']);
                    sql = 'select count(nom) from ingredients;';
                    ingredientsDB.all(sql,[],(err,rows)=>{
                        if(err){log(ip,action,sql,err.toString(),true);}
                        else{
                            log(ip,action,sql,JSON.stringify(rows));
                            rows.forEach((number)=>{
                                var sql = 'select * from recettes where (';
                                for(a=0;a!=ingredients.length;a++){sql+= `code like '%[${ingredients[a]}]/%' or `;}
                                sql = sql.slice(0,-3)+') and (';
                                for(a=1;a!=number['count(nom)']+1;a++){
                                    if(ingredients.indexOf(a) == -1){
                                        sql+=` code not like '%[${a}]/%' and`;
                                    }
                                }
                                sql = sql.slice(0,-3)+');';
                                recettesDB.all(sql,[],(err,rows)=>{
                                    if(err){log(ip,action,sql,err.toString(),true);}
                                    var name=[];
                                    var id=[]
                                    rows.forEach((row)=>{
                                        name.push(row['nom']);
                                        id.push(row['id']);
                                    });
                                    res.setHeader('Content-Type','text/plain');
                                    res.end(JSON.stringify([name,id]));
                                    log(ip,action,sql,JSON.stringify([name,id]),false);
                                });
                            });
                        }
                    });
                }else{
                    res.setHeader('Content-Type','text/plain');
                    res.end('none');
                }
                break;
            case 'getRecipeName':
                sql = `select nom from recettes where id="${data['idRecipe']}";`;
                recettesDB.all(sql,[],(err,row)=>{
                    if(err){log(ip,action,sql,err.toString(),true);}
                    else{
                        if(row[0] != null){
                            res.setHeader('Content-Type','text/plain');
                            res.end(row[0]['nom']);
                            log(ip,action,sql,row[0]['nom'],false);
                        }else{
                            log(ip,action,sql,'recipe doesnt exist',true);
                        }
                    }
                });
            break
            case 'getRecipe':
                id = data['id'];
                sql = `select * from recettes_instructions where id=${id};`;
                recettesDB.all(sql,[],(err,rows)=>{
                    if(err){log(ip,action,sql,err.toString(),true);}
                    else{
                        rows.forEach((row)=>{
                            res.setHeader('Content-Type','text/plain');
                            res.end(JSON.stringify(row['instructions']));
                            log(ip,action,sql,JSON.stringify(row['instructions']),false);
                        });
                    }
                });
                break;
            case 'getQuantity':
                id = data['id'];
                sql = `select * from recettes_ingredients where id=${id};`;
                recettesDB.all(sql,[],(err,rows)=>{
                    if(err){log(ip,action,sql,err.toString(),true);}
                    else{
                        rows.forEach((row)=>{
                            res.setHeader('Content-Type','text/plain');
                            res.end(JSON.stringify(row['ingredients']));
                            log(ip,action,sql,JSON.stringify(row['ingredients']),false);
                        });
                    }
                });
                break;
            case 'getTime':
                id = data['id'];
                sql = `select * from recettes_temps where id=${id};`;
                recettesDB.all(sql,[],(err,rows)=>{
                    if(err){log(ip,action,sql,err.toString(),true);}
                    else{
                        rows.forEach((row)=>{
                            res.setHeader('Content-Type','text/plain');
                            result = JSON.stringify(`${row['temps_preparation']}#${row['temps_cuisson']}`)
                            res.end(result);
                            log(ip,action,sql,result,false);
                        });
                    }
                });
                break;
            case 'addRecipe':
                image = data['image'];
                Rname = data['name'];
                RlistIngredients = data['listIngredients[]'];
                RlistIngredientsNames = data['listNameIngredients[]'];
                Rquantity = data['quantity[]'];           
                Rstep = data['step[]'];
                Rtime = data['time[]'];
                type = data['typeRecipe'];
                code = '';
                for(element of RlistIngredients){
                    code += `[${element}]/`;
                }
                sql = `insert into recettes (nom,code,type,image) values ('${Rname}','${code}','${type}','${image}');`;
                recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                sql = `select id from recettes where nom='${Rname}';`;
                recettesDB.all(sql,[],(err,row)=>{
                    if(err){log(ip,action,sql,err.toString(),true)}
                    else{
                        log(ip,action,sql,JSON.stringify(row),false);
                        id = row[0]['id'];
                        content = '{';
                        if(typeof RlistIngredientsNames != 'string'){
                            for(a=0; a != RlistIngredientsNames.length; a++){content += `"${RlistIngredientsNames[a]}":"${Rquantity[a]}",`;}
                            content += `"liste":[`;
                            for(a=0; a!=RlistIngredientsNames.length; a++){content += `"${RlistIngredientsNames[a]}",`;}
                            content = content.slice(0,-1);
                            content += ']}';
                        }else{
                            content += `"${RlistIngredientsNames}":"${Rquantity}", "liste":["${RlistIngredientsNames}"]}`;
                        }
                        sql = `insert into recettes_ingredients (id,ingredients) values ('${id}','${content}');`;
                        recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                        log(ip,action,sql,'success',false);
                        content = '{';
                        for(a=0;a!=Rstep.length;a++){content += `"${a+1}":"${Rstep[a]}",`;}
                        content += `"etapes":${Rstep.length}}`;
                        sql = `insert into recettes_instructions (id,instructions) values ('${id}','${content}');`;
                        recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                        log(ip,action,sql,'success',false);
                        sql = `insert into recettes_temps (id,temps_preparation,temps_cuisson) values ("${id}","${Rtime[0]}","${Rtime[1]}");`;
                        recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                        log(ip,action,sql,'success',false);
                    }
                });
                log(ip,action,sql,'success',false);
                res.setHeader('Content-Type','text/plain');
                res.end('success');
                break;
            case 'addIngredients':
                Iname = data['value'];
                sql = `insert into ingredients (nom) values ('${Iname}');`;
                ingredientsDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                log(ip,action,sql,'success',false);
                res.setHeader('Content-Type','text/plain');
                res.end('success');
                break;
            case 'searchRecipeByName':
                type = data['type'];
                if(type == 'random'){
                    if(data['recipeType'] == 'none'){sql = 'select id,nom from recettes order by random() limit 5;';}
                    else{sql = `select id,nom from recettes where type='${data['recipeType']}' order by random() limit 5;`;}
                    id = '';
                    names = '';
                    recettesDB.all(sql,[],(err,rows)=>{
                        if(err){log(ip,action,sql,err.toString(),true);}
                        else{
                            rows.forEach(element =>{
                                id+= `"${element['id']}",`;
                                names+= `"${element['nom']}",`;
                            });
                            data = `{"id":[${id.slice(0,-1)}],"name":[${names.slice(0,-1)}]}`;
                            res.setHeader('Content-Type','text/plain');
                            res.end(data);
                            log(ip,action,sql,data,false);
                        }
                    });
                }else{
                    content = data['content'];
                    if(data['recipeType'] == 'none'){sql = `select id,nom from recettes where nom like '%${content}%' limit 5`;}
                    else{sql = `select id,nom from recettes where nom like '%${content}%' and type='${data['recipeType']}' limit 5`;}
                    id = '';
                    names = '';
                    recettesDB.all(sql,[],(err,rows)=>{
                        if(err){log(ip,action,sql,err.toString(),true)}
                        else{
                            rows.forEach(element =>{
                                id+= `"${element['id']}",`;
                                names+= `"${element['nom']}",`;
                            });
                            data = `{"id":[${id.slice(0,-1)}],"name":[${names.slice(0,-1)}]}`;
                            res.setHeader('Content-Type','text/plain');
                            res.end(data);
                            log(ip,action,sql,data,false);
                        }
                    });
                }
                break;
                case 'getIdeas':
                    recipeType = data['type'];
                    sql = '';
                    if(recipeType == 'none'){sql = 'select id,name,link from liste;'}
                    else{sql = `select id,name,link from liste where type="${recipeType}";`}
                    ideasDB.all(sql,[],(err,rows)=>{
                        if(err){log(ip,action,sql,err.toString(),true);}
                        else{
                            ideaName = '';
                            ideaLink = '';
                            ideaId = '';
                            rows.forEach(element =>{
                                ideaName += `"${element['name']}",`;
                                ideaLink += `"${element['link']}",`;
                                ideaId += `"${element['id']}",`;
                            });
                            requestS = `{"names" : [${ideaName.slice(0,-1)}],"links":[${ideaLink.slice(0,-1)}], "id":[${ideaId.slice(0,-1)}]}`;
                            res.setHeader('Content-Type','text/plain');
                            res.end(requestS);
                            log(ip,action,sql,requestS,false);
                        }
                    });
                break;
                case 'deleteIdeas':
                    id = data['id'];
                    sql = `delete from liste where id="${id}";`;
                    ideasDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                    res.setHeader('Content-Type','text/plain');
                    res.end('success');
                break;
                case 'addIdea':
                    sql = `insert into liste (name,link,type) values ("${data['ideaName']}","${data['ideaLink']}","${data['type']}")`;
                    ideasDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                    res.setHeader('Content-Type','text/plain');
                    res.end('success');
                break;
                case 'deleteRecipe':
                    recipeId = data['id'];
                    sql = `delete from recettes where id="${recipeId}";`;
                    recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                    sql = `delete from recettes_ingredients where id="${recipeId}";`;
                    recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                    sql = `delete from recettes_instructions where id="${recipeId}";`;
                    recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                    sql = `delete from recettes_temps where id="${recipeId}";`;
                    recettesDB.all(sql,[],(err)=>{if(err){log(ip,action,sql,err.toString(),true);}});
                    log(ip,action,sql,'success',false);
                break;
                case 'getRecipeImage':
                    recipeId = data['idRecipe'];
                    sql = `select image from recettes where id='${recipeId}'`;
                    recettesDB.all(sql,[],(err,row)=>{
                        if(err){log(ip,action,sql,err.toString(),true)}
                        else{
                            if(row[0] != null){
                                res.setHeader('Content-Type','text/plain');
                                res.end(row[0]['image']);
                                log(ip,action,sql,row[0]['image'],false);
                            }
                        }
                    });
                break; 
                case 'deleteIngredients':
                    ingredientsId = JSON.parse(data['ingredientsId']);
                    sql = 'delete from ingredients where ';
                    for(a=0; a != ingredientsId.length;a++){sql += ` id='${ingredientsId[a]}' or`;}
                    sql = sql.slice(0,-3)+';';
                    ingredientsDB.all(sql,[],(err,row)=>{
                        if(err){log(ip,action,sql,err.toString(),true)}
                        else{
                            res.setHeader('Content-Type','text/plain');
                            res.end('success');
                            log(ip,action,sql,'success',false);
                        }
                    });
                break;
        }
    }
}

const server = http.createServer(requestListener);
server.listen(port,host,()=>{
    console.log(`Server is running on ${host}:${port}`);
});

function log(ip,action,content,result,err){
    let date_ob = new Date();
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var time = `${hours}:${minutes}:${seconds}`;
    var end = new Date() - start;
    var sql  = `insert into log (date,ip,term,action,sql,result,error) values ("${time}-${month}-${year}","${ip}","${end}","${action}","${content.replaceAll('"',"'")}","${result.replaceAll('"',"'")}","${err}");`;
    logDB.all(sql,[],(err)=>{if(err){throw err;}});
    time = `${hours}:${minutes}:${seconds}`;
    Ldata = `${time} | (${end}ms) ${ip} - [${action}] - ${content}`;
    if(err){Ldata = RED +"/!\\ " +Ldata+WHITE;}
    console.log(Ldata)
}