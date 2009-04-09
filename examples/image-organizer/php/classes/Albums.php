<?php
class Albums {
    function loadtree(){
        $db = new SQLiteDatabase("sql/imgorg.db");
        $res = $db->query('select * from Albums');
        $json = array();
        while ($o = $res->fetchObject()) {
            $o->leaf = true;
            array_push($json,$o);
        }
        return $json;
    }

    function addOrUpdate($data){
        $db = new SQLiteDatabase('sql/imgorg.db');
        $q = $db->query('SELECT * FROM Albums where id = "'.$data->id.'"');
        if (sizeof($q) == 0) {
            $res = $db->query('INSERT INTO Albums (text) VALUES ("'.$data->text.'")');
        } else {
            $res = $db->query('UPDATE Albums SET text ="'.$data->text.'" WHERE id = "'.$data->id.'"');
        }
        return array(success => true);
    }
    
    function remove($data) {
        $db = new SQLiteDatabase('sql/imgorg.db');
        $q = $db->queryExec('DELETE FROM Albums where id ="'.$data->album.'"');
        // also remove all albums_images records with album_id 
        return array(success=>true, album => $data->album);
    }
    
    function load($data){
        // use $query for type-ahead
        $query = $data->query;
        $db = new SQLiteDatabase('sql/imgorg.db');
        $qryStr = 'SELECT * FROM Albums';
        if ($query) {
            $qryStr .= ' where text like "'.$query.'%"';
        }
        $q = $db->query($qryStr);
        return $q->fetchAll();
    }
}
?>