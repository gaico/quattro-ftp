var Client = require('ftp');
const csv=require('csvtojson')

var fs = require('fs');
var dateLastDownloaded = '2018-09-27T11:00:00.000Z'
var c = new Client();

  c.on('ready', function() {
    c.list(function(err, list) {
        if (err) throw err;
        var itemsToDownload = getItemsToDownload(list, dateLastDownloaded);

        itemsToDownload.forEach(file => {
            var newClient = new Client();
            newClient.connect(config);
            newClient.get(`/${file.name}`, function(err, stream) {
                if (err) {
                    console.log('Error downloading file ' + file.name, err);
                }
                if (stream) {
                    stream.once('close', function () {
                        console.log('Finished downloading file ' + file.name);
                        newClient.end();
                    });
                    //stream.pipe(fs.createWriteStream(file.name));

                    csv({
                        noheader: false,
                        delimiter: ["\t"],
                        ignoreEmpty: true
                    }).fromStream(stream).then((jsonObj)=>{
                        console.log(jsonObj);
                    })
                } 
            });
        });
      });
      c.end();
  });
  
  var getItemsToDownload = (list, dateLastDownloaded) => {
    return list.filter(item => {
        return item.type !== 'd' && Date.parse(item.date) > Date.parse(dateLastDownloaded); 
    })
  }

  config =  {
        host: 'ftp.whatever.com',
        port: 21,
        user: '-----',
        password: '-----'
    };

    c.connect(config);