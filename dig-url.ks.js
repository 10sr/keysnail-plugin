var PLUGIN_INFO =
<KeySnailPlugin>
    <name>Dig-url</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/dig-url.ks.js</updateURL>
    <description>dig url</description>
    <version>0.1</version>
    <author mail="" homepage="http://10sr.jottit.com/">10sr</author>
    <license>NYSL</license>
    <include>main</include>
    <detail><![CDATA[
=== Overview ===
Dig current url (or go up directory).
For example, when viewing "http://example.com/foo/bar" you can go up to "http://example.com/foo" or "http://example.com".
||<
    ]]></detail>
</KeySnailPlugin>;
function dig2(){
    var url = window.content.location.href;
    var h = window.content.location.hash;
    var p = window.content.location.protocol
    var nsurl = [];
    var pname = "";
    var ssurl = [];
    var durl = [];
    nsurl = url.split("#");
    var pname = nsurl[1];
    ssurl = nsurl[0].split("/");
    durl[0] = ssurl[0] + "//" + ssurl[2];
    ssurl.splice(0,3);
    for (var i = 0; i < ssurl.length; i++){
        var durlsaved = durl[0];
        durl.unshift(durlsaved + "/" + ssurl[i]);
    };
    if (pname) {
        var durlfull = durl[0] + "#"+ pname;
        durl.unshift(durlfull);
    };
    prompt.selector({ message : "dig " + url,
                      collection : durl,
                      callback : function (i) { window.content.location.href = durl[i]; },
                    });
}
function dig(){
    var url = window.content.location.href;
    var durl = [url,];
    var s = url;
    for(var i = 1;i < 50; i++){
        if(s.match(/:\/\/[^/]+\/?$/)){ break; }
        s = s.replace(/(\/|#)[^/#]+\/?$/, "");
        durl[i] = s;
    };
    prompt.selector({ message : "dig " + url,
                      collection : durl,
                      callback : function (i) { window.content.location.href = durl[i]; },
                    });
}
plugins.withProvides(function (provide) {
    provide("dig-url", dig, "dig url");
}, PLUGIN_INFO);
