<?php
$vehicle=null;

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
        $vehicle = $_SESSION['currentVehicle'];
    } 
}
?>
<!Doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="Description" content="Vehicle Dealership">
    <title>Home</title>

    <link type="text/css" rel="stylesheet" href="css/bootstrap/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="css/main.css">
</head>

<body>
    <header>
        <div>
            <h1>Stoke Motors</h1>
        </div>
    </header>
    <main class="container-fluid">
        <div class="main-wrapper">
            <div class="container">
                <div class="row">
                    <section class="col-xs-12">
                        <?php
                        if($vehicle != null){
                            echo '<div class="card hero">';
                            echo '<h2>'.$vehicle->make.' '.$vehicle->model.'</header>';
                            echo '<picture><img src="img/'.$vehicle->image.'" alt="'.$vehicle->make.' '.$vehicle->model.'"></picture>';
                            echo '<h3>£'.$vehicle->getPrice().'</footer>';
                            echo '</div>';
                        }
                        ?>
                    </section>
                </div>
            </div>
        </div>
    </main>
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</body>
</html>