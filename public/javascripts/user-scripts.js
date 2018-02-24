var viewModels = viewModels || {};

var cities = ['Bangalore','Delhi','Hyderabad','Kolkata','Mumbai','Pune','Chennai'];
var sortOptions = ['Rating(High to low)', 'Rating(Low to high)'];

(function(models){
    models.MainViewModel = function(){
        var self = this;
        self.AreaToSearch = ko.observable(undefined);
        self.ReviewSearchString = ko.observable(undefined);

        self.SortOptions = ko.observableArray(sortOptions);
        self.SortBy = ko.observable();
        
        self.AvailableCities = ko.observableArray(cities);
        self.SelectedCity = ko.observable();
        self.SelectedCity.subscribe(function(){
            if(self.SelectedCity() || self.AreaToSearch())
                AppModule.getMainData();
        });
        self.SelectedCity.valueHasMutated();

        self.Reviews = ko.observableArray([]);
        self.ReviewToView = ko.observable();
        
        self.TopfiveReviews = ko.observableArray([]);

        self.SearchResults = ko.computed(function(){
            if(!self.ReviewSearchString() || self.ReviewSearchString() == ''){
                var sortedReviews = self.Reviews().sort(function(left,right){
                    return right.CreatedAt() - left.CreatedAt();
                })
                self.TopfiveReviews(sortedReviews.slice(0,50));
            }else{
                var result = ko.utils.arrayFilter(self.Reviews(), function (rec) {  
                    return (  
                              (self.ReviewSearchString().length == 0 || rec.ServiceProvider().toLowerCase().indexOf(self.ReviewSearchString().toLowerCase()) > -1)  
                           )          
                });
                self.TopfiveReviews(result); 
            }            
        }, self);

        self.Sorter = ko.computed(function(){
            var result;
            if(self.SortBy() === sortOptions[1]){
                result = self.TopfiveReviews().sort(function(left, right){
                    return left.Rating() - right.Rating();
                });
            }else{
                result = self.TopfiveReviews().sort(function(left, right){
                    return right.Rating() - left.Rating();
                });
            }
            self.TopfiveReviews(result); 
        }, self);

        self.TopFiveIsp = ko.computed(function(){
            var distinctISP = [];
            var distinctISPWithAvgRating = [];
            
            ko.utils.arrayForEach(self.Reviews(), function(item){
                if(distinctISP.length != 0)
                {                    
                    var isPresent = distinctISP.some(function(element){
                        return element.isp == item.ServiceProvider();
                    });
                    
                    if(isPresent)
                    {
                        distinctISP.find(function(o,i){
                            if (o.isp === item.ServiceProvider()) {
                                o.ratings.push(item.Rating());
                                distinctISP[i] = { isp: item.ServiceProvider(), ratings: o.ratings };
                                return true; // stop searching
                            }
                        });
                    }
                    else
                    {
                        distinctISP.push({isp: item.ServiceProvider(), ratings: [item.Rating()]});
                    }
                }
                else
                {
                    distinctISP.push({isp: item.ServiceProvider(), ratings: [item.Rating()]});
                }
            });

            ko.utils.arrayForEach(distinctISP, function(item, i){
                var avgRating= 0;
                var ratingSum = 0;
                var ratingCount = 0;
                ko.utils.arrayForEach(item.ratings, function(rating, i){
                    ratingSum += rating;
                    ratingCount = i+1;
                })
                averageRating = (ratingSum/ratingCount).toFixed(1); 
                // Math.round(ratingSum/ratingCount);
                distinctISPWithAvgRating.push({isp: item.isp, avgRating: averageRating});
            });
            distinctISPWithAvgRating.sort(function(left, right){
                return right.avgRating - left.avgRating;
            })
            return distinctISPWithAvgRating.slice(0,5);
        });

        //Functions
        self.ViewReview = function(vm){
            self.ReviewToView(vm);
        };

        self.GetMainData = function(){

        }
    }

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

    models.ReviewViewModel = function(data){
        var self = this;
        self.Id = ko.observable(data ? data._id : undefined);
        self.Author = ko.observable(data ? data.Author : undefined);
        self.ServiceProvider = ko.observable(data ? data.ServiceProvider : undefined);
        self.AvailableCities = ko.observableArray(cities);
        self.City = ko.observable(data ? data.City : undefined);
        self.Area = ko.observable(data ? data.Area : undefined);
        self.Rating = ko.observable(data ? data.Rating: 1);
        self.IsRecommended = ko.observable(data ? data.IsRecommended ? 'true' : 'false' : 'true');
        self.IsCurrent = ko.observable(data ? data.IsCurrent ? 'true' : 'false' : 'true');
        self.AvgUploadSpeed = ko.observable(data ? data.AvgUploadSpeed: 1);
        self.AvgDownloadSpeed = ko.observable(data ? data.AvgDownloadSpeed : 1);
        self.Email = ko.observable(data ? data.Email : undefined);
        self.Description = ko.observable(data ? data.Description : undefined);
        self.CreatedAt = ko.observable(data ? new Date(data.CreatedAt) : undefined);
        self.IsInCreateMode = ko.observable(false);
        self.ErrorMessage = ko.observable(undefined);
        
        self.CreatedAtFormatted = ko.computed(function(){
            if(self.CreatedAt())
                return self.CreatedAt().toDateString();
            else
                return undefined;    
        });
        
        
        self.IsValid = ko.computed(function(){
            if(!self.ServiceProvider() || !self.City() || !self.Email() || !self.Area() || !self.Rating() || !self.AvgUploadSpeed()
             || !self.AvgDownloadSpeed() || !self.Description()){
                self.ErrorMessage('fillAll'); 
                return false;
            }
            if(self.City() == 'Select one'){
                self.ErrorMessage('selectCity');
                return false;
            }
            else
                return true;
        });

        self.ResetReview = function(){
            self.ServiceProvider(undefined);
            self.City(undefined);
            self.Area(undefined);
            self.Rating(1);
            self.IsRecommended('true');
            self.IsCurrent('true');
            self.AvgDownloadSpeed(1);
            self.AvgUploadSpeed(1);
            self.Email(undefined);
            self.Description(undefined);
            self.IsInCreateMode(true);
        };

        self.RatingUp = function(){
            var createRating = parseInt(self.Rating());
            if(createRating < 5){
                $("#rating").fadeToggle(10);                
                self.Rating(createRating + 1);
                $("#rating").fadeToggle(400);                
            }else{
                self.Rating(createRating);
            }
        };

        self.RatingDown = function(){
            var createRating = parseInt(self.Rating());
            if(createRating > 1){
                $("#rating").fadeToggle(10);
                self.Rating(createRating - 1);
                $("#rating").fadeToggle(400);
            }else{
                self.Rating(createRating);
            }
        };

        self.SaveReview = function(){
            if(!self.IsValid()){
                return;
            }
            self.IsInCreateMode(false);
            var data = ko.toJSON(self);
            $.ajax({
                type: 'POST',
                url: 'index/createReview',
                dataType: 'json',
                data: {"data": data},
                success: function(result){
                    self.ResetReview();
                    $('#addReviewModal').modal('hide');
                    $("#putmessage").html('You have succesfully added the review');
                    $("#successModal").modal('show');
                    AppModule.getMainData();                    
                },
                error: function(jqXHR, textStatus, err) {
                    $('#validation-error').css("visibility", "visible");;
                    $('#validation-error-span').html('Error:' + jqXHR.responseText);                    
                }
            });
        }
    }
    
})(viewModels);


