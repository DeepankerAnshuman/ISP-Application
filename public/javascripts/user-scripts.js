var viewModels = viewModels || {};

(function(models){
    models.UserViewMOdel = function(){
        var self = this;

        self.FirstName = ko.observable();
        self.LastName = ko.observable();
        self.Email = ko.observable();
        self.Password = ko.observable('');
        self.PasswordConfirm = ko.observable('');
        self.IsValid = ko.computed(function(){
            if(!self.FirstName() || !self.LastName() || !self.Email() || !self.Password() || !self.PasswordConfirm()){
                return false;
            }
            else
                return true;
        });
        self.IsPasswordMatching = ko.computed(function(){
            if((self.Password().length != 8)&&(self.PasswordConfirm().length != 8)&&(self.Password() != self.PasswordConfirm())){
                return false;
            }
            else
                return true;
        });

        self.userCreated = function(isSuccess){
            self.FirstName('');
            self.LastName('');
            self.Email('');
            self.Password('');
            self.PasswordConfirm('');
            $("#SignUpModal").modal('hide');
            if(isSuccess){
                $("#putmessage").html('User has been created successfully. Please login using the user name and password.');
                $("#successModal").modal('show');
            }
            else{
                $("#putmessage").html('User creation failed. Please try again...');
                $("#successModal").modal('show');
            }
        }

        self.CreateNewUser = function(){
            if(!self.IsValid()){
                return;
            }

            if(!self.IsPasswordMatching()){
                return;
            }    

            if(self.IsValid() && self.IsPasswordMatching()){
                var data = {"firstname": self.FirstName(), "lastname": self.LastName(),"email": self.Email(), "password": self.Password()};
                $.ajax({
                    type: 'POST',
                    url: 'users/AddUser',
                    dataType: 'json',
                    data: data,
                    success: function(result){
                        userCreated(true);
                    },
                    error: function(jqXHR, textStatus, err) {
                        //show error message
                        userCreated(false);
                    }
                });
            }
            
        };
    }
    
})(viewModels);


var AppModule = AppModule || {};

(function(module){
    var _vm = {};

    module.Init = function(){
        _vm = new viewModels.UserViewMOdel();
    }

    module.Vm = function(){
        return _vm;
    }

    // module.BindData = function(data){
        
    // }
})(AppModule);


