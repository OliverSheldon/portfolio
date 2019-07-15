<?php

class Address{
    public $houseNameNumber;
    public $street;
    public $village;
    public $townCity;
    public $county;
    public $postcode;
    public $country;
    
    public function __construct($houseNameNumber, $street, $village, $townCity, $county, $postcode, $country){
        $this->houseNameNumber = $houseNameNumber;
        $this->street = $street;
        $this->village = $village;
        $this->townCity = $townCity;
        $this->county = $county;
        $this->postcode = $postcode;
        $this->country = $country;
    }
}