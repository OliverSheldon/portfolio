<?php
require("class.address.php");

abstract class PersonalDetails{
    protected $personalDetailsID;
    
    public $title;
    public $forename;
    public $surname;
    public $profilePic;
    public $address;
    
    protected function setAddress($params){
        $this->address = new Address(
            $params["houseNameNumber"],
            $params["street"],
            $params["village"],
            $params["townCity"],
            $params["county"],
            $params["postcode"],
            $params["country"]
        );
    }
}