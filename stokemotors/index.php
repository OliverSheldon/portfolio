<?php
require_once("/class/class.search.php");

$search = new Search();

//var_dump($vehicle);
//echo "<br><br>";
if($_GET){
    $filters = explode("&",$_SERVER['QUERY_STRING']);
    /*if(count($filters) > 1){
        
    } else{
        if(isset($_GET['type'])){
            switch($_GET['type']){
                case 'car':
                    var_dump($search->getType('car'));
                    break;
                case 'van':
                    var_dump($search->getType('van'));
                    break;
                case 'all':
                    var_dump($search->getAll());
                    break;
                default:
                    var_dump($search->getAll());
                    break;
            }
        }
    }*/
    var_dump($search->filterAll($filters));
}else{
    //var_dump($search->getAll());
}

?>
<a href="./?type=car">Search for cars</a>
<a href="./?type=van">Search for vans</a>
<a href="./?type=all">Search all</a>
<a href="./">Reset Filters</a>