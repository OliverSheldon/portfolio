<?php

abstract class Controller{
    protected $req_method;
    protected $controller;
    protected $action;
    protected $view;
    
    public function __construct(){
        $this->req_method = $GLOBALS["req_method"];
        $this->controller = $GLOBALS["controller"];
        $this->action = $GLOBALS["action"];
        $this->view = $GLOBALS["view"];
    }   
    
    protected function getView(){
        return("./View/".$this->controller."/".$this->view);
    }
}