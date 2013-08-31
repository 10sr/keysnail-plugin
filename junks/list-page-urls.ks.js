var PLUGIN_INFO =
    <KeySnailPlugin>
    <name>list-page-urls</name>
    <updateURL>https://raw.github.com/10sr/keysnail-plugin/master/list-page-urls.ks.js</updateURL>
    <description>list url of current page</description>
    <version>0.2</version>
    <author mail="" homepage="http://10sr.github.com/">10sr</author>
    <license>MPL</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
            === Overview ===
            List urls that current page contains.
            ]]></detail>
    </KeySnailPlugin>;

function genList(all){
    var aa;
    if (all) {
        aa = getList();
    } else {
        aa = getListDisplayed();
    }
    // window.content.document.links
    var urls = [];
    var text = "";
    var alt = "";
    for (var i = 0; i < aa.length ; i++) {
        if(aa[i].href == ""){ continue; }

        if (aa[i].text == "" && aa[i].hasChildNodes() &&
            aa[i].childNodes[0].nodeType == Node.ELEMENT_NODE) {
            alt = aa[i].childNodes[0].getAttribute("alt");
            text = " " + aa[i].childNodes[0].nodeName + (alt ? ": " + alt : "");
        } else {
            text = aa[i].text;
        }
        urls.push([text, decodeURIComponent(aa[i].href)]);
    }

    return urls;

}

function getList(){
    return window.content.document.getElementsByTagName("a");
}

function getAbsolutePosition (elem) {
    var body = window.content.document.body;
    var html = window.content.document.documentElement;
    var inHeight = window.innerHeight;
    var inWidth = window.innerWidth;

    var style = window.getComputedStyle(elem, null);
    if (style.visibility === 'hidden' || style.opacity === '0') return false;
    var rect = elem.getClientRects()[0];
    if (rect && rect.right - rect.left && rect.left >= 0 && rect.top >= -5 &&
        rect.bottom <= inHeight + 5 && rect.right <= inWidth) {
        return {
            top: (body.scrollTop || html.scrollTop) - html.clientTop + rect.top,
            left: (body.scrollLeft || html.scrollLeft) - html.clientLeft +
                rect.left
        };
    }
    return false;
}

function getListDisplayed(){
    // http://d.hatena.ne.jp/mooz/20091107/p2
    //http://d.hatena.ne.jp/Griever/20090223/1235407852
    var aa = window.content.document.getElementsByTagName("a");
    return [e for each (e in aa ) if (getAbsolutePosition(e))];
}

function copyURLs(){
    var urls = [a[1] + "\n" for each(a in genList(true))].join("");

    command.setClipboardText(urls, false);
}

function selectURL(urls){
    if(urls.length === 0){
        display.echoStatusBar("No url found.");
        return;
    }

    // http://d.hatena.ne.jp/mooz/20091004/p1
    prompt.selector(
        {
            message    : "Select URL",
            collection : urls,
            // flags : [0, 0, IGNORE | HIDDEN],
            width : [35, 65],
            header : ["text", "url"],
            callback   : function (i) {
                if (i >= 0)
                    openUILinkIn(encodeURIComponent(urls[i][1]), "tab");
                    // or current tabshifted window
            }
        }
    );
}

function selectURLDisplayed(){
    return selectURL(genList(false));
}

function selectURLAll(){
    return selectURL(genList(true));
}

plugins.withProvides(function (provide) {
    provide("list-displayed-urls", selectURLDisplayed,
            "list urls of current page and select");
    provide("list-all-urls", selectURLAll,
            "list urls of current page and select");
    provide("copy-all-urls", copyURLs, "copy list of urls of current page");
}, PLUGIN_INFO);
