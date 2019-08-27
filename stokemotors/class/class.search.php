<?php
require_once(dirname(__FILE__) . "/../db/class.Database.php");
require_once(dirname(__FILE__) . "/class.vehicle.php");

class Search{
    
    private $db;
    
    public function __construct(Database $db = null){
        if(!isset($db)){
            $this->db = new Database();
        } else {
            $this->db = $db;
        }
    }
    
    public function getAll($order = null){
        if($order != null){
            $params = array(
                'table' => 'vehicle',
                'fields' => array(
                    'vehicleID',
                    'wheels',
                    'doors',
                    'price',
                    'type',
                    'model',
                    'year',
                    'image',
                    'make',
                    'badge_img',
                    'fuel'
                ),
                'joins' => array(
                    array(
                        'join'=>'type',
                        'tables'=>
                        array(
                            'vehicle',
                            'type'
                        ),
                        'id' => 'typeID'
                    ),
                    array(
                        'join'=>'model',
                        'tables'=>
                        array(
                            'vehicle',
                            'model'
                        ),
                        'id' => 'modelID'
                    ),
                    array(
                        'join'=>'make',
                        'tables'=>
                        array(
                            'vehicle',
                            'make'
                        ),
                        'id' => 'makeID'
                    ),
                    array(
                        'join'=>'fuel',
                        'tables'=>
                        array(
                            'vehicle',
                            'fuel'
                        ),
                        'id' => 'fuelID'
                    )
                ),
                'order' => $order
            );
            
        } else{
            $params = array(
                'table' => 'vehicle',
                'fields' => array(
                    'vehicleID',
                    'wheels',
                    'doors',
                    'price',
                    'type',
                    'model',
                    'year',
                    'image',
                    'make',
                    'badge_img',
                    'fuel'
                ),
                'joins' => array(
                    array(
                        'join'=>'type',
                        'tables'=>
                        array(
                            'vehicle',
                            'type'
                        ),
                        'id' => 'typeID'
                    ),
                    array(
                        'join'=>'model',
                        'tables'=>
                        array(
                            'vehicle',
                            'model'
                        ),
                        'id' => 'modelID'
                    ),
                    array(
                        'join'=>'make',
                        'tables'=>
                        array(
                            'vehicle',
                            'make'
                        ),
                        'id' => 'makeID'
                    ),
                    array(
                        'join'=>'fuel',
                        'tables'=>
                        array(
                            'vehicle',
                            'fuel'
                        ),
                        'id' => 'fuelID'
                    )
                )
            );
        }
        
        return $this->vehicleList($this->db->select($params));
    }
    
    public function getType($type){
        $params = array(
            'table' => 'vehicle',
            'fields' => array(
                    'vehicleID',
                    'wheels',
                    'doors',
                    'price',
                    'type',
                    'model',
                    'year',
                    'image',
                    'make',
                    'badge_img',
                    'fuel'
                ),
            'joins' => array(
                array(
                    'join'=>'type',
                    'tables'=>
                    array(
                        'vehicle',
                        'type'
                    ),
                    'id' => 'typeID'
                ),
                array(
                    'join'=>'model',
                    'tables'=>
                    array(
                        'vehicle',
                        'model'
                    ),
                    'id' => 'modelID'
                ),
                array(
                    'join'=>'make',
                    'tables'=>
                    array(
                        'vehicle',
                        'make'
                    ),
                    'id' => 'makeID'
                ),
                array(
                    'join'=>'fuel',
                    'tables'=>
                    array(
                        'vehicle',
                        'fuel'
                    ),
                    'id' => 'fuelID'
                )
            ),
            'conditions' => array(
                'type' => $type
            )
        );
        
        return $this->vehicleList($this->db->select($params));
    }
    
    public function filterAll($filters){
        $conditions=null;
        $orderBy = null;
        $direction = null;
        $order = null;
        if(count($filters)>0){
            foreach($filters as $filter){
                $f = explode("=",$filter);
                if($f[0] != null && $f[1] != "all"){
                    
                    if($f[0] == "orderby"){
                        $orderBy[] = $f[1];
                    }
                    if($f[0] == "direction"){
                        $direction[] = $f[1];
                        
                    }
                    if($f[0] != "direction" && $f[0] != "orderby"){
                        $conditions[$f[0]] = $f[1];
                        
                    }
                }
            }
            if($orderBy != null){
                for($x=0; $x<count($orderBy); $x++){
                    //if($direction == null){$direction[$x] = null;}
                    if($direction[$x] == null){$direction[$x] = "asc";}
                        $order[] = array(
                            'field' => $orderBy[$x],
                            'direction' => $direction[$x]
                        );
                    }
                }
            }
            if($conditions == null){
                return $this->getAll($order);
            }
            
            if($order != null){
                
                $params = array(
                    'table' => 'vehicle',
                    'fields' => array('*'),
                    'joins' => array(
                        array(
                            'join'=>'type',
                            'tables'=>
                            array(
                                'vehicle',
                                'type'
                            ),
                            'id' => 'typeID'
                        ),
                        array(
                            'join'=>'model',
                            'tables'=>
                            array(
                                'vehicle',
                                'model'
                            ),
                            'id' => 'modelID'
                        ),
                        array(
                            'join'=>'make',
                            'tables'=>
                            array(
                                'vehicle',
                                'make'
                            ),
                            'id' => 'makeID'
                        ),
                        array(
                            'join'=>'fuel',
                            'tables'=>
                            array(
                                'vehicle',
                                'fuel'
                            ),
                            'id' => 'fuelID'
                        )
                    ),
                    'conditions' => $conditions,
                    'order' => $order
                );
            } else{

                $params = array(
                    'table' => 'vehicle',
                    'fields' => array('*'),
                    'joins' => array(
                        array(
                            'join'=>'type',
                            'tables'=>
                            array(
                                'vehicle',
                                'type'
                            ),
                            'id' => 'typeID'
                        ),
                        array(
                            'join'=>'model',
                            'tables'=>
                            array(
                                'vehicle',
                                'model'
                            ),
                            'id' => 'modelID'
                        ),
                        array(
                            'join'=>'make',
                            'tables'=>
                            array(
                                'vehicle',
                                'make'
                            ),
                            'id' => 'makeID'
                        ),
                        array(
                            'join'=>'fuel',
                            'tables'=>
                            array(
                                'vehicle',
                                'fuel'
                            ),
                            'id' => 'fuelID'
                        )
                    ),
                    'conditions' => $conditions
                );
            }
        return $this->vehicleList($this->db->select($params));
    }
    
     public function getFuel(){
            $params = array(
                'table' => 'fuel',
                'fields' => array(
                    'fuel'
                )
            );

        return $this->db->select($params);
    }
    
     public function getMakes(){
            $params = array(
                'table' => 'make',
                'fields' => array(
                    'make'
                )
            );

        return $this->db->select($params);
    }
    
     public function getDoors(){
            $params = array(
                'table' => 'vehicle',
                'distinct' => true,
                'fields' => array(
                    'doors'
                ),
                'order' => array(
                    array(
                            'field' => 'doors',
                            'direction' => 'ASC'
                        )
                    )
                
            );

        return $this->db->select($params);
    }
    
    public function getVehicle($id){
        $params = array(
            'table' => 'vehicle',
            'fields' => array(
                    'vehicleID',
                    'wheels',
                    'doors',
                    'price',
                    'type',
                    'model',
                    'year',
                    'image',
                    'make',
                    'badge_img',
                    'fuel'
                ),
            'joins' => array(
                        array(
                            'join'=>'type',
                            'tables'=>
                            array(
                                'vehicle',
                                'type'
                            ),
                            'id' => 'typeID'
                        ),
                        array(
                            'join'=>'model',
                            'tables'=>
                            array(
                                'vehicle',
                                'model'
                            ),
                            'id' => 'modelID'
                        ),
                        array(
                            'join'=>'make',
                            'tables'=>
                            array(
                                'vehicle',
                                'make'
                            ),
                            'id' => 'makeID'
                        ),
                        array(
                            'join'=>'fuel',
                            'tables'=>
                            array(
                                'vehicle',
                                'fuel'
                            ),
                            'id' => 'fuelID'
                        )
                    ),
            'conditions' => array(
                'vehicleID' => $id
            )
        );
        $result = $this->db->select($params);
        
        if($result != null){
        return new Vehicle($result[0]);
        }
        return null;
    }
    
    
    
    private function vehicleList($result){
        $vehicleList;
        foreach($result as $vehicle){
            $vehicleList[] = new Vehicle($vehicle);
        }
        return $vehicleList;
    }
}
?>