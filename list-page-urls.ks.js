var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>list-page-urls</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/list-page-urls.ks.js</updateURL>
    <description>list url of current page</description>
    <version>0.2</version>
    <author mail="" homepage="http://10sr.github.com/">10sr</author>
    <license>NYSL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Overview ===
            List urls that current page contains.
            ]]></detail>
    </KeySnailPlugin>;

function gen_list(){
    // window.content.document.links
    var urls = [];
    var aa = window.content.document.getElementsByTagName("a");
    var text = "";
    var alt = "";
    for (var i = 0; i < aa.length ; i++) {
        if(aa[i].href == ""){ continue; }

        if (aa[i].text == "" && aa[i].hasChildNodes() && aa[i].childNodes[0].nodeType == Node.ELEMENT_NODE){
            alt = aa[i].childNodes[0].getAttribute("alt");
            text = " " + aa[i].childNodes[0].nodeName + (alt ? ": " + alt : "");
        }else{
            text = aa[i].text;
        }
        urls.push([text, decodeURIComponent(aa[i].href)]);
    }

    return urls;

}

function copyurls(){
    urls = [a[1] + "\n" for each(a in gen_list())].join("");

    command.setClipboardText(urls, false);
}

function selecturl(){
    urls = gen_list();

    if(urls.length == 0){
        display.echoStatusBar("No url found.");
        return;
    }

    prompt.selector(
        {
            message    : "Select URL",
            collection : urls,
            width : [35, 65],
            header : ["text", "url"],
            callback   : function (i) {
                if (i >= 0)
                    openUILinkIn(urls[i][1], "tab");
                    // or current tabshifted window
            }
        }
    );
}

plugins.withProvides(function (provide) {
    provide("list-page-urls", selecturl, "list urls of current page and select");
    provide("copy-page-urls", copyurls, "copy list of urls of current page");
}, PLUGIN_INFO);
