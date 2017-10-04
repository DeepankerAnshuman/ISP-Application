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
                        self.userCreated(true);
                    },
                    error: function(jqXHR, textStatus, err) {
                        //show error message
                        self.userCreated(false);
                    }
                });
            }
            
        };
    }

    models.ReviewViewModel = function(){
        var self = this;

        self.ServiceProvider = ko.observable();
        self.City = ko.observable();
        self.Area = ko.observable();
        self.Rating = ko.observable(0);
        self.IsRecommended = ko.observable(true);
        self.IsCurrent = ko.observable(true);
        self.AvgUploadSpeed = ko.observable(0);
        self.AvgDownloadSpeed = ko.observable(0);
        self.Email = ko.observable();
        self.Description = ko.observable();

        self.SaveReview = function(){
            var data = ko.toJSON(self);
            $.ajax({
                type: 'POST',
                url: 'index/createReview',
                dataType: 'json',
                data: {"data": data},
                success: function(result){
                    alert('result');
                },
                error: function(jqXHR, textStatus, err) {
                    //show error message
                    alert('user could not be created');
                }
            });
        }
    }
    
})(viewModels);


var AppModule = AppModule || {};

(function(module){
    var _vmUser = {};
    var _vmReview = {};

    module.Init = function(){
        _vmUser = new viewModels.UserViewMOdel();
        _vmReview = new viewModels.ReviewViewModel();
    }

    module.Vm = function(){
        return _vmUser;
    }

    module.VmReview = function(){
        return _vmReview;
    }

    // module.BindData = function(data){
        
    // }
})(AppModule);


