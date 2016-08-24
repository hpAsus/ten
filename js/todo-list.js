/*
 AJAX
 1. Create todo-list application with simple interface. Application should look like page with 4 areas.
 Each area should load data via AJAX from 'data[N].json' file (where N - number from 1 to 4).
 Data for 1st area should load with delay in 1 sec, ...,  for 4th area - in 4 sec.
 */

(function () {

    function TodoList(optionsObj) {
        this._defaults = {
            id: '1',
            prefix: 'area',
            loadDelay: 1 * 1000,
            dataFile: null,
            dataFolder: 'data/'
        };
        this.options = _.pick(_.defaults(optionsObj, this._defaults), _.keys(this._defaults));
        this.container = document.getElementById(this.options.prefix + this.options.id);
        this.loader = this.addLoader(this.container, 'loader' + this.options.id);
    }

    // Loader functions
    //==================================================================================================================
    TodoList.prototype.addLoader = function (element, id) {
        var loaderFragment = document.createDocumentFragment();
        var loader = document.createElement('div');
        var spin = document.createElement('div');
        loader.className = 'loader';
        loader.id = id;
        spin.className = 'spin';
        loader.appendChild(spin);
        loaderFragment.appendChild(loader);
        element.appendChild(loaderFragment);
        return id;
    };
    TodoList.prototype.removeLoader = function () {
        var loader = document.getElementById(this.loader);
        this.container.removeChild(loader);
    };

    // Fetch Data
    //==================================================================================================================
    TodoList.prototype.fecthData = function (dataFile) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', self.options.dataFolder.concat(dataFile), true);
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
    };

    // Fetch Data
    //==================================================================================================================
    TodoList.prototype.loadTodos = function () {
        var self = this;
        return new Promise(function (resolve, reject) {
            if (self.options.dataFile) {
                self.fecthData(self.options.dataFile)
                    .then(function (data) {
                        resolve(data);
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            } else {
                reject('No data file specified.');
            }
        });
    };

    // Process Data
    //==================================================================================================================
    TodoList.prototype.processTodos = function (jsonData) {
        var data = JSON.parse(jsonData);
        var container = document.createDocumentFragment();
        var listContents = document.createDocumentFragment();
        var title, list;
        title = document.createElement('div');
        title.className = 'todo-list-title';
        title.innerText = data.title;
        list = document.createElement('ul');
        list.className = 'todolist';

        _.forEach(data.tasks, function (todo) {
            var listItem, listTitle, icon, text;
            listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            listItem.classList.add((todo.done) ? 'completed' : 'incomplete');
            listTitle = document.createElement('h3');
            listTitle.className = 'todo-title';
            icon = document.createElement('i');
            icon.classList.add('icon');
            icon.classList.add((todo.done) ? 'icon-completed' : 'icon-incomplete');
            text = document.createElement('span');
            text.className = 'todo-text';
            text.innerText = todo.title;
            listTitle.appendChild(icon);
            listTitle.appendChild(text);

            listItem.appendChild(listTitle);
            listContents.appendChild(listItem);
        });

        list.appendChild(listContents);
        container.appendChild(title);
        container.appendChild(list);
        this.container.appendChild(container);
        return data.title;
    };

    // Render Error
    //==================================================================================================================
    TodoList.prototype.renderMessage = function (text, type) {
        var container = document.createElement('div');
        container.classList.add('message');
        container.classList.add('message-' + type);
        container.innerText = text;
        return container;
    };

    function createTodoRegion(options) {
        var list = new TodoList(options);
        list.loadTodos()
            .then(function (data) {
                setTimeout(function () {
                    list.removeLoader();
                    list.processTodos(data);
                }, list.options.loadDelay);
            }).catch(function (err) {
            setTimeout(function () {
                list.removeLoader();
                list.container.appendChild(list.renderMessage(err, 'error'));
            }, list.options.loadDelay);
        });
    }


    // Create Lists
    //==================================================================================================================
    var list1 = {
        id: '1',
        dataFile: 'data1.json'
    };
    var list2 = {
        id: '2',
        loadDelay: 2 * 1000,
        dataFile: 'data2.json'
    };
    var list3 = {
        id: '3',
        loadDelay: 3 * 1000,
        dataFile: 'data3.json'
    };
    var list4 = {
        id: '4',
        loadDelay: 4 * 1000,
        dataFile: 'data4.json'
    };

    createTodoRegion(list1);
    createTodoRegion(list2);
    createTodoRegion(list3);
    createTodoRegion(list4);

})();

