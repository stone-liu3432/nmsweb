var fs = require('fs');

fs.readFile('./en.js',(err, data) =>{
    if(err) return err;
    var result = {};
    data = data.toString().slice(data.toString().indexOf('{'), data.toString().indexOf('}') + 1);
    data = eval('(' + data + ')');
    for(var key in data){
        result[key] = '';
    }
    data = 'export default ' + JSON.stringify(result);
    fs.writeFile('./en.js', data, err=>{
        if(err) return err
        console.log('write success');
    })
})