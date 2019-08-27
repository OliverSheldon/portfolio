<?php
class Vehicle{
    
    public $vehicleID;
    public $wheels;
    public $doors;
    protected $price;
    public $type;
    public $model;
    public $year;
    public $image;
    public $make;
    public $badge_img;
    public $fuel;
    
    public function __construct($vehicle = null){
        if($vehicle != null){
            $this->vehicleID = $vehicle['vehicleID'];
            $this->wheels = $vehicle['wheels'];
            $this->doors = $vehicle['doors'];
            $this->price = $vehicle['price'];
            $this->type = $vehicle['type'];
            $this->model = $vehicle['model'];
            $this->year = $vehicle['year'];
            $this->image = $vehicle['image'];
            $this->make = $vehicle['make'];
            $this->badge_img = $vehicle['badge_img'];
            $this->fuel = $vehicle['fuel'];
        }
    }
    
    public function getPrice(){
        return $this->price;
    }
}
?>