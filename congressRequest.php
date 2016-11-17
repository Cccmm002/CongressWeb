<?php 
    //$url_prefix="http://congress.api.sunlightfoundation.com/";
    $url_prefix="http://104.198.0.197:8080/";
    $api_key="57fab857ce45488ba9ee33d6f73665b1";
    $database="";
    if($_GET["database"])
        $database=$_GET["database"];
    if($_GET["id"]) {
        if($_GET["database"]=="legislators")
            getLegislatorDetail($_GET["id"],$url_prefix,$api_key);
        else if($_GET["database"]=="bills")
            getBillDetail($_GET["id"],$url_prefix,$api_key);
        else if($_GET["database"]=="committees")
            getComDetail($_GET["id"],$url_prefix,$api_key);
        else if($_GET["database"]=="legislators_favorites")
            getLegislatorFavorite($_GET["id"],$url_prefix,$api_key);
        else if($_GET["database"]=="bills_favorites")
            getBillFavorite($_GET["id"],$url_prefix,$api_key);
        else if($_GET["database"]=="coms_favorites")
            getCommitteeFavorite($_GET["id"],$url_prefix,$api_key);
    }
    else {
        if($_GET["database"]=="states")
            getStateNames($url_prefix,$api_key);
        else if($_GET["database"]=="legislators") 
            getTotalLegislators($url_prefix,$api_key);
        else if($_GET["database"]=='bills') {
            if(file_exists("bills.json")) {
                echo file_get_contents("bills.json");
            }
            else {
                $active=getBills($url_prefix,$api_key,'true');
                $new=getBills($url_prefix,$api_key,'false');
                $data=array();
                $data["results"]=array_merge($active["results"],$new["results"]);
                $data["count"]=$active["count"]+$new["count"];
                $json_data=json_encode($data);
                file_put_contents("bills.json", $json_data);
                echo $json_data;
            }
        }
        else if($_GET["database"]=="committees") {
            if(file_exists("committees.json")) {
                echo file_get_contents("committees.json");
            }
            else {
                $url=$url_prefix . "committees?per_page=all&apikey=" . $api_key;
                $obj=json_decode(file_get_contents($url));
                $res=json_encode($obj->results);
                file_put_contents("committees.json", $res);
                echo $res;
            }
        }
    }

    function getLegislatorFavorite($id,$url_prefix,$api_key) {
        $arr=explode(",", $id);
        $data=array();
        foreach($arr as &$str) {
            if($str=="" || $str==" ")
                continue;
            $rec=array();
            $url=$url_prefix . "legislators?bioguide_id=" . $str . "&apikey=" . $api_key;
            $obj=json_decode(file_get_contents($url));
            if($obj->count==0)
                continue;
            $rec["bioguide_id"]=$obj->results[0]->bioguide_id;
            $rec["party"]=$obj->results[0]->party;
            $rec["first_name"]=$obj->results[0]->first_name;
            $rec["last_name"]=$obj->results[0]->last_name;
            $rec["middle_name"]=$obj->results[0]->middle_name;
            $rec["chamber"]=$obj->results[0]->chamber;
            $rec["state_name"]=$obj->results[0]->state_name;
            $rec["oc_email"]=$obj->results[0]->oc_email;
            array_push($data, $rec);
        }
        echo json_encode($data);
    }

    function getBillFavorite($id,$url_prefix,$api_key) {
        $arr=explode(",", $id);
        $data=array();
        foreach($arr as &$str) {
            if($str=="" || $str==" ")
                continue;
            $rec=array();
            $url=$url_prefix . "bills?bill_id=" . $str . "&apikey=" . $api_key;
            $obj=json_decode(file_get_contents($url));
            if($obj->count==0)
                continue;
            $rec["bioguide_id"]=$obj->results[0]->bill_id;
            $rec["bill_type"]=$obj->results[0]->bill_type;
            $rec["official_title"]=$obj->results[0]->official_title;
            $rec["chamber"]=$obj->results[0]->chamber;
            $rec["introduced_on"]=$obj->results[0]->introduced_on;
            $rec["sponsor"]=$obj->results[0]->sponsor;
            array_push($data, $rec);
        }
        echo json_encode($data);
    }

    function getCommitteeFavorite($id,$url_prefix,$api_key) {
        $arr=explode(",", $id);
        $data=array();
        foreach($arr as &$str) {
            if($str=="" || $str==" ")
                continue;
            $rec=array();
            $url=$url_prefix . "committees?committee_id=" . $str . "&apikey=" . $api_key;
            $obj=json_decode(file_get_contents($url));
            if($obj->count==0)
                continue;
            $rec["committee_id"]=$obj->results[0]->committee_id;
            $rec["name"]=$obj->results[0]->name;
            $rec["chamber"]=$obj->results[0]->chamber;
            $rec["parent_committee_id"]=$obj->results[0]->parent_committee_id;
            $rec["subcommittee"]=$obj->results[0]->subcommittee;
            array_push($data, $rec);
        }
        echo json_encode($data);
    }

    function getComDetail($id,$url_prefix,$api_key) {
        $url=$url_prefix . "committees?committee_id=" . $id . "&apikey=" . $api_key;
        $obj=json_decode(file_get_contents($url));
        $data=$obj->results[0];
        echo json_encode($data);
    }

    function getBillDetail($id,$url_prefix,$api_key) {
        $url=$url_prefix . "bills?bill_id=" . $id . "&apikey=" . $api_key;
        $obj=json_decode(file_get_contents($url));
        $data=$obj->results[0];
        echo json_encode($data);
    }

    function getBills($url_prefix,$api_key,$active) {
        $data=array();
        $data["results"]=array();
        $url=$url_prefix . "bills?history.active=" . $active . "&apikey=" . $api_key;
        //bill_id, bill_type, title, chamber, introduced_on, sponsor
        $json=file_get_contents($url);
        $obj=json_decode($json);
        $count=$obj->count;
        $total_count=0;
        $p=1;
        while($total_count<$count && $total_count<50) {
            $urlRequest=$url . "&page=" . $p;
            $json=file_get_contents($urlRequest);
            $obj=json_decode($json);
            $c=$obj->page->count;
            $j=0;
            while($j<$c) {
                $rec=array();
                $rec["bill_id"]=$obj->results[$j]->bill_id;
                $rec["bill_type"]=$obj->results[$j]->bill_type;
                $rec["official_title"]=$obj->results[$j]->official_title;
                $rec["chamber"]=$obj->results[$j]->chamber;
                $rec["introduced_on"]=$obj->results[$j]->introduced_on;
                $rec["sponsor"]=$obj->results[$j]->sponsor;
                $rec["active"]=$obj->results[$j]->history->active;
                array_push($data["results"], $rec);
                $total_count=$total_count+1;
                $j=$j+1;
            }
            $p=$p+1;
        }
        $data["count"]=$total_count;
        return $data;
    }

    function getLegislatorDetail($id,$url_prefix,$api_key) {
        $data=array();
        $persoanlRequestUrl=$url_prefix . "legislators?bioguide_id=" . $id . "&apikey=" . $api_key;
        $obj=json_decode(file_get_contents($persoanlRequestUrl));
        $data["personal"]=$obj->results[0];
        $comRequestUrl=$url_prefix . "committees?member_ids=" . $id . "&apikey=" . $api_key;
        $committees=json_decode(file_get_contents($comRequestUrl));
        $data["committees"]=array();
        $com_count=$committees->count;
        $i=0;
        while($i<$com_count && $i<5) {
            array_push($data["committees"], $committees->results[$i]);
            $i=$i+1;
        }
        $billReqestUrl=$url_prefix . "bills?sponsor_id=" . $id . "&apikey=" . $api_key;
        $bills=json_decode(file_get_contents($billReqestUrl));
        $data["bills"]=array();
        $bill_count=$bills->count;
        $i=0;
        while($i<$bill_count && $i<5) {
            $cur=array(
                "bill_id" => $bills->results[$i]->bill_id,
                "official_title" => $bills->results[$i]->official_title,
                "chamber" => $bills->results[$i]->chamber,
                "bill_type" =>$bills->results[$i]->bill_type,
                "congress" => $bills->results[$i]->congress,
                "urls" => $bills->results[$i]->last_version->urls,
            );
            array_push($data["bills"],$cur);
            $i=$i+1;
        }
        echo json_encode($data);
    }

    function getStateNames($url_prefix,$api_key) {
        $arr=["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","US Virgin Islands","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
        echo json_encode($arr);
    }

    function getTotalLegislators($url_prefix,$api_key) {
        if(file_exists("legislators.json")) {
            echo file_get_contents("legislators.json");
        }
        else {
            $data=array();
            $data["results"]=array();
            //bioguide_id, party, name, chamber, district, state
            $requestUrl=$url_prefix . "legislators" . "?order=state__asc,last_name__asc&apikey=" . $api_key;
            $json=file_get_contents($requestUrl);
            $obj=json_decode($json);
            $count=$obj->count;
            $total_count=0;
            $p=1;
            while($total_count<$count) {
                $requestUrl=$url_prefix . "legislators" . "?order=state__asc,last_name__asc&apikey=" . $api_key . "&page=" . $p;
                $json=file_get_contents($requestUrl);
                $obj=json_decode($json);
                $c=$obj->page->count;
                $j=0;
                while($j<$c) {
                    $rec=array();
                    $rec["bioguide_id"]=$obj->results[$j]->bioguide_id;
                    $rec["party"]=$obj->results[$j]->party;
                    $rec["first_name"]=$obj->results[$j]->first_name;
                    $rec["last_name"]=$obj->results[$j]->last_name;
                    $rec["middle_name"]=$obj->results[$j]->middle_name;
                    $rec["chamber"]=$obj->results[$j]->chamber;
                    $rec["district"]=$obj->results[$j]->district;
                    $rec["state_name"]=$obj->results[$j]->state_name;
                    array_push($data["results"], $rec);
                    $total_count=$total_count+1;
                    $j=$j+1;
                }
                $p=$p+1;
            }
            $data["count"]=$total_count;

            $json_data=json_encode($data);
            file_put_contents("legislators.json", $json_data);
            echo $json_data;
        }
    }
?>
