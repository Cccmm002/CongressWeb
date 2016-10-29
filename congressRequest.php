<?php 
    $url_prefix="http://congress.api.sunlightfoundation.com/";
    $api_key="57fab857ce45488ba9ee33d6f73665b1";
    $database="";
    if($_GET["database"])
        $database=$_GET["database"];
    if($_GET["id"]) {
        if($_GET["database"]=="legislators")
            getLegislatorDetail($_GET["id"],$url_prefix,$api_key);
    }
    else {
        if($_GET["database"]=="states")
            getStateNames($url_prefix,$api_key);
        else if($_GET["database"]=="legislators") 
            getTotalLegislators($url_prefix,$api_key);
    }

    function getLegislatorDetail($id,$url_prefix,$api_key) {
        $data=array();
        $persoanlRequestUrl=$url_prefix . "legislators" . "?bioguide_id=" . $id . "&apikey=" . $api_key;
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
                "urls" => $bills->results[$i]->urls,
            );
            array_push($data["bills"],$cur);
            $i=$i+1;
        }
        echo json_encode($data);
    }

    function legSortHelper($a, $b) {
        return strnatcmp($a["state_name"],$b["state_name"]);
    }

    function getStateNames($url_prefix,$api_key) {
        $arr=["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","US Virgin Islands","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
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
            $requestUrl=$url_prefix . "legislators" . "?apikey=" . $api_key;
            $json=file_get_contents($requestUrl);
            $obj=json_decode($json);
            $count=$obj->count;
            $total_count=0;
            $p=1;
            while($total_count<$count) {
                $requestUrl=$url_prefix . "legislators" . "?apikey=" . $api_key . "&page=" . $p;
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

            //usort($data["results"],"legSortHelper");

            $json_data=json_encode($data);
            file_put_contents("legislators.json", $json_data);
            echo $json_data;
        }
    }
?>