var PLUGIN_INFO =
<KeySnailPlugin>
    <name>bookmarks in new tab</name>
    <name lang="ja">bookmarks in new tab</name>
        <description>bookmarks in new tab</description>
    <description lang="ja">bookmarks in new tab</description>
    <version>0.2</version>
    <updateURL>https://github.com/10sr/keysnail-plugin/raw/master/shiitake.ks.js</updateURL>
    <author homepage="http://10sr.jottit.com">10sr</author>
    <iconURL>https://github.com/10sr/keysnail-plugin/raw/master/shiitake.png</iconURL>
    <provides> </provides>
    <license>MPL 1.1</license>
    <license lang="ja">MPL 1.1</license>
    <minVersion>1.0</minVersion>
    <include>main</include>
    <detail><![CDATA[
=== Usage ===
open bookmark in new tab
    ]]></detail>
</KeySnailPlugin>;

var OpenBookmarksInNewTab = {
    init : function()
    {
        if (!('PlacesUIUtils' in window))
            return;

        if (!PlacesUIUtils.__openbookmarkintab__done) {
            eval('PlacesUIUtils.openNodeWithEvent = '+
                 PlacesUIUtils.openNodeWithEvent.toSource().replace(
                         /(([^\s]*)whereToOpenLink\(aEvent\))/,
                     '$2OpenBookmarksInNewTab.convertWhereToOpenLink($1, null, aNode)'
                 )
                );

            eval('PlacesUIUtils._openTabset = '+
                 PlacesUIUtils._openTabset.toSource().replace(
                     'if (where == "window") {',
                         <![CDATA[
                             where = browserWindow.OpenBookmarksInNewTab.convertWhereToOpenLink(where, aEvent);
                             $&
                         ]]>
                 )
                );

            PlacesUIUtils.__openbookmarkintab__done = true;
        }

        document.getElementById('placesContext_open').removeAttribute('default');
        document.getElementById('placesContext_open:newtab').setAttribute('default', true);
    },

    convertWhereToOpenLink : function(aWhere, aEvent, aNode)
    {
        var pref = Components
            .classes['@mozilla.org/preferences;1']
            .getService(Components.interfaces.nsIPrefBranch);

        if ( // clicking on folder
            aEvent &&
                (
                    ( // tree
                        aEvent.target.localName == 'treechildren' &&
                            aEvent.currentTarget.selectedNode &&
                            !PlacesUtils.nodeIsURI(aEvent.currentTarget.selectedNode) &&
                            PlacesUtils.nodeIsContainer(aEvent.currentTarget.selectedNode)
                    ) ||
                        ( // toolbar, menu
                                aEvent.originalTarget &&
                                aEvent.originalTarget.node &&
                                PlacesUtils.nodeIsContainer(aEvent.originalTarget.node)
                        )
                )
        )
            return aWhere;

        if (
            aNode &&
                PlacesUtils.nodeIsURI(aNode) &&
                PlacesUIUtils.checkURLSecurity(aNode) &&
                PlacesUtils.nodeIsBookmark(aNode) &&
                (
                    aNode.uri.indexOf('javascript:') == 0 || // bookmarklets
                    ( // web panels
                        PlacesUtils.annotations.itemHasAnnotation(
                            aNode.itemId,
                            'bookmarkProperties/loadInSidebar'
                        ) &&
                            Components
                            .classes['@mozilla.org/appshell/window-mediator;1']
                            .getService(Components.interfaces.nsIWindowMediator)
                            .getMostRecentWindow('navigator:browser')
                    )
                )
        )
            return aWhere;

        var browserWindow = getTopWin();
        if (
            !browserWindow ||
                (
                    pref.getBoolPref('extensions.openbookmarkintab.reuseBlankTab') &&
                        browserWindow.gBrowser.currentURI.spec == 'about:blank' &&
                        browserWindow.gBrowser.selectedTab.getAttribute('busy') != 'true'
                )
        )
            return aWhere;

        switch (aWhere)
        {
        case 'current':
            return 'tab' ;
        case 'tab':
        case 'tabshifted':
            return !pref.getBoolPref('extensions.openbookmarkintab.reverseBehaviorForMiddleClick') ?
                aWhere :
                'current' ;
        default:
            return aWhere;
        }
    },

    handleEvent : function(aEvent)
    {
        switch (aEvent.type)
        {
        case 'load':
            window.removeEventListener('load', this, false);
            this.init();
            return;
        }
    }
};

pref("keysnailplugin.openbookmarkintab.reverseBehaviorForMiddleClick", false);
pref("keysnailplugin.openbookmarkintab.reuseBlankTab", true);

window.addEventListener('load', OpenBookmarksInNewTab, false);

// hook.addToHook("KeySnailInitialized",
//               OpenBookmarksInNewTab.init);

// OpenBookmarksInNewTab.init();
