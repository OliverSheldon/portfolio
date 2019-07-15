<?php
require("class.controller.php");
require("./Model/class.user.php");

class UserController extends Controller{
    private $user;
    public function __construct(){
        parent::__construct();
        if($this->req_method == "GET"){
            $this->user = new User();
            require($this->getView());
        }

        if($this->req_method == "POST"){
            $this->user = new User();
            var_dump(get_object_vars($this->user));
            echo "<br><br>";
            var_dump($_POST);
            require($this->getView());
        }
    }
}

new UserController();