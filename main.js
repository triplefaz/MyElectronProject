var electron = require('electron');
var {ipcRenderer} = electron;

ipcRenderer.on("item:add", function(e,item){

    var newItem = document.createElement('li');
    newItem.innerHTML = `${item.name} - ${item.desc} - ${item.place}`
    
    console.log(item)
    document.getElementById("list").appendChild(newItem);
})
