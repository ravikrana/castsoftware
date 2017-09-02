var webApp = angular.module('webApp',['ngMaterial'])
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})
.service('technologyService', function($http,$q) {
		
			this.getRepository = function(language,page){

			var deferred=$q.defer();
			$http({'method':'GET','url':'https://api.github.com/search/repositories?q='+language+'&page='+page+'&per_page=9'})
				.success(function(data,status,header,config){
					deferred.resolve(data);
				})
            .error(function(data,status,header,config){
                deferred.reject(status);

            });
				return deferred.promise;
			};
			
			this.getOwnerProfile = function(url){

			var deferred=$q.defer();
			$http({'method':'GET','url':url})
				.success(function(data,status,header,config){
					deferred.resolve(data);
				})
            .error(function(data,status,header,config){
                deferred.reject(status);

            });
				return deferred.promise;
			};
			
			this.getUserRepository = function(url,page){

			var deferred=$q.defer();
			$http({'method':'GET','url':url+'?page='+page+'&per_page=9'})
				.success(function(data,status,header,config){
					deferred.resolve(data);
				})
            .error(function(data,status,header,config){
                deferred.reject(status);

            });
				return deferred.promise;
			};
			
			this.getUserFollower = function(url,page){

			var deferred=$q.defer();
			$http({'method':'GET','url':url+'?page='+page+'&per_page=9'})
				.success(function(data,status,header,config){
					deferred.resolve(data);
				})
            .error(function(data,status,header,config){
                deferred.reject(status);

            });
				return deferred.promise;
			};
			
		});
webApp.controller('MainController',function($scope,$filter,technologyService){
	
	console.log = function() {}
	$scope.message="Hello";
	$scope.currentUrl = "technology.tpl.html";
	
	var getCurrentUrl = function(){
		return $scope.currentUrl;
	}
	$scope.techologyList = ["javascript","python","ruby","java"];
	$scope.languageList=[{name:"python",valueElem:501666},{name:"ruby",valueElem:16650},{name:"java",valueElem:67850},{name:"c#",valueElem:43150},{name:"javascript",valueElem:9850}];
	
	/*Repo Function*/
	$scope.sortMechanism = ["score","size","created_at"];
	$scope.loadRepo = false;
	$scope.selectedLanguage = null;
	$scope.getRepository = function(language){
		$scope.selectedLanguage = language;
		$scope.loadRepo = true;
		technologyService.getRepository(language,$scope.currentPage).then(function(data){
			console.log(data);
			$scope.currentUrl = "repository.tpl.html";
			$scope.selectedRepoList = data;
			$scope.loadRepo = false;
		})
	}

	
	/*pagination*/
	$scope.currentPage = 0;
    $scope.pageSize = 9;

    
    $scope.getData = function () {
	  $scope.currentPage = 0;
      $scope.loadRepo = true;
	  $scope.currentUrl = "repository.tpl.html";
      technologyService.getRepository($scope.selectedLanguage,$scope.currentPage).then(function(data){
			$scope.selectedRepoList = data;
			
			$scope.loadRepo = false;
		})
     
    }
	$scope.goBackRepo =function(){
		$scope.selectedOwner = null;
		$scope.currentUrl = "repository.tpl.html";
		$scope.currentPageUser = 0;
		
	}
	$scope.goBackHome = function(){
		$scope.currentUrl = "technology.tpl.html";
		$scope.selectedRepoList = null;
		$scope.currentPage = 0;
	}
	
	$scope.decrement = function(statusValue){
		if(statusValue){
		$scope.currentPage = $scope.currentPage - 1;
		$scope.getData();
		}
		
	}

	$scope.increment = function(statusValue){
		if(statusValue){
			$scope.currentPage = $scope.currentPage+1;
			$scope.getData();
		}
		
	}
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.selectedRepoList.total_count/$scope.pageSize);                
    }
	

	$scope.getDataUser = function () {
      $scope.loadRepo = true;
      technologyService.getUserRepository($scope.selectedOwner.repos_url,$scope.currentPageUser).then(function(data){
			$scope.selectedOwner.repoData = data;
			$scope.loadRepo = false;
		})
     
    }
	$scope.incrementUser = function(statusValue){
		if(statusValue){
		$scope.currentPageUser = $scope.currentPageUser+1;
		$scope.getDataUser();
		}
		
	}
	$scope.currentPageUser = 0;
	$scope.decrementUser = function(statusValue){
		if(statusValue){
		$scope.currentPageUser = $scope.currentPageUser - 1;
		$scope.getDataUser();
		}
		
	}
	
	$scope.getDataFollower =function(){
		$scope.loadRepo = true;
		technologyService.getUserFollower($scope.selectedOwner.followers_url,$scope.currentPageFollower).then(function(data1){
			$scope.selectedOwner.followerList= data1;
			$scope.loadRepo = false;
		});
	}
	$scope.incrementFollower = function(statusValue){
		if(statusValue){
		$scope.currentPageFollower = $scope.currentPageFollower+1;
		$scope.getDataFollower();
		}
		
	}
	$scope.currentPageFollower = 0;
	$scope.decrementFollower = function(statusValue){
		if(statusValue){
		$scope.currentPageFollower = $scope.currentPageFollower - 1;
		$scope.getDataFollower();
		}
		
	}
	
	$scope.numberOfPagesUser=function(){
        return Math.ceil($scope.selectedOwner.userProfile.public_repos/$scope.pageSize);                
    }
	
	$scope.numberOfPagesFollower=function(){
        return Math.ceil($scope.selectedOwner.userProfile.followers/$scope.pageSize);                
    }
	
	
	/*Page 3*/
	$scope.selectOwner =function(owner){
		$scope.currentPageUser = 0;
		console.log(owner);
		$scope.currentUrl = "owner.tpl.html";
		$scope.selectedOwner = owner;
		technologyService.getOwnerProfile(owner.url).then(function(data){
			owner.userProfile= data;
			technologyService.getUserRepository(owner.repos_url,$scope.currentPageUser).then(function(data1){
			owner.repoData= data1;
			
		
		});
		});
		
		
	}
	
	$scope.selectTab =function(owner,type){
		if(type == 'followers'){
			technologyService.getUserFollower(owner.followers_url,$scope.currentPageUser).then(function(data1){
			owner.followerList= data1;
			
		});
		}
	}
});

