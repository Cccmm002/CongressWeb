var requestUrl="congressRequest.php";

$(document).ready(function(){
    $('.carousel').carousel('pause');
    $('#legDetailReturn').click(function(){
        $(".carousel").carousel('prev');
        $('.carousel').carousel('pause');
    });
    $("#navButton").click(function(){
        if($("nav").css("display")==="none") {
            $("nav").css("display","block");
            $(".rightBox").css("margin-left",$("nav").css("width"));
        }
        else {
            $("nav").css("display","none");
            $(".rightBox").css("margin-left","0");
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

app.controller('legDetailsPanelController', function($scope, $http){
    $scope.legislator=null;
    
    this.detailShow=function(bioguide_id){
        $http.get(requestUrl + "?database=legislators&id=" + bioguide_id.substr(1)).then(function(response){
            $scope.legislator=response.data;
        });
        
        $(".carousel").carousel('next');
        $('.carousel').carousel('pause');
    };
    
    $scope.formatTime=function(time){
        return moment(time,"YYYY-MM-DD").format("MMM D, YYYY");
    };
    
    $scope.getProgress=function(start,end){
        var s=moment(start,"YYYY-MM-DD");
        var e=moment(end,"YYYY-MM-DD");
        var total=e.diff(s);
        var past=moment().diff(s);
        var res=100*past/total;
        return Math.floor(res);
    };

});