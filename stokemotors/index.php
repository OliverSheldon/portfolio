<?php
require_once(dirname(__FILE__) . "/class/class.search.php");

$search = new Search();

$vehicleList;

if($_GET){
    $filters = explode("&",$_SERVER['QUERY_STRING']);

    $vehicleList = $search->filterAll($filters);
}else{
    $vehicleList = $search->getAll();
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
                    <header class="col-12 search">
                        <h2>Search</h2>
                        <div class="row">
                                <article class="col-sm-6 col-md-4">
                                    <a href="./?type=car">
                                        <div class="card hero">
                                            <header><h3>Search Cars</h3></header>
                                            <picture>
                                                <img src="img/car.png" alt="car">
                                            </picture>
                                        </div>
                                    </a>
                                </article>
                                <article class="col-sm-6 col-md-4">
                                    <a href="./?type=van">
                                        <div class="card hero">
                                            <header><h3>Search Vans</h3></header>
                                            <picture>
                                                <img src="img/van.jpg" alt="van">
                                            </picture>
                                        </div>
                                    </a>
                                </article>
                                <article class="col-sm-6 col-md-4">
                                    <a href="./?type=all">
                                        <div class="card hero">
                                            <header><h3>Search All Vehicles</h3></header>
                                            <picture>
                                                <img src="img/carVan.png" alt="car and van">
                                            </picture>
                                        </div>
                                    </a>
                                </article>
                            </div>
                    </header>
                    <div class="col-12" id="carFilters">
                        <div class="row">
                            <aside class="col-md-4 col-lg-3">
                                <div class="inner">
                                    <header>Filter</header>
                                    <ul id="filters">
                                        <li><a href="./">Reset Filters</a></li>
                                        <li>
                                            <span>
                                                <span>Fuel</span>
                                                <select id="fuel" onchange="addFilter(this);">
                                                    <option selected></option>
                                                    <?php
                                                    foreach($search->getFuel() as $fuel){
                                                        echo '<option value="'.$fuel['fuel'].'">'.$fuel['fuel'].'</option>';
                                                    }
                                                    ?>
                                                </select>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <span>Make</span>
                                                <select id="make" onchange="addFilter(this);">
                                                    <option selected></option>
                                                    <?php
                                                    foreach($search->getMakes() as $make){
                                                        echo '<option value="'.$make['make'].'">'.$make['make'].'</option>';
                                                    }
                                                    ?>
                                                </select>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <span>Doors</span>
                                                <select id="doors" onchange="addFilter(this);">
                                                    <option selected></option>
                                                    <?php
                                                    
                                                    foreach($search->getDoors() as $doors){
                                                        echo '<option value="'.$doors['doors'].'">'.$doors['doors'].'</option>';
                                                    }
                                                    ?>
                                                </select>
                                            </span>
                                        </li>
                                        <li>
                                            <span>
                                                <span>Price</span>
                                                <select id="price" onchange="orderBy(this);">
                                                    <option selected></option>
                                                    <option value="ASC">Low - High</option>
                                                    <option value="DESC">High - low</option>
                                                </select>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </aside>
                            <section class="col-md-8 col-lg-9">
                                <div class="inner">
                                    <div id="searchResults" class="row">
                                        <?php
                                        if($vehicleList != null){
                                            foreach($vehicleList as $vehicle){
                                                echo '<article class="col-md-6 col-lg-4">';
                                                echo '<a href="./vehicleDetails.php?v='.$vehicle->vehicleID.'">';
                                                echo '<div class="card hero">';
                                                echo '<header>'.$vehicle->make.' '.$vehicle->model.'</header>';
                                                echo '<picture><img src="img/'.$vehicle->image.'" alt="'.$vehicle->make.' '.$vehicle->model.'"></picture>';
                                                echo '<footer>£'.$vehicle->getPrice().'</footer>';
                                                echo '</div>';
                                                echo '</a>';
                                                echo '</article>';
                                            }
                                        } else{
                                            echo '<p class="col-12">No Vehicles found<br><small>Try changing the filters</small></p>';
                                        }
                                        ?>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script type="text/javascript" src="js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
</body>
</html>