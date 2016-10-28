var requestUrl="congressRequest.php";

$(document).ready(function(){
    $("#navButton").click(function(){
        if($("nav").css("display")==="none") {
            $("nav").css("display","block");
            $(".rightBox").css("margin-left",$("nav").css("width"));
            //$(".rightBoxPage").css("width","calc(100% - 180px)");
        }
        else {
            $("nav").css("display","none");
            $(".rightBox").css("margin-left","0");
            //$(".rightBoxPage").css("width","calc(100% - 30px)");
        }
    });
});

var app=angular.module('congressApp', ['angularUtils.directives.dirPagination','ui.bootstrap','ngAnimate']);

app.controller('mainTabController', function(){
    this.nav_tab=1;
    this.selectTab=function(setTab){
        this.nav_tab=setTab;
    };
    this.isSelected=function(tab){
        return this.nav_tab===tab;
    };
});

app.controller('legislatorTableController', function($scope, $http){
    
    $http.get(requestUrl + "?database=states").then(function(response){
        $scope.stateNames=response.data;
    });
    
    $http.get(requestUrl + "?database=legislators").then(function(response){
        $scope.people=response.data.results;
    });
    
});