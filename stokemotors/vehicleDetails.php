<?php
$vehicle;

if(!isset($_SESSION)){
    session_start();

    /*if(!isset($_SESSION['currentVehicle'])){
        $_SESSION['currentVehicle'] = $this;
    }*/
} else{
    if(isset($_SESSION['currentVehicle'])){
        /*$this->wheels = $_SESSION['currentVehicle']->wheels;
        $this->doors = $_SESSION['currentVehicle']->doors;
        $this->price = $_SESSION['currentVehicle']->price;
        $this->type = $_SESSION['currentVehicle']->type;
        $this->model = $_SESSION['currentVehicle']->model;
        $this->year = $_SESSION['currentVehicle']->year;
        $this->make = $_SESSION['currentVehicle']->make;
        $this->badge_img = $_SESSION['currentVehicle']->badge_img;
        $this->fuel = $_SESSION['currentVehicle']->fuel;*/
        $vehicle = $_SESSION['currentVehicle']
    } 
}
?>