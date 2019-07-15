<?php
require_once(dirname(__FILE__) . '/../data/class.Database.php');
require("class.personalDetails.php");

class User extends PersonalDetails{
    
    private $db;
    
    protected $userID;
    
    public $username;
    private $password;
    public $email;
    private $auth;
    private $lastActive;
    private $role;
    
    public function __construct(Database $db = null){
        if(!isset($db)){
            $this->db = new Database();
        } else {
            $this->db = $db;
        }
        $user = $this->getUser();
        
        $this->userID = $user["userID"];
        $this->username = $user["username"];
        $this->password = $user["password"];
        $this->email = $user["email"];
        $this->auth = boolval($user["auth"]);
        $this->lastActive = $user["lastActive"];
        $this->role = $user["role"];
        
        $this->personalDetailsID = $user["personalDetailsID"];
        $this->title = $user["title"];
        $this->forename = $user["forename"];
        $this->surname = $user["surname"];
        $this->profilePic = $user["profilePic"];
        $this->setAddress($user);
    }
    
    public function comparePassword(){
        
    }
    
    public function isAuthorised(){
        return $this->auth;
    }
    
    public function getLastActive(){
        return $this->lastActive;
    }
    
    public function setLastActive($date){
        $this->lastActive = getdate($date);
    }
    
    public function hasRole($role){
        return $this->role == $role;
    }
    
    private function getUser(){
        $params = array(
            'table' => 'user',
            'fields' => array('*'),
            'joins' => array(
                array(
                    'join'=>'userroles',
                    'tables'=>
                    array(
                        'user',
                        'userroles'
                    ),
                    'id' => 'userRoleID'
                ),
                array(
                    'join'=>'personaldetails',
                    'tables'=>
                    array(
                        'user',
                        'personaldetails'
                    ),
                    'id' => 'personalDetailsID'
                ),
                array(
                    'join'=>'address',
                    'tables'=>
                    array(
                        'address',
                        'personaldetails'
                    ),
                    'id' => 'addressID'
                )
            )
        );

        return $this->db->select($params)[0];
    }
    
}