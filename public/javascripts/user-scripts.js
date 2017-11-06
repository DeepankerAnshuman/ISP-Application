var viewModels = viewModels || {};

(function(models){
    models.MainViewModel = function(){
        var self = this;

        self.Reviews = ko.observableArray([]);
        self.ReviewToView = ko.observable();
        
        self.TopfiveReviews = ko.computed(function(){
            var sortedReviews = self.Reviews().sort(function(left,right){
                return right.CreatedAt() - left.CreatedAt();
            })
            return sortedReviews.slice(0,5);
        });

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
                        distinctISP.find((o, i) => {
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
            var sortedIsp = distinctISPWithAvgRating.sort(function(left, right){
                return right.avgRating - left.avgRating;
            })
            return sortedIsp.slice(0,5);
        });

        //Functions
        self.ViewReview = function(vm){
            self.ReviewToView(vm);
        };
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
        self.City = ko.observable(data ? data.City : undefined);
        self.Area = ko.observable(data ? data.Area : undefined);
        self.Rating = ko.observable(data ? data.Rating: 1);
        self.IsRecommended = ko.observable(data ? data.IsRecommended : true);
        self.IsCurrent = ko.observable(data ? data.IsCurrent : true);
        self.AvgUploadSpeed = ko.observable(data ? data.AvgUploadSpeed: 1);
        self.AvgDownloadSpeed = ko.observable(data ? data.AvgDownloadSpeed : 1);
        self.Email = ko.observable(data ? data.Email : undefined);
        self.Description = ko.observable(data ? data.Description : undefined);
        self.CreatedAt = ko.observable(data ? new Date(data.CreatedAt) : undefined);

        self.ClassForRatingStars = ko.computed(function(){
            return 'star-rating-'+self.Id();
        });

        // self.RatingStars = ko.computed(function(){
        //     var ratingNow = self.Rating();
        //     var id = self.Email();
        //     var cssClass = self.ClassForRatingStars();
        //     var rating = new Rating({
        //         _id: id,
        //         readOnly: true,
        //         field: $('.'+cssClass),
        //         defaultRating: ratingNow
        //     });
        //     return rating;
        // });
        
        self.CreatedAtFormatted = ko.computed(function(){
            if(self.CreatedAt())
                return self.CreatedAt().toDateString();
            else
                return undefined;    
        });
        
        self.IsValid = ko.computed(function(){
            if(!self.ServiceProvider() || !self.City() || !self.Email() || !self.Area() || !self.Rating() || !self.AvgUploadSpeed()
             || !self.AvgDownloadSpeed() || !self.Description()){
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
            self.IsRecommended(true);
            self.IsCurrent(true);
            self.AvgDownloadSpeed(1);
            self.AvgUploadSpeed(1);
            self.Email(undefined);
            self.Description(undefined);
        };

        self.SaveReview = function(){
            if(!self.IsValid()){
                return;
            }
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

    module.Init = function(){
        _vmMain = new viewModels.MainViewModel();
        _vmUser = new viewModels.UserViewMOdel();
        _vmReview = new viewModels.ReviewViewModel();
        this.getMainData();
    }

    module.getMainData = function(){
        $.ajax({
            type: 'GET',
            url: 'index/getReviews',
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

    module.Vm = function(){
        return _vmUser;
    }

    module.VmReview = function(){
        return _vmReview;
    }

    module.VmMain = function(){
        return _vmMain;
    }

    module.BindData = function(reviews){
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