var AppModule = AppModule || {};

(function(module){
    var _vmMain = {};
    var _vmUser = {};
    var _vmReview = {};

    module.Init = function(cityToPreselect){
        _vmMain = new viewModels.MainViewModel();
        _vmMain.SelectedCity(cityToPreselect);
        _vmUser = new viewModels.UserViewMOdel();
        _vmReview = new viewModels.ReviewViewModel();
        _vmReview.IsInCreateMode(true);
        this.getMainData();
    }    

    module.Vm = function(){
        return _vmUser;
    }

    module.VmReview = function(){
        return _vmReview;
    }

    module.VmMain = function(){
        return _vmMain;
    }

    module.getMainData = function(){
        var city;
        var area;

        if(!AppModule.VmMain().SelectedCity() && !AppModule.VmMain().AreaToSearch()){
            AppModule.BindData();
            AppModule.InitializeKnockout();
            return;
        }
        
        if(AppModule.VmMain().SelectedCity()){
            city = AppModule.VmMain().SelectedCity() === 'Select City' ? 'all' : AppModule.VmMain().SelectedCity();
        }else{
            city = 'all';
        }

        area = AppModule.VmMain().AreaToSearch() && AppModule.VmMain().AreaToSearch() != '' ? AppModule.VmMain().AreaToSearch() : 'all';
        $.ajax({
            type: 'GET',
            url: 'index/getReviews',
            data: {
                'city': city,
                'area': area
            },
            dataType: 'json',                
            success: function(reviews){
                // ini
                AppModule.BindData(reviews);
                AppModule.InitializeKnockout();
            },
            error: function(jqXHR, textStatus, err) {
                console.log(err);                    
            }
        });
    };

    module.BindData = function(reviews){
        if(!reviews){
            return;
        }

        var jsonReviews = reviews;
        var mappedReviews = ko.utils.arrayMap(jsonReviews, function(item) {
            return new viewModels.ReviewViewModel(item);
        });
        AppModule.VmMain().Reviews(mappedReviews);
    }
    
    module.InitializeKnockout = function(){
        ko.applyBindings(AppModule.Vm(), $('#SignUpModal')[0]);
        ko.applyBindings(AppModule.Vm(), $('#loginModal')[0]);
        ko.applyBindings(AppModule.VmReview(), $('#addReviewModal')[0]);
        ko.applyBindings(AppModule.VmMain(), $('#main')[0]);
    }
})(AppModule);


