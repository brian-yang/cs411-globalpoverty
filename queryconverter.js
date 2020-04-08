/*
    search;<schema>;<table>;<condition>(optional) -> SELECT <schema> FROM <table> WHERE <condition>
    insert;<table>;<data>                         -> INSERT INTO <database> VALUE <data>
    delete;<table>;<condition>                    -> DELETE FROM <table> WHERE <condition>
    update;<table>;<new data>;<condition>         -> UPDATE <table> SET <new data> WHERE <condition>
*/

function ConvertQuery(search_string) {
    var str_arr = search_string.split(";");
    var query_string = "";
    if (str_arr[0] == "search"){
        if (str_arr.length < 3 || str_arr.length > 4){
            console.log("Incorrect search");
            return "";
        }
        if (str_arr.length == 3){
            query_string += "SELECT " + str_arr[1] + " FROM " + str_arr[2];
        } else {
            query_string += "SELECT " + str_arr[1] + " FROM " + str_arr[2] + " WHERE " + str_arr[3];
        }
    } else if (str_arr[0] == "insert") {
        if (str_arr.length != 3){
            console.log("Incorrect insert");
            return "";
        }
        query_string += "INSERT INTO " + str_arr[1] + " VALUE " + str_arr[2];
    } else if (str_arr[0] == "delete") {
        if (str_arr.length != 3){
            console.log("Incorrect delete");
            return "";
        }
        query_string += "DELETE FROM " + str_arr[1] + " WHERE " + str_arr[2];
    } else if (str_arr[0] == "update") {
        if (str_arr.length != 4){
            console.log("Incorrect update");
            return "";
        }
        query_string += "UPDATE " + str_arr[1] + " SET " + str_arr[2] + " WHERE " + str_arr[3];
    } 
    console.log(query_string); 
    return query_string;
}




var query = ConvertQuery("search;*;extremePoverty;percentExtremePoverty > 70");



// connection.query(query, function (err, result, fields) {
//     // if any error while executing above query, throw error
//     if (err) throw err;
//     // if there is no error, you have the result
//     console.log(result);
//     console.log("Number of rows affected : " + result.affectedRows);
//     console.log("Number of records affected with warning : " + result.warningCount);
//     console.log("Message from MySQL Server : " + result.message);
// });

