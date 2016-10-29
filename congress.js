var requestUrl="congressRequest.php";

$(document).ready(function(){
    $('.carousel').carousel('pause');
    $('#legDetailReturn').click(function(){
        $("#legis").carousel('prev');
        $('#legis').carousel('pause');
    });
    $('#billDetailReturn').click(function(){
        $('#billsCarousel').carousel('prev');
        $('#billsCarousel').carousel('pause');
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
    $('#byState a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $('#byHouse a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $('#bySenate a').click(function(e){
        e.preventDefault();
        $(this).tab('show');
    });
    $('#activeBills a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#newBills a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#comByHouse a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#comBySenate a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#comByJoint a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
});

var app=angular.module('congressApp', ['angularUtils.directives.dirPagination','ngAnimate']);

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

app.controller('billsTableController',function($scope,$http){
    
    $http.get(requestUrl + "?database=bills").then(function(response){
        $scope.bills=response.data.results;
    });
    
    $scope.upper=function(str){
        if(str)
            return str.toUpperCase();
    };
    
});

app.controller('committeeTableController',function($scope,$http){
    
    $http.get(requestUrl + "?database=committees").then(function(response){
        $scope.committees=response.data;
    });
    
});

app.controller('legDetailsPanelController', function($scope, $http){
    $scope.legislator=null;
    
    this.detailShow=function(bioguide_id){
        $http.get(requestUrl + "?database=legislators&id=" + bioguide_id.substr(1)).then(function(response){
            $scope.legislator=response.data;
        });
        
        $("#legis").carousel('next');
        $('#legis').carousel('pause');
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

app.controller('billsPanelController',function($scope,$http){
    $scope.bill=null;
    
    this.detailShow=function(bill_id){
        $http.get(requestUrl + "?database=bills&id=" + bill_id.substr(1)).then(function(response){
            $scope.bill=response.data;
        });
        $('#billsCarousel').carousel('next');
        $('#billsCarousel').carousel('pause');
    };
    
    $scope.upper=function(str){
        if(str)
            return str.toUpperCase();
    };
    
    $scope.timeFormat=function(time){
        var t=moment(time,"YYYY-MM-DD");
        return t.format("MMM D, YYYY");
    };
    
});