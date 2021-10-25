const MyPlugin = (function(){
    /* ------- begin view -------- */
    function ModalView() {

        let openBtns = null;            

        this.init = function() {
          openBtns = document.querySelectorAll(['a[data-supermodal]']);//вычитываем все имеющиеся кнопки-ссылки, по которым должны открываться модалки
          this.getWindows(); //ф-я проходится по кнопкам и ищет у них data-supermodal-title и data-supermodal-content, а также ищет верстку по id
        }

        this.show = (elem) => {
          elem.classList.remove('modal_closed');
          elem.setAttribute('data-open', 'true'); // при открытии модалки ей добавляется атрибут data-open=true, потом по нему находится элемент, который будет закрываться
        }

        this.hide = (elem) => {
          elem.classList.add('modal_closed');
          elem.setAttribute('data-open', 'false');
        }

        this.setContent = function(div,info) {
		//на вход получаем элемент верстки и у него ищем элементы с атрибутом data-info
          let contentElem = div.querySelectorAll('[data-info]'); 
          if (contentElem) { //если находим, то из переданного объекта info подставляем значения
            contentElem.forEach(function(elem) {
                let name = elem.getAttribute('data-info');
                if (elem.getAttribute('data-info') == 'title') {
                  elem.innerHTML = info.title;
                }
                if (elem.getAttribute('data-info') == 'content') {
                  elem.innerHTML = info.content;
                }
            });
          }
        }


        this.getWindows = () => {
          let id, title, content;
		// проходимся по всем кнопкам из коллекции openBtns и вычитываем значения их свойств data-supermodal-title и data-supermodal-content
          for (let i = 0; i < openBtns.length; i++) {
              if (openBtns[i].getAttribute('data-supermodal-title')) {
                  title = openBtns[i].getAttribute('data-supermodal-title');
              }
              if (openBtns[i].getAttribute('data-supermodal-content')) {
                  content = openBtns[i].getAttribute('data-supermodal-content');
              }
              id = openBtns[i].getAttribute('data-supermodal'); // в переменную id записываем значение атрибута data-supermodal
              if (!document.getElementById(id)) { 
			  //если в документе не находится верстка по ид, указанному в атрибуте data-supermodal, то создается новый блок, но он пока спрятан
                this.createModal(id, title, content);  
              }
          };
        }

        this.createModal = (id, title, content) => { // создание верстки, тут объяснять нечего :)
          let overlay = document.createElement('div');
              overlay.classList.add('modal-overlay', 'modal_closed');
              overlay.id = id;
          let modalDiv = document.createElement('div');
              modalDiv.classList.add('modal', 'overlay-default');
          let header = document.createElement('h2');
              header.innerHTML = title;
          let modalDivContent = document.createElement('div');
              modalDivContent.innerHTML = content;
          let closeElement = document.createElement('a');
              closeElement.setAttribute('href', '#');
              closeElement.classList.add('modal__close', 'close');
          document.body.append(overlay);
          overlay.append(modalDiv);
          modalDiv.append(header);
          modalDiv.append(closeElement);
          modalDiv.append(modalDivContent);
        }
    };
    /* -------- end view --------- */

    /* ------- begin model ------- */
	//модель тут вообще служит исключительно посредником - никаких особых действий, кроме вызова функций вью она не выполняет
    function ModalModel () {
        
        let myModalView = null;

        this.init = function(view) {
          myModalView = view;
        }

        this.openModal = (elem) => myModalView.show(elem);

        this.closeModal = (elem) => myModalView.hide(elem);

        this.setContent = function(div,info) {
           myModalView.setContent(div,info);
        }
    }
    /* -------- end model -------- */

    /* ----- begin controller ---- */
    function ModalController () {        
        let myModalModel = null;
        let openBtns = null;
        let closeBtns = null;        

        this.init = function(model) { // получаем кнопки и вешаем обработчики
          myModalModel = model;          
          openBtns = document.querySelectorAll(['a[data-supermodal]']);
          closeBtns = document.querySelectorAll('.close');;
          
          this.addListeners();
        }

        this.addListeners = () => {
            openBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => { // проходимся по кнопка и назначаем на них обработчики
                    e.preventDefault();
                    let div = document.getElementById(btn.getAttribute('data-supermodal'));  //сохраняем в переменную элемент верстки, с которым связана кнопка
                    if (div) {
                        this.getContent(btn,div);  // функция получает контент из кнопки и передает в верстку
                    }
                    myModalModel.openModal(div); // ф-я открывает верстку, сохраненную в div					
                });
            });

            closeBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    myModalModel.closeModal(document.querySelector('[data-open = true]')); // закрываем div, у которого [data-open = true]
                });
            });
        }

        this.getContent = (btn,div) => {
          let info = {};
          info.title = btn.getAttribute('data-supermodal-title');
          info.content = btn.getAttribute('data-supermodal-content');
          if (info.title || info.content) {
            myModalModel.setContent(div,info);
          }
        }
    }

    /* ------ end controller ----- */
    return {
        
        init: function () {
            this.main();   

            const appModalView = new ModalView();
            const appModalModel = new ModalModel();
            const appModalController = new ModalController();

            appModalView.init();  
            appModalModel.init(appModalView); 
            appModalController.init(appModalModel);
        },

        main: function () {
            //предварительно что то можно сделать, например
            console.log(`Modal plugin  was initialized.`);
        },
    }
}());