var TODO_LIST = (function() {

  var els = {
    todoList: document.querySelector(".todo-list"),
    addItem: document.querySelector(".add-item"),
    userInput: document.querySelector(".user-input"),
    // deleteBtn: document.querySelector(".button")
  }

  var templates = {
    item: document.getElementById("item").innerHTML
  }

  var appCache = getAppData();

  function getAppData() {
    return JSON.parse(localStorage.getItem("todo")) || {
      items: []
    };
  }

  function saveData() {
    localStorage.setItem("todo", JSON.stringify(appCache));
  }

  function bindEventHandlers() {

    var listItems = els.todoList.querySelectorAll("li");
    var itemAdderEl = els.addItem;

    function bind(el, handler, callback, params) {

      el[handler] = function(e) {
        callback(e, params || {});
      }

    }

    bind(itemAdderEl, "onsubmit", addItem);

    // Binding handlers to each listItem

    var li, id, checkbox, content, remove;

    for (var i = 0; i < listItems.length; i++) {

      li = listItems[i];
      id = li.id;
      checkbox = li.querySelector(".status");
      content = li.querySelector(".content");
      remove = li.querySelector(".delete");

      bind(checkbox, "onchange", function(e, params) {

        updateStatus(e, parseInt(params.id));

      }, {id: id});

      bind(content, "onblur", function(e, params) {

        editItem(e, parseInt(params.id), params.item);

      }, {id: id, item: li});

      bind(remove, "onclick", function(e, params) {

        deleteItem(parseInt(params.id));

      }, {id: id});


    }

  }

  function renderTodoList() {

    function listItem(item) {

      var template = Handlebars.compile(templates.item);

      var li = document.createElement('li');
      li.className = "todo-item";
      li.id = item.id;
      li.innerHTML = template(item);
      return li;

    }

    els.todoList.innerHTML = "";

    var completedTasks = [];
    var uncompletedTasks = [];
    var items;



    for (var i = 0; i < appCache.items.length; i++) {
      if (appCache.items[i].taskIsComplete) {
        completedTasks.push(appCache.items[i])
      } else {
        uncompletedTasks.push(appCache.items[i])
      }
    }

    items = completedTasks.concat(uncompletedTasks);

    for (var i = items.length -1; i >= 0; i--) {
      els.todoList.appendChild(listItem(items[i]));
    }

    if (items.length > 1) {
      // els.deleteBtn.classList.toggle("hidden");
    }

  }

  function addItem(e) {

    // e.preventDefault();

    var items = appCache.items;

    if (els.userInput.value.length > 0) {

      appCache.items.push(
        {
          content: els.userInput.value,
          taskIsComplete: false,
          id: items.length === 0 ? 1 : items[items.length - 1].id + 1
        }
      )

      els.userInput.value = "";

      saveData();
      renderTodoList();
      bindEventHandlers();

    }

  }

  function deleteItem(id) {
    console.log("Deleting item...");
    for (var i = 0; i < appCache.items.length; i++) {
      if (appCache.items[i].id === id) {
        console.log(appCache.items);
        appCache.items.splice(i, 1);
        saveData();
        renderTodoList();
        bindEventHandlers();
      }
    }
  }

  function updateStatus(e, id, item) {

    var itemData;

    for (var i = 0; i < appCache.items.length; i++) {

      if (appCache.items[i].id === id) {

        itemData = appCache.items[i];

        if (e.target.checked === true) {
          itemData.taskIsComplete = true;
        } else if (e.target.checked === false) {
          itemData.taskIsComplete = false;
        }

        saveData();
        renderTodoList();
        bindEventHandlers();
      }
    }


  }

  function editItem(e, id) {

    for (var i = 0; i < appCache.items.length; i++) {

      if (appCache.items[i].id === id) {

        itemData = appCache.items[i];
        itemData.content = e.target.innerHTML;
        console.log(id);
        saveData();
        renderTodoList();
        bindEventHandlers();
      }
    }

  }


  return {
    init: function() {
      getAppData();
      renderTodoList();
      bindEventHandlers();
    },
    version: "1.0"
  }


}())

TODO_LIST.init();
