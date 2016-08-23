/*
 AJAX

 1. Create todo-list application with simple interface. Application should look like page with 4 areas.
 Each area should load data via AJAX from 'data[N].json' file (where N - number from 1 to 4).
 Data for 1st area should load with delay in 1 sec, ...,  for 4th area - in 4 sec.
 */

(function () {

    var options = {
        dataFolder: 'data/',
        loadDelay1: 1 * 1000,
        loadDelay2: 2 * 1000,
        loadDelay3: 3 * 1000,
        loadDelay4: 4 * 1000
    }

    function fecthData(dataFile) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', options.dataFolder.concat(dataFile), true);
            xhr.send();

            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status != 200) {
                    reject(xhr.status + ': ' + xhr.statusText);
                } else {
                    resolve(xhr.responseText);
                }

            };
        });
    }

    fecthData('data1.json')
        .then(function (data) {
            document.write(data);
        })
        .catch(function (err) {
            document.write(err);
        });


})();

