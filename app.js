const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const qs = require('querystring');
const sql = require('sqlite3').verbose();

const host = '127.0.0.1';
const port = 80;

const recettesDB = new sql.Database(__dirname+'/database/recettes.sqlite');
const ingredientsDB = new sql.Database(__dirname+'/database/ingredients.sqlite');

const requestListener = function(req,res){
    file = url.parse(req.url).pathname;
    if(file != '/ajax'){
        if(file == '/'){file='/index.html';}
        fs.readFile(__dirname+'/html'+file).then(contents =>{
            res.setHeader('Content-Type','text/html');
            res.writeHead(200);
            res.end(contents);
        });
    }else{
        data = qs.parse(url.parse(req.url).query);
        switch (data['action']){
            case 'rechercheIngredient':
                var sql = `select * from ingredients where nom like '${data['value']}%' limit 3;`;
                var resultsName = [];
                var resultsId = [];
                ingredientsDB.all(sql,[],(err,rows)=>{
                    if(err){throw err}
                    else{
                        rows.forEach((row)=>{
                            resultsName.push(row.nom);
                            resultsId.push(row.id)
                        });
                    }
                    res.end(JSON.stringify([resultsName,resultsId]));
                });
                break;
            case 'rechercheRecette':
                ingredients = JSON.parse(data['value']);
                sql = 'select count(nom) from ingredients;';
                ingredientsDB.all(sql,[],(err,rows)=>{
                    if(err){throw err;}
                    else{
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
                                if(err){throw err;}
                                var name=[];
                                var id=[]
                                rows.forEach((row)=>{
                                    name.push(row['nom']);
                                    id.push(row['id']);
                                });
                                console.log(JSON.stringify([name,id]));
                                res.end(JSON.stringify([name,id]));
                            });
                        });
                    }
                });
                break;
            case 'getRecipe':
                id = data['id'];
                sql = `select * from recettes_instructions where id=${id};`;
                recettesDB.all(sql,[],(err,rows)=>{
                    if(err){throw err;}
                    else{
                        rows.forEach((row)=>{
                            res.end(JSON.stringify(row['instructions']));
                        });
                    }
                });
                break;
            case 'getQuantity':
                id = data['id'];
                sql = `select * from recettes_ingredients where id=${id};`;
                recettesDB.all(sql,[],(err,rows)=>{
                    if(err){throw err;}
                    else{
                        rows.forEach((row)=>{
                            res.end(JSON.stringify(row['ingredients']));
                        });
                    }
                });
                break;
        }
    }
    
}

const server = http.createServer(requestListener);
server.listen(port,host,()=>{
    console.log(`Server is running on ${host}:${port}`)
});