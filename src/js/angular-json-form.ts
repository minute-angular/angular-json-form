///<reference path="../../../minute/_all.d.ts"/>

module Directives {
    export class AngularJsonForm implements ng.IDirective {
        restrict = 'E';
        scope = {schema: '=', data: '=', activeTab: '=?', valid: '=?'};
        template:string = `              
        <div class="row">
            <div class="col-xs-12" ng-init="horizontal = schema.layout !== 'vertical'">
                <ng-form class="{{horizontal && 'form-horizontal' || 'form'}}" name="mainForm">      
                    <ng-include src="'render-group.html'" ng-init="clone = deep(schema);"></ng-include>
    
                    <script type="text/ng-template" id="render-group.html">
                        <div ng-repeat="child in clone.group.children" ng-init="tabs = getPath(parents, child.key, true);">
                            <div class="form-group" ng-if="child.type === 'array'" ng-show="(child.visible === undefined) || $eval(child.visible)" ng-init="self = getSelf(data, parents)">
                                <label class="{{horizontal && 'col-md-2' || ''}} control-label">{{(child.label || child.key) | ucfirst}}:</label>

                                <div class="{{horizontal && 'col-md-10' || ''}} tab-border">                        
                                    <div class="tabs-panel" ng-init="iTabs = {}">
                                        <ul class="nav nav-tabs" angular-sortable="">
                                            <li class="tab-item" ng-class="{active: tab === iTabs.selectedTab}" ng-repeat="tab in tabs track by updates($index)">                                                
                                                <a href="" ng-click="iTabs.selectedTab = tab" ng-init="iTabs.selectedTab = iTabs.selectedTab || tab;">
                                                    <button class="close closeTab" type="button" ng-click="tabs.splice($index, 1); iTabs.selectedTab = tabs[tabs.length - 1]; redraw();">×</button>
                                                    {{(child.caption || child.key) | ucfirst}} #{{$index+1}}
                                                </a>
                                            </li>
                                            <li><a href="" ng-click="tabs.push({}); iTabs.selectedTab = tabs[tabs.length - 1]; redraw();">{{child.add || ('Add ' + child.key)}}</a></li>
                                        </ul>
                                        <div class="tab-content">
                                            <div class="tab-pane fade in active" ng-repeat="tab in tabs track by updates($index)"
                                             ng-init="parents = add(parents, child.key, $index)" ng-if="tab === iTabs.selectedTab">
                                                <ng-include src="'render-group.html'" ng-init="clone = child"></ng-include>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div ng-if="child.type !== 'array'" ng-show="(child.visible === undefined) || $eval(child.visible)" ng-init="self = getSelf(data, parents)">
                                <ng-include src="'render-field-' + (clone.type || 'text') + '.html'" ng-init="clone = child; model = getPath(parents, clone.key, false)"></ng-include>
                            </div>
                        </div>
                    </script>
                    
                    <script type="text/ng-template" id="render-field-text.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <input type="{{clone.subType || 'text'}}" class="form-control" dynamic-attrs="clone.attrs" placeholder="{{clone.placeholder}}" dynamic-model="model" ng-required="clone.required">
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                    
                    <script type="text/ng-template" id="render-field-wysiwyg.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <div id="editor" dynamic-model="model" contenteditable></ng-wig>
                            </div>
                        </div>
                    </script>
                    
                    <script type="text/ng-template" id="render-field-textarea.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <textarea rows="4" type="{{clone.subType || 'text'}}" class="form-control" dynamic-attrs="clone.attrs" placeholder="{{clone.placeholder}}" 
                                dynamic-model="model" ng-required="clone.required"></textarea>
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                    
                    <script type="text/ng-template" id="render-field-select.html">				    
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <select class="form-control" dynamic-attrs="clone.attrs" placeholder="{{clone.placeholder || 'Select..'}}" dynamic-model="model" ng-required="clone.required">
                                    <option ng-repeat="option in clone.options" value="{{option.value || option}}">{{option.label || option}}</option>
                                </select>                               
                                
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                
                    <script type="text/ng-template" id="render-field-radio.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <label class="radio-inline" ng-repeat="option in clone.options">
                                    <input type="radio" dynamic-model="model" ng-value="option.value"> {{option.label || option.value}}
                                </label>
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                
                    <script type="text/ng-template" id="render-field-checkbox.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <label class="checkbox-inline" ng-repeat="option in clone.options">
                                    <input type="checkbox" dynamic-model="model" ng-value="option.value || option"> {{option.label || option.value}}
                                </label>
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                
                    <script type="text/ng-template" id="render-field-upload.html">
                        <div class="form-group">
                            <label class="{{horizontal && 'col-md-2' || ''}} control-label"><span translate="">{{(clone.label || clone.key) | ucfirst}}:</span></label>
                            <div class="{{horizontal && 'col-md-10' || ''}}">
                                <minute-uploader dynamic-model="model" type="image" preview="true" remove="true" label="{{clone.placeholder}}" url="true"></minute-uploader>
                                <p class="help-block" ng-if="!!clone.hint">{{clone.hint}}</p>
                            </div>
                        </div>
                    </script>
                </ng-form>
            </div>
        </div>           
        `;

        constructor(private $timeout:ng.ITimeoutService) {
        }

        static factory():ng.IDirectiveFactory {
            var directive:ng.IDirectiveFactory = ($timeout:ng.ITimeoutService) => new AngularJsonForm($timeout);
            directive.$inject = ["$timeout"];
            return directive;
        }

        compile = () => {
            return {
                pre: function ($scope:any) {
                    $scope.tmp = {count: 0};

                    $scope.add = (arr, key, index) => {
                        //console.log("arr, key, index: ", arr, key, index);
                        var clone = angular.copy(arr || []);
                        clone.push(key + '[' + index + ']');
                        return clone;
                    };

                    $scope.redraw = () => {
                        this.$timeout(() => $scope.tmp.count += 100);
                    };

                    $scope.getSelf = (data, parents) => {
                        var path = parents ? 'data.' + parents.join('.') : '';//.replace(/\[\d+\]$/, '') : '';
                        return path ? $scope.$eval(path) : data;
                    };

                    $scope.getPath = (parents, key, arr) => {
                        var path = parents ? parents.join('.') : '';//.replace(/\[\d+\]$/, '') : '';
                        var path2 = ( path ? path + '.' : '' ) + key;
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

                    $scope.updates = (index) => {
                        return $scope.tmp.count + index;
                    };

                    $scope.deep = (obj) => {
                        return angular.extend({}, obj);
                    };

                    $scope.$watch('mainForm.$valid', (v) => $scope.valid = v);
                }
            }
        }
    }

    export class DynamicModel implements ng.IDirective {
        restrict = 'A';
        terminal = true;
        priority = 100000;

        constructor(private $compile:ng.ICompileService, private $parse:ng.IParseService) {
        }

        static factory():ng.IDirectiveFactory {
            var directive:ng.IDirectiveFactory = ($compile:ng.ICompileService, $parse:ng.IParseService) => new DynamicModel($compile, $parse);
            directive.$inject = ["$compile", "$parse"];
            return directive;
        }

        link = ($scope:any, elem:ng.IAugmentedJQuery) => {
            let name = this.$parse(elem.attr('dynamic-model'))($scope);
            elem.removeAttr('dynamic-model');
            elem.attr('ng-model', name);
            this.$compile(elem)($scope);
        }
    }

    export class DynamicAttrs implements ng.IDirective {
        restrict = 'A';
        scope = {dynamicAttrs: '=?'};

        static instance():any {
            return new DynamicAttrs();
        }

        link = ($scope:any, elem:ng.IAugmentedJQuery) => {
            angular.forEach($scope.dynamicAttrs, function (v, k) {
                elem.attr(k, v);
            });
        }
    }

    export class AngularSortable implements ng.IDirective {
        restrict = 'A';

        constructor(private $compile:ng.ICompileService, private $timeout:ng.ITimeoutService) {
        }

        static factory():ng.IDirectiveFactory {
            var directive:ng.IDirectiveFactory = ($compile:ng.ICompileService, $timeout:ng.ITimeoutService) => new AngularSortable($compile, $timeout);
            directive.$inject = ["$compile", "$timeout"];
            return directive;
        }

        link = ($scope:any, elements:any, attrs:any) => {
            let model = $scope.tabs;

            var tabs = elements.sortable({
                "items": attrs.draggable || '> .tab-item',
                "axis": attrs.axis || "x",
                "start": (event, ui) => {
                    ui.item.startPos = ui.item.index();
                },
                "stop": (event, ui) => {
                    var oldIndex = ui.item.startPos;
                    var newIndex = ui.item.index();
                    var backward = oldIndex > newIndex;

                    if (model) {
                        model.splice(newIndex + (backward ? 0 : 1), 0, model[oldIndex]);
                        model.splice(oldIndex + (backward ? 1 : 0), 1);

                        $scope.redraw();
                    }
                }
            });

        }
    }

    export class wysiwyg implements ng.IDirective {
        restrict = 'A';
        require = 'ngModel';
        scope = {};

        constructor(private $sce) {
        }

        static factory():ng.IDirectiveFactory {
            var directive:ng.IDirectiveFactory = ($sce) => new wysiwyg($sce);
            directive.$inject = ["$sce"];
            return directive;
        }

        link = ($scope:any, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ngModel) => {
            ngModel.$render = () => {
                console.log("render: ", 1);
                element.html(this.$sce.getTrustedHtml(ngModel.$viewValue || ''));
            };

            element.on('blur keyup change', function() {
                $scope.$evalAsync(read);
            });

            function read() {
                var html = element.html();

                if ( html == '<br>' ) {
                    html = '';
                }

                ngModel.$setViewValue(html);
            }
        }
    }

    angular.module('AngularJsonForm', ['angular.filter'])
        .directive('angularJsonForm', AngularJsonForm.factory())
        .directive('dynamicModel', DynamicModel.factory())
        .directive('dynamicAttrs', DynamicAttrs.instance)
        .directive('angularSortable', AngularSortable.factory())
        .directive('contenteditable', wysiwyg.factory());
}