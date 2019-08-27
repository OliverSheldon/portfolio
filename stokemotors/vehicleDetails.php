<?php
require_once(dirname(__FILE__) . "/class/class.search.php");

$search = new Search();

$vehicle=null;

if($_GET){
    if($_GET["v"]){
        $vehicle = $search->getVehicle($_GET["v"]);
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
                <div id="vehicle" class="row">
                    <section class="col-sm-6">
                       <?php
                        if($vehicle != null && $vehicle->vehicleID != null){
                            echo '<article>';
                            echo '<header><picture><img src="img/'.$vehicle->badge_img.'" alt="'.$vehicle->make.'"></picture><h3>'.$vehicle->make.' '.$vehicle->model.'</h3></header>';
                            echo '<picture><img src="img/'.$vehicle->image.'" alt="'.$vehicle->make.' '.$vehicle->model.'"></picture>';
                            echo '</article>';
                        } else{
                            echo '<h2>Error - Vehicle Not Found</h2>';
                        }
                        ?>
                    </section>
                    <section class="col-sm-6">
                        <article id="spec">
                            <?php
                            if($vehicle != null && $vehicle->vehicleID != null){
                            ?>
                            <header><h3>Specification</h3></header>
                            <div>
                                <table>
                                    <tr>
                                        <td>Price</td>
                                        <td>£<?php echo $vehicle->getPrice();?></td>
                                    </tr>
                                    <tr>
                                        <td>Doors</td>
                                        <td><?php echo $vehicle->doors;?></td>
                                    </tr>
                                    <tr>
                                        <td>Wheels</td>
                                        <td><?php echo $vehicle->wheels;?></td>
                                    </tr>
                                    <tr>
                                        <td>Fuel</td>
                                        <td><?php echo $vehicle->fuel;?></td>
                                    </tr>
                                    <tr>
                                        <td>Year</td>
                                        <td><?php echo $vehicle->year;?></td>
                                    </tr>
                                </table>
                            </div>
                            <?php } ?>
                        </article>
                    </section>
                    <a href="./" class="btn col-12 col-md-3 col-lg-2">Back to search</a>
                </div>
            </div>
        </div>
    </main>
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</body>
</html>