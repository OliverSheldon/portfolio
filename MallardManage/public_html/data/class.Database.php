<?php
require_once(dirname(__FILE__) . '/../../dbcfg.php');

class Database{
    private $dbConn;
    private $stmt;

    public function __construct(){
        global $dbcfg;

        $this->dbConn = @new mysqli(
            $dbcfg['db']['host'],
            $dbcfg['db']['user'],
            $dbcfg['db']['pass'],
            $dbcfg['db']['db']
        );
        if (mysqli_connect_errno()) {
            throw new Exception('Failed to connect to MySQL: ' . mysqli_connect_error());
        }
    }

    public function select($params){
        $stmt =  $this->dbConn->stmt_init();
        $sql = 'SELECT ' .
            implode(', ', $this->getFields($params['fields'])) .
            ' FROM ' . $this->prepareInnerJoin($params)
        ;
        
        if(isset($params['conditions'])) {
            $sql .= $this->getWhere(
                $params['conditions'],
                @$this->getOperator($params['operator'])
            );
        }

        $result = $this->dbConn->query($sql);

        $returnArray = array();

        while($row = $result->fetch_assoc()) {
            $returnArray[] = $row;
        }

        return $returnArray;
    }

    public function insert($params){
        $sql = 'INSERT INTO ' . $this->prepareLabel($params['table']) .
            ' (' . implode(', ', $this->getFields($params['fields'])) .')' .
            ' VALUES ' .
            implode(', ', $this->getRecords($this->escapeString($params['records'])))
        ;
        $this->dbConn->query($sql);
        $result = $this->dbConn->affected_rows;

        return $result;
    }

    public function update($params){
        $sql = 'UPDATE ' . $this->prepareLabel($params['table']) .
            ' SET ' .
            implode(', ', $this->fieldValue($params['updateValues'], '='))
        ;
        if(isset($params['conditions'])) {
            $sql .= $this->getWhere(
                $params['conditions'],
                @$this->getOperator($params['operator'])
            );
        }
        $this->dbConn->query($sql);

        $result = $this->dbConn->affected_rows;
        return $result;
    }

    public function delete($params){
        $sql = 'DELETE FROM ' . $this->prepareLabel($params['table']);
        if(isset($params['conditions'])) {
            $sql .= $this->getWhere(
                $params['conditions'],
                @$this->getOperator($params['operator'])
            );
        }

        $this->dbConn->query($sql);

        $result = $this->dbConn->affected_rows;

        return $result;
    }
    
    public function getLastInsertID(){
        return $this->dbConn->insert_id;
    }

    public function relationSelect($params){

        $tableFieldsArr = array();
        $x = 0;

        $query = 'SELECT ';

        foreach ($params['tableFields'] as $tableFields) {
            if(!is_null($tableFields)) {
                for ($i = 0; $i < count($tableFields); $i++) {
                    $tableFieldsArr[] .= $this->prepareLabel($params['tables'][$x]) . '.`' . $tableFields[$i] . '`';
                }
                $x++;
            }
        }
        $query.= implode(', ',$tableFieldsArr);
        $query.= ' FROM '. implode(',',$this->getFields($params['tables']));
        $query.= ' WHERE '.implode(' AND ', $this->relationWhere($params));
        $result = $this->dbConn->query($query);

        if(!empty($result)) {
            $records = array();
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }

            return $records;
        } else {
            return null;
        }
    }
    
    
    private function getFields($fields){
        foreach($fields as $key=>$field) {
            $fields[$key] = $this->prepareLabel($field);
        }
        return $fields;
    }

    private function getRecords($records){
        $preparedRecords = array();
        foreach($records as $recordValues) {
            foreach($recordValues as $key=>$value) {
                $recordValues[$key] = $this->prepareValue($value);
            }
            $preparedRecords[] = '(' . implode(', ', $recordValues) . ')';
        }
        return $preparedRecords;
    }

    private function getWhere($conditions, $operator){
        $conditions = $this->fieldValue($conditions, $operator);
        return ' WHERE ' . implode(' AND ', $conditions);
    }

    private function getOperator($operator){
        $returnOperator = '=';
        if(isset($operator)) {
            $returnOperator = $operator;
        }
        return $returnOperator;
    }

    private function fieldValue($fieldValues, $operator){
        $resultArray = array();
        foreach($fieldValues as $field=>$value) {
            $resultArray[] = $this->prepareLabel($field) .
                ' ' . $operator .
                ' ' . $this->prepareValue($value)
            ;
        }
        return $resultArray;
    }

    private function prepareLabel($label){
        if($label != '*') {
            $label = '`' . $label . '`';
        }
        return $label;
    }

    private function prepareValue($value){
        if(!is_numeric($value)) {
            $value = '\'' . $value . '\'';
        }
        return $value;
    }

    private function escapeString($params){
        $params = $params[0];

        $records = array();
        foreach($params as $record)
        {
            $records[] = $this->dbConn->real_escape_string($record);
        }
        $recordParams['records'] = array($records);

        return  $recordParams['records'];
    }
    
    private function relationWhere($params){
        $return = array();
        $i = 0;

        foreach ($params['tables'] as $table) {
            if ($i > 1) {
                break;
            }

            if ($i < count($params['ID'])) {
                $return[] .= '`' . $params['link'] . '`.`' . $params['check'] . '` = ' . $params['ID'];
            }
            $return[] .= '`' . $table . '`.`' . $params['values'][$i] . '` = `'.$params['link'].'`.`' . $params['values'][$i] . '`';

            $i++;
        }
        return $return;
    }
    
    private function prepareInnerJoin($params){
        $rStr = $this->prepareLabel($params['table']);
        if(isset($params['joins'])){
            foreach($params['joins'] as $join){
                $rStr .= ' INNER JOIN '.$this->prepareLabel($join["join"]) .
                    ' ON ' . $this->prepareLabel($join["tables"][0]).'.'.$this->prepareLabel($join["id"]) .
                    ' = ' . $this->prepareLabel($join["tables"][1]).'.'.$this->prepareLabel($join["id"]);
            }
        } else{
            $rStr = $this->prepareLabel($params['table']);
        }
        return $rStr;
    }
}