var cache = {
    data: {},
    put: function(url, value) {
        this.remove(url);
        this.data[url] = {
            value: value
        };
    },
    get: function(url) {
        const data = this.data[url];
        
        if (data == null) {
            return null;
        }
        
        return this.data[url].value;
    },
    remove: function(url) {
        delete this.data[url];
    },
    contains: function(url) {
        return this.data[url] != null;
    }
}