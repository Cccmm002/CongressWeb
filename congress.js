var requestUrl="congressRequest.php";

function addStorage(database,id,obj) {
    if(!existStorage(database,id)) {
        var str=localStorage.getItem(database)?localStorage.getItem(database):"{\"record\":[]}";
        var jp=JSON.parse(str);
        jp["record"].push(obj);
        if(!localStorage.getItem(database))
            localStorage.removeItem(database);
        localStorage.setItem(database,JSON.stringify(jp));
    }
}

function removeStorage(database,id) {
    if(localStorage.getItem(database)){
        var str=localStorage.getItem(database);
        var arr=JSON.parse(str);
        var len=arr["record"].length;
        var index=-1;
        for(var i=0;i<len;i++) {
            if(arr["record"][i]["id"]===id) {
                index=i;
                break;
            }
        }
        if(index>=0) {
            arr["record"].splice(index,1);
        }
        localStorage.removeItem(database);
        localStorage.setItem(database,JSON.stringify(arr));
    }
}

function existStorage(database,id) {
    if(!localStorage.getItem(database))
        return false;
    var str=localStorage.getItem(database);
    var obj=JSON.parse(str);
    var len=obj["record"].length;
    for(var i=0;i<len;i++) {
        if(obj["record"][i]["id"]===id)
            return true;
    }
    return false;
}

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
    $('#favLeg a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#favBill a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
    $('#favCom a').click(function(e){
        e.preventDefault();
        $(this).show('show');
    });
});

var app=angular.module('congressApp', ['angularUtils.directives.dirPagination','ngAnimate']);

app.controller('mainTabController', function($scope,$http){
    
    $scope.nav_tab=1;
    
    this.selectTab=function(setTab){
        if(setTab===4)
            $scope.$broadcast("fav");
        $scope.nav_tab=setTab;
    };
    
    this.isSelected=function(tab){
        return $scope.nav_tab===tab;
    };
    
    $scope.$on("favDetail",function(d,tab,id){
        $scope.nav_tab=tab;
        if(tab===1) 
            $scope.$broadcast("leg",id);
        else
            $scope.$broadcast('bill',id);
    });
    
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
    
    this.setFavorite=function(id) {
        var iid=id.substr(1);
        var len=$scope.committees.length;
        for(var i=0;i<len;i++) {
            if($scope.committees[i]["committee_id"]!=iid)
                continue;
            var l={};
            l["id"]=$scope.committees[i]["committee_id"];
            l["chamber"]=$scope.committees[i]["chamber"];
            l["name"]=$scope.committees[i]["name"];
            l["parent_committee_id"]=$scope.committees[i]["parent_committee_id"];
            l["subcommittee"]=$scope.committees[i]["subcommittee"];
            addStorage("coms",iid,l);
        }
    };
    
    this.isFavorite=function(id) {
        return existStorage("coms",id.substr(1));
    };
    
    this.removeFavorite=function(id) {
        removeStorage('coms',id.substr(1));
    };
    
});

app.controller('legFavoriteController',function($scope,$http){
    
    $scope.loadData=function(){
        
        var obj=JSON.parse(localStorage.getItem("legislators"));
        $scope.legs=obj["record"];
        
    };
    
    this.legFavDetail=function(id){
        $scope.$emit("favDetail",1,id);
    };
    
    this.deleteFav=function(id){
        removeStorage("legislators",id.substr(1));
        $scope.loadData();
    };
    
    $scope.$on("fav",function(d){
        $scope.loadData();
    });
    
});

app.controller('billFavoriteController',function($scope,$http){
    
    $scope.loadData=function(){
        
        var obj=JSON.parse(localStorage.getItem("bills"));
        $scope.bills=obj["record"];
        
    };
    
    this.billFavDetail=function(id){
        $scope.$emit("favDetail",2,id);
    };
    
    this.deleteFav=function(id){
        removeStorage("bills",id.substr(1));
        $scope.loadData();
    };
    
    $scope.$on("fav",function(d){
        $scope.loadData();
    });
    
    $scope.upper=function(str){
        if(str)
            return str.toUpperCase();
    };
    
});

app.controller('comFavoriteController',function($scope,$http){
    
    $scope.loadData=function(){
        
        var obj=JSON.parse(localStorage.getItem("coms"));
        $scope.coms=obj["record"];
        
    };
    
    this.deleteFav=function(id){
        removeStorage("coms",id.substr(1));
        $scope.loadData();
    };
    
    $scope.$on("fav",function(d){
        $scope.loadData();
    });
    
    $scope.upper=function(str){
        if(str)
            return str.toUpperCase();
    };
    
});

app.controller('legDetailsPanelController', function($scope, $http){
    $scope.legislator=null;
    
    $scope.detailShow=function(bioguide_id){
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
    
    $scope.$on("leg",function(d,id){
        $scope.detailShow(id);
    });
    
    this.setFavorite=function(id) {
        var l={};
        l["id"]=$scope.legislator.personal["bioguide_id"];
        l["party"]=$scope.legislator.personal["party"];
        l["title"]=$scope.legislator.personal["title"];
        l["first_name"]=$scope.legislator.personal["first_name"];
        l["last_name"]=$scope.legislator.personal["last_name"];
        l["chamber"]=$scope.legislator.personal["chamber"];
        l["state_name"]=$scope.legislator.personal["state_name"];
        l["oc_email"]=$scope.legislator.personal["oc_email"];
        addStorage("legislators",id.substr(1),l);
    };
    
    this.isFavorite=function(id) {
        return existStorage("legislators",id.substr(1));
    };
    
    this.removeFavorite=function(id) {
        removeStorage('legislators',id.substr(1));
    };

});

app.controller('billsPanelController',function($scope,$http){
    $scope.bill=null;
    
    $scope.detailShow=function(bill_id){
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
    
    $scope.$on("bill",function(d,id){
        $scope.detailShow(id);
    });
    
    this.setFavorite=function(id) {
        var l={};
        l["id"]=$scope.bill["bill_id"];
        l["bill_type"]=$scope.bill["bill_type"];
        l["official_title"]=$scope.bill["official_title"];
        l["first_name"]=$scope.bill.sponsor["first_name"];
        l["last_name"]=$scope.bill.sponsor["last_name"];
        l["chamber"]=$scope.bill["chamber"];
        l["title"]=$scope.bill.sponsor["title"];
        l["introduced_on"]=$scope.bill["introduced_on"];
        addStorage("bills",id.substr(1),l);
    };
    
    this.isFavorite=function(id) {
        return existStorage("bills",id.substr(1));
    };
    
    this.removeFavorite=function(id) {
        removeStorage('bills',id.substr(1));
    };
    
});