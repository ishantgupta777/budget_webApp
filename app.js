var budgetcontroller = (function(){

    var Expense = function(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    };
    var Income = function(id, description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum=0;
        data[type].forEach(element => {
            sum+=element.value;
        });
        data['total' + type] = sum;
    };

    var data = {
        exp :[] ,
        inc : [],
        totalinc : 0,
        totalexp : 0,
        budget : 0,
        percentage : -1
    };

    return{

        getBudget : function(){
            var object = {
                totalinc : data.totalinc,
                totalexp : data.totalexp,
                percentage : data.percentage,
                budget : data.budget
            };
            return object;
        },

        getPercentages : function(){
            var list = data.exp.map(function(current){
                return current.percentage;
            })
            return list;
        },
    
        domStrings : function(){
            var strings;
            strings = {
                description : document.querySelector('.add__description'),
                button : document.querySelector('.add__btn'),
                value : document.querySelector('.add__value'),
                type : document.querySelector('.add__type')
              }
            return strings;

        },

        newitem : function(type, description,value){
            var newObject,id;

            if(data[type].length===0)
            {
                id = 0;
            }else{
                id = data[type][data[type].length-1].id + 1;
            }

            if(type==='exp'){
                newObject = new Expense(id,description,value);
            }else
            {
                newObject = new Income(id,description,value);
            }
            data[type].push(newObject);
            return newObject;
        },

        expPercenCal : function(){

                data.exp.forEach(function(object){
                    if(data.totalinc >  0){
                        var percentage = ((object.value/data.totalinc)*100).toFixed(2);
                        object.percentage = percentage + '%';
                    }
                    else
                    object.percentage = '---';
                    
                });
                
        },

        updateBudget : function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.totalinc - data.totalexp;
            var expPercentage = ((data.totalexp/data.totalinc)*100).toFixed(2);
            if(data.totalinc > 0){
                data.percentage = expPercentage + '%';
            }else{
                data.percentage = '---';
            }
            
        },

        removeItem : function(type,ids){
                var list = data[type].map(function(current){
                    return current.id;
                });
                var index = list.indexOf(ids);
                data[type].splice(index,1);
        },
        
        testing : function(){
            console.log(data);
        }
    }

})();



var UIController = (function(){

    var domStrings2 = {
        totalinc : document.querySelector('.budget__income--value'),
        totalexp : document.querySelector('.budget__expenses--value'),
        budget : document.querySelector('.budget__value'),
        percentage : document.querySelector('.budget__expenses--percentage')
    }

    

    return{
        listitem : function(newObject,type){

         var html,element;
         if(type==='inc')
         {
             element = document.querySelector('.income__list');
             html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }
         else
         {
             element= document.querySelector('.expenses__list');
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
         }

         var newHtml = html.replace('%id%', newObject.id);
          newHtml = newHtml.replace('%description%', newObject.description);
          newHtml = newHtml.replace('%value%', parseInt(newObject.value));
          element.insertAdjacentHTML('beforeend', newHtml );
          document.querySelector('.add__description').value="";
          document.querySelector('.add__value').value="";
          document.querySelector('.add__type').value='inc';
          document.querySelector('.add__description').focus();
        },

        showBudget : function(inc,exp,percentage,budget){
            domStrings2.totalinc.textContent = inc;
            domStrings2.totalexp.textContent = exp;
            domStrings2.percentage.textContent = percentage;
            domStrings2.budget.textContent = budget;
        },

        showPercentage : function(percentage){
            var list = document.querySelectorAll('.item__percentage');
            list = Array.prototype.slice.call(list);
            list.forEach(function(current, index){
                current.textContent = percentage[index];
            });
        },
        displayMonth : function(){
            var date = new Date();
            var month = date.getMonth();
            var year = date.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            document.querySelector('.budget__title--month').textContent =months[month] + ' ' + year;
        }

    }

})();



var  globalController  = (function(){

    var domStrings = budgetcontroller.domStrings();
    function additem(){
       var type = domStrings.type.value;
       var description = domStrings.description.value;
       var value = parseInt(domStrings.value.value);
       if(value  && description){
       var newObject = budgetcontroller.newitem(type,description,value);
       UIController.listitem(newObject,type);
      commontask();
    }
    };
    function commontask(){
        budgetcontroller.updateBudget();
        budgetcontroller.expPercenCal();
    var percentages =  budgetcontroller.getPercentages();
       UIController.showPercentage(percentages);
   var object = budgetcontroller.getBudget();
   UIController.showBudget(object.totalinc,object.totalexp,object.percentage,object.budget);
    }
    function deleteitem(event){
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            var element = document.querySelector('#'+id);
            element.parentNode.removeChild(element);
           var idItems = id.split('-');
           var type = idItems[0];
           var id = parseInt(idItems[1]);
           budgetcontroller.removeItem(type,id);
         commontask();
    }

    function evetListener(){
        domStrings.button.addEventListener('click', additem);
        document.addEventListener('keypress',function(event){
            if(event.which==13 || event.keyCode===13)
            {
                additem();
            }
        })
        document.querySelector('.container').addEventListener('click',deleteitem);
    };

    return {
       init : function(){
            evetListener();
            UIController.showBudget(0,0,'---',0);
            UIController.displayMonth();
       }
    };

})(budgetcontroller,UIController);

globalController.init();