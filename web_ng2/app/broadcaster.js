System.register(['rxjs/Subject', 'rxjs/add/operator/filter', 'rxjs/add/operator/map'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Subject_1;
    var Broadcaster;
    return {
        setters:[
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            Broadcaster = (function () {
                function Broadcaster() {
                    this._eventBus = new Subject_1.Subject();
                }
                Broadcaster.prototype.broadcast = function (key, data) {
                    this._eventBus.next({ key: key, data: data });
                };
                Broadcaster.prototype.on = function (key) {
                    return this._eventBus.asObservable()
                        .filter(function (event) { return event.key === key; })
                        .map(function (event) { return event.data; });
                };
                return Broadcaster;
            }());
            exports_1("Broadcaster", Broadcaster);
        }
    }
});
//# sourceMappingURL=broadcaster.js.map