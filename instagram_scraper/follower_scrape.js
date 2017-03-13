/**
 *
 * Instagram Follower Web Scrapper
 *
 * Steps to use.
 * 1. Open instagram user's profile in browser https://www.instagram.com/tvfpitchers/
 * 2. Open console ( press F12 in chrome ) and paste all the code below
 * 3. Click on followers button and load all the followers
 * 4. Call function downloadAsCsv() by writing "downloadAsCsv()" in console to download csv file containing user's all the followers .
 *
 * @author : Hardik Sondagar <hardikmsondagar@gmail.com>
 *
 */

var followers = [];

(function(XHR) {
    "use strict";

    var stats = [];
    var timeoutId = null;

    var open = XHR.prototype.open;
    var send = XHR.prototype.send;

    XHR.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        open.call(this, method, url, async, user, pass);
    };

    XHR.prototype.send = function(data) {
        var self = this;
        var start;
        var oldOnReadyStateChange;
        var url = this._url;
        var match_url_string = 'query';

        function onReadyStateChange() {
            if (self.readyState == 4 && url.indexOf(match_url_string) > -1) {

                var response = JSON.parse(self.response);
                followers = followers.concat(response.followed_by.nodes);

            }

            if (oldOnReadyStateChange) {
                oldOnReadyStateChange();
            }
        }

        if (!this.noIntercept) {
            start = new Date();

            if (this.addEventListener) {
                this.addEventListener("readystatechange", onReadyStateChange, false);
            } else {
                oldOnReadyStateChange = this.onreadystatechange;
                this.onreadystatechange = onReadyStateChange;
            }
        }

        send.call(this, data);
    }
})(XMLHttpRequest);

function downloadAsCsv() {



    var csvContent = "data:text/csv;charset=utf-8,";

    var header = "Username,Requested_by_viewer,Followed_by_viewer,Profile_pic_url,Full Name,is_verified,Id\n";
    csvContent += header;

    followers.forEach(function(infoArray, index) {

        var data = [];

        for (var i in infoArray) {
            data.push(infoArray[i]);
        }

        dataString = data.join(",");
        csvContent += index < followers.length ? dataString + "\n" : dataString;

    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    var pathArray = window.location.pathname.split('/');

    var milliseconds = (new Date).getTime();
    var filename = 'followers.' + milliseconds + '.csv';

    if (pathArray && pathArray.length > 1) {
        filename = pathArray[1] + '.' + milliseconds + '.csv';
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".

}
