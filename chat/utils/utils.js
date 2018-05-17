var utils = {

    replaceAll: function(str, search, replacement) {
        if(str == null || str.length <= 0) {
            return "";
        }
        return str.replace(new RegExp(search, 'g'), replacement);
    },

    escape: function(field) {
        if(!field || field.length <= 0) {
            return "";
        }
        field = "" + field;
        field = utils.replaceAll(field, "@", "@A");
        field = utils.replaceAll(field, "/", "@S");
        return field;
    },

    unescape: function(field) {
        if(!field || field.length <= 0) {
            return "";
        }
        field = "" + field;
        field = utils.replaceAll(field, "@S", "/");
        field = utils.replaceAll(field, "@A", "@");
        return field;
    },

    serialize: function serialize(data) {
        if(typeof data === 'object'){
            if(isNaN(data.length)){ //object
                var result = '';
                for(var key in data){
                    if(!data.hasOwnProperty(key)) continue;
                    result += utils.escape(key) + "@=" + utils.escape(utils.serialize(data[key])) + "/";
                }
                return result;
            }else{ //array
                var result = '';
                for(var i=0; i<data.length; i++){
                    result += utils.escape(utils.serialize(data[i])) + "/";
                }
                return result;
            }
        }else{
            return utils.escape(data);
        }
    },

    deserialize: function(raw) {
        if(raw.indexOf('/') >= 0 && (raw.indexOf('@=') >= 0 || raw.indexOf('@S') >= 0 || raw.indexOf('@A') >= 0)){
            var parts = raw.split("/");
            parts.pop();

            if(parts[0].indexOf("@=") >= 0){ // object

                var result = {};
                for(var i=0; i<parts.length; i++){
                    var tmp = parts[i].split("@=");
                    var key = tmp[0];
                    var value = tmp[1];
                    result[utils.unescape(key)] = utils.deserialize(utils.unescape(value));
                }

                return result;
            }else{ //array
                var result = [];
                for(var i=0; i<parts.length; i++){
                    result.push(utils.deserialize(utils.unescape(parts[i])));
                }

                return result;
            }
        }else{
            return utils.unescape(raw);
        }
    },
};

module.exports = utils;