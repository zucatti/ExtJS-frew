<?
class Tags {
    function load($data){
        // use $query for type-ahead
        $query = $data->query;
        $json = array(tags => array(
            array(name => 'family', quantity => 10),
            array(name => 'friends', quantity => 4),
            array(name => 'kids', quantity => 5),
        ));
        return $json;
    }
}
?>