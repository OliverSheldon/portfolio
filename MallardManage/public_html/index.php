<?php
$uriSeg = explode("/",$_SERVER["REQUEST_URI"]);
if($uriSeg[count($uriSeg) -1] == ""){
    array_pop($uriSeg);
}

$req_method = $_SERVER["REQUEST_METHOD"];
$controller;
$action;

if(file_exists("./View/".$uriSeg[count($uriSeg) -1])){
    $controller = $uriSeg[count($uriSeg) -1];
    $action = "index";
    $view = "index.php";
} else if(file_exists("./View/".$uriSeg[count($uriSeg) -2])){
    $controller = $uriSeg[count($uriSeg) -2];
    $action = $uriSeg[count($uriSeg) -1];
} else{
    $controller = "error";
    $action = "404";
    $view = "404.php";
}

$controllerFile = "./Controller/".$controller."Controller.php";
require($controllerFile);