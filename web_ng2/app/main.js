System.register(['@angular/platform-browser-dynamic', '@angular/upgrade/static', './app.module'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, static_1, app_module_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (static_1_1) {
                static_1 = static_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            }],
        execute: function() {
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(function (platformRef) {
                var upgrade = platformRef.injector.get(static_1.UpgradeModule);
                upgrade.bootstrap(document.documentElement, ['app']);
            });
        }
    }
});
//# sourceMappingURL=main.js.map