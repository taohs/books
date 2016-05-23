/**
 * Search function
 *
 * @param {String} search query
 * @param {Function} callback
 * @api public
 */
 
var request = require("superagent");
module.exports = function search (query, fn) {
    request.get("https://api.github.com/").
        set("User-Agent","Mozilla/5.0").
        end(function (res) {
            //做出小修改，
            if (res.body && Array.isArray(res.body.results)) {
                return fn(null, res.body.results);
            }
            console.log(res.body);
            return fn(null,res.body);
            
            fn(new Error("Bad twitter response"));
        });
};
