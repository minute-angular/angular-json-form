///<reference path="../../../minute/_all.d.ts"/>
var Directives;
(function (Directives) {
    var AngularJsonForm = (function () {
        function AngularJsonForm($timeout) {
            this.$timeout = $timeout;
            this.restrict = 'E';
            this.scope = { schema: '=', data: '=', activeTab: '=?', valid: '=?', connect: '=?' };
            this.template = "              \n        <div class=\"row\">\n            <div class=\"col-xs-12\" ng-load=\"horizontal = schema.layout !== 'vertical'\">\n                <ng-form class=\"{{horizontal && 'form-horizontal' || 'form'}}\" name=\"mainForm\">      \n                    <ng-include src=\"'render-group.html'\" ng-load=\"clone = deep(schema);\"></ng-include>\n    \n                    <script type=\"text/ng-template\" id=\"render-group.html\">\n                        <div ng-repeat=\"child in clone.group.children\" ng-init=\"tabs = getPath(parents, child.key, true);\">\n                            <div class=\"form-group\" ng-if=\"child.type === 'array'\" ng-show=\"(child.visible === undefined) || $eval(child.visible)\" ng-init=\"self = getSelf(data, parents)\">\n                                <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\">{{(child.label || child.key) | ucfirst}}:</label>\n\n                                <div class=\"{{horizontal && 'col-md-10' || ''}} tab-border\">                        \n                                    <div class=\"tabs-panel\" ng-init=\"iTabs = {}\">\n                                        <ul class=\"nav nav-tabs\" angular-sortable=\"\">\n                                            <li class=\"tab-item\" ng-class=\"{active: tab === iTabs.selectedTab}\" ng-repeat=\"tab in tabs\">                                                \n                                                <a href=\"\" ng-click=\"iTabs.selectedTab = tab\" ng-init=\"iTabs.selectedTab = iTabs.selectedTab || tab;\" context-menu=\"tabOptions\">\n                                                    <button class=\"close closeTab\" type=\"button\" ng-click=\"tabs.splice($index, 1); iTabs.selectedTab = tabs[tabs.length - 1];\">\u00D7</button>\n                                                    {{(child.caption || child.key) | ucfirst}} #{{$index+1}}\n                                                </a>\n                                            </li>\n                                            <li><a href=\"\" ng-click=\"tabs.push({}); iTabs.selectedTab = tabs[tabs.length - 1];\">{{child.add || ('Add ' + child.key)}}</a></li>\n                                        </ul>\n                                        <div class=\"tab-content\">\n                                            <div class=\"tab-pane fade in active\" ng-repeat=\"tab in tabs\"\n                                             ng-init=\"parents = add(parents, child.key, $index)\" ng-if=\"tab === iTabs.selectedTab\">\n                                                <ng-include src=\"'render-group.html'\" ng-init=\"clone = child\"></ng-include>\n                                            </div>\n                                        </div>\n                                    </div>\n                                </div>\n                            </div>\n                            \n                            <div ng-if=\"child.type !== 'array'\" ng-show=\"(child.visible === undefined) || $eval(child.visible)\" ng-init=\"self = getSelf(data, parents)\">\n                                <ng-include src=\"'render-field-' + (clone.type || 'text') + '.html'\" ng-init=\"clone = child; model = getPath(parents, clone.key, false)\"></ng-include>\n                            </div>\n                        </div>\n                    </script>\n                    \n                    <script type=\"text/ng-template\" id=\"render-field-text.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <input type=\"{{clone.subType || 'text'}}\" class=\"form-control\" dynamic-attrs=\"clone.attrs\" placeholder=\"{{clone.placeholder}}\" dynamic-model=\"model\" \n                                ng-required=\"clone.required\" list=\"{{clone.datalist.length && ('list-' + $index + '-' + $parent.$index) || ''}}\">\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                                <datalist id=\"{{'list-' + $index + '-' + $parent.$index}}\" ng-if=\"clone.datalist.length\">\n                                    <option ng-repeat=\"item in clone.datalist\" value=\"{{item}}\" />\n                                </datalist>\n                            </div>\n                        </div>\n                    </script>\n                    \n                    <script type=\"text/ng-template\" id=\"render-field-button.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <div class=\"help-block\">\n                                    <span ng-if=\"clone.hideValue !== true\" ng-show=\"$eval(model)\" class=\"text-muted\" ng-if=\"clone.hideValue !== true\">\n                                        <span class=\"{{clone.labelCss || 'label label-success'}}\">{{$eval(model)}}</span> &nbsp;/&nbsp;\n                                    </span>\n                                    \n                                    <button type=\"button\" class=\"{{clone.css || 'btn btn-default btn-sm'}}\" dynamic-model=\"model\" dynamic-button click=\"clone.click\" item-data=\"data\">\n                                        {{clone.caption || 'Click here'}}\n                                    </button>\n                                </div>\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                    \n                    <script type=\"text/ng-template\" id=\"render-field-wysiwyg.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <div id=\"editor\" dynamic-model=\"model\" contenteditable></ng-wig>\n                            </div>\n                        </div>\n                    </script>\n                    \n                    <script type=\"text/ng-template\" id=\"render-field-textarea.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <textarea rows=\"4\" type=\"{{clone.subType || 'text'}}\" class=\"form-control\" dynamic-attrs=\"clone.attrs\" placeholder=\"{{clone.placeholder}}\" \n                                dynamic-model=\"model\" ng-required=\"clone.required\"></textarea>\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                    \n                    <script type=\"text/ng-template\" id=\"render-field-select.html\">\t\t\t\t    \n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <select class=\"form-control\" dynamic-attrs=\"clone.attrs\" placeholder=\"{{clone.placeholder || 'Select..'}}\" dynamic-model=\"model\" ng-required=\"clone.required\">\n                                    <option value=\"\" ng-if=\"clone.placeholder !== false\">{{clone.placeholder}}</option>\n                                    <option ng-repeat=\"option in clone.options\" value=\"{{option.value || option}}\">{{option.label || option.value || option}}</option>\n                                </select>                               \n                                \n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                \n                    <script type=\"text/ng-template\" id=\"render-field-radio.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <label class=\"radio-inline\" ng-repeat=\"option in clone.options\">\n                                    <input type=\"radio\" dynamic-model=\"model\" ng-value=\"option.value\"> {{option.label || option.value}}\n                                </label>\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                \n                    <script type=\"text/ng-template\" id=\"render-field-checkbox.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\" ng-init=\"$eval(model + ' = forceObj('+model+')')\">\n                                <label class=\"checkbox-inline\" ng-repeat=\"option in clone.options\">\n                                    <input type=\"checkbox\" dynamic-model=\"model + '.' + option.value\"> {{option.label || option.value}}\n                                </label>\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                \n                    <script type=\"text/ng-template\" id=\"render-field-upload.html\">\n                        <div class=\"form-group\">\n                            <label class=\"{{horizontal && 'col-md-2' || ''}} control-label\"><span translate=\"\">{{(clone.label || clone.key) | ucfirst}}:</span></label>\n                            <div class=\"{{horizontal && 'col-md-10' || ''}}\">\n                                <minute-uploader dynamic-model=\"model\" type=\"image\" preview=\"true\" remove=\"true\" label=\"{{clone.placeholder}}\" url=\"true\"></minute-uploader>\n                                <p class=\"help-block\" ng-if=\"!!clone.hint\">{{clone.hint}}</p>\n                            </div>\n                        </div>\n                    </script>\n                </ng-form>\n            </div>\n        </div>           \n        ";
            this.compile = function () {
                return {
                    pre: function ($scope) {
                        $scope.tmp = { count: 0 };
                        $scope.tabOptions = [
                            ['Duplicate', function ($itemScope, $event, modelValue, text, $li) {
                                    $itemScope.tabs.splice($itemScope.$index + 1, 0, angular.copy($itemScope.tabs[$itemScope.$index]));
                                    $itemScope.iTabs.selectedTab = $itemScope.tabs[$itemScope.$index + 1];
                                }],
                            null,
                            ['Remove', function ($itemScope, $event, modelValue, text, $li) {
                                    $itemScope.tabs.splice($itemScope.$index, 1);
                                    $itemScope.iTabs.selectedTab = $itemScope.tabs[$itemScope.tabs.length - 1];
                                    //$scope.items.splice($itemScope.$index, 1);
                                }]
                        ];
                        $scope.add = function (arr, key, index) {
                            //console.log("arr, key, index: ", arr, key, index);
                            var clone = angular.copy(arr || []);
                            clone.push(key + '[' + index + ']');
                            return clone;
                        };
                        $scope.getSelf = function (data, parents) {
                            var path = parents ? 'data.' + parents.join('.') : ''; //.replace(/\[\d+\]$/, '') : '';
                            return path ? $scope.$eval(path) : data;
                        };
                        $scope.forceObj = function (data) {
                            return angular.isObject(data) ? data : {};
                        };
                        $scope.getPath = function (parents, key, arr) {
                            var path = parents ? parents.join('.') : ''; //.replace(/\[\d+\]$/, '') : '';
                            var path2 = (path ? path + '.' : '') + key;
                            var lodash = window['_'];
                            var value = lodash.get($scope.data, path2);
                            if (!value || (!arr && (value instanceof Array))) {
                                lodash.set($scope.data, path2, arr ? [] : '');
                                value = lodash.get($scope.data, path2);
                            }
                            if (!arr) {
                                return 'data.' + path2;
                            }
                            if (value.length == 0) {
                                value.push({});
                            }
                            return value;
                        };
                        $scope.updates = function (index) {
                            return $scope.tmp.count + index;
                        };
                        $scope.deep = function (obj) {
                            return angular.extend({}, obj);
                        };
                        $scope.$watch('mainForm.$valid', function (v) { return $scope.valid = v; });
                    }
                };
            };
        }
        AngularJsonForm.factory = function () {
            var directive = function ($timeout) { return new AngularJsonForm($timeout); };
            directive.$inject = ["$timeout"];
            return directive;
        };
        return AngularJsonForm;
    }());
    Directives.AngularJsonForm = AngularJsonForm;
    var DynamicButton = (function () {
        function DynamicButton() {
            this.restrict = 'A';
            this.require = 'ngModel';
            this.scope = { click: '&', itemData: '=?' };
            this.link = function ($scope, element, attrs, ngModel) {
                element.click(function () {
                    var click = $scope.click();
                    var promise = click(ngModel.$viewValue, $scope.itemData).then(function (value) { return ngModel.$setViewValue(value); });
                });
            };
        }
        DynamicButton.instance = function () {
            return new DynamicButton();
        };
        return DynamicButton;
    }());
    Directives.DynamicButton = DynamicButton;
    var DynamicModel = (function () {
        function DynamicModel($compile, $parse) {
            var _this = this;
            this.$compile = $compile;
            this.$parse = $parse;
            this.restrict = 'A';
            this.terminal = true;
            this.priority = 100000;
            this.link = function ($scope, elem) {
                var name = _this.$parse(elem.attr('dynamic-model'))($scope);
                elem.removeAttr('dynamic-model');
                elem.attr('ng-model', name);
                _this.$compile(elem)($scope);
            };
        }
        DynamicModel.factory = function () {
            var directive = function ($compile, $parse) { return new DynamicModel($compile, $parse); };
            directive.$inject = ["$compile", "$parse"];
            return directive;
        };
        return DynamicModel;
    }());
    Directives.DynamicModel = DynamicModel;
    var ngLoad = (function () {
        function ngLoad() {
            this.restrict = 'A';
            this.scope = { ngLoad: '&?' };
            this.priority = 450;
            this.link = function ($scope, elem, attrs) {
                $scope.$watch(function () { return $scope.$eval($scope.ngLoad); }, function () { return 1; }, true);
            };
        }
        ngLoad.instance = function () {
            return new ngLoad();
        };
        return ngLoad;
    }());
    Directives.ngLoad = ngLoad;
    var DynamicAttrs = (function () {
        function DynamicAttrs() {
            this.restrict = 'A';
            this.scope = { dynamicAttrs: '=?' };
            this.link = function ($scope, elem) {
                angular.forEach($scope.dynamicAttrs, function (v, k) {
                    elem.attr(k, v);
                });
            };
        }
        DynamicAttrs.instance = function () {
            return new DynamicAttrs();
        };
        return DynamicAttrs;
    }());
    Directives.DynamicAttrs = DynamicAttrs;
    var AngularSortable = (function () {
        function AngularSortable($compile, $timeout) {
            var _this = this;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.restrict = 'A';
            this.link = function ($scope, elements, attrs) {
                var model = $scope.tabs;
                var tabs = elements.sortable({
                    "items": attrs.draggable || '> .tab-item',
                    "container": "parent",
                    //"axis": attrs.axis || "x",
                    "start": function (event, ui) {
                        ui.item.startPos = ui.item.index();
                    },
                    "stop": function (event, ui) {
                        var oldIndex = ui.item.startPos;
                        var newIndex = ui.item.index();
                        var backward = oldIndex > newIndex;
                        if (model) {
                            model.splice(newIndex + (backward ? 0 : 1), 0, model[oldIndex]);
                            model.splice(oldIndex + (backward ? 1 : 0), 1);
                            _this.$timeout(function () { return 1; }, 1);
                        }
                    }
                });
            };
        }
        AngularSortable.factory = function () {
            var directive = function ($compile, $timeout) { return new AngularSortable($compile, $timeout); };
            directive.$inject = ["$compile", "$timeout"];
            return directive;
        };
        return AngularSortable;
    }());
    Directives.AngularSortable = AngularSortable;
    var wysiwyg = (function () {
        function wysiwyg($sce) {
            var _this = this;
            this.$sce = $sce;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.scope = {};
            this.link = function ($scope, element, attrs, ngModel) {
                ngModel.$render = function () {
                    console.log("render: ", 1);
                    element.html(_this.$sce.getTrustedHtml(ngModel.$viewValue || ''));
                };
                element.on('blur keyup change', function () {
                    $scope.$evalAsync(read);
                });
                function read() {
                    var html = element.html();
                    if (html == '<br>') {
                        html = '';
                    }
                    ngModel.$setViewValue(html);
                }
            };
        }
        wysiwyg.factory = function () {
            var directive = function ($sce) { return new wysiwyg($sce); };
            directive.$inject = ["$sce"];
            return directive;
        };
        return wysiwyg;
    }());
    Directives.wysiwyg = wysiwyg;
    angular.module('AngularJsonForm', ['angular.filter', 'ui.bootstrap.contextMenu'])
        .directive('angularJsonForm', AngularJsonForm.factory())
        .directive('dynamicModel', DynamicModel.factory())
        .directive('ngLoad', ngLoad.instance)
        .directive('dynamicAttrs', DynamicAttrs.instance)
        .directive('dynamicButton', DynamicButton.instance)
        .directive('angularSortable', AngularSortable.factory())
        .directive('contenteditable', wysiwyg.factory());
})(Directives || (Directives = {}));
