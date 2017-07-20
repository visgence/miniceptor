require('./../../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min.js');

export default class treeController {
    constructor($scope, $location, $http, $compile, $timeout) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
        this.$http = $http;
        this.$compile = $compile;
        this.$timeout = $timeout;

        this.LoadData();

        $scope.ChangePath = (e) => {
            $location.search('pathSet', e - 1);
            this.LoadData();
        };
    }

    LoadData() {
        let pathSetId = parseInt(this.$location.search().pathSet) - 1;
        if (isNaN(pathSetId)) {
            pathSetId = 0;
        }
        this.$http.get('/api/datastream').then(
            (success) => {
                const streams = success.data;
                let data = {};
                let count = 0;
                streams.forEach((a) => {
                    count = count > a.paths.length ? count : a.paths.length;
                    for (let i = 0; i < a.paths.length; i++) {
                        if (i !== pathSetId) {
                            continue;
                        }
                        const curUrl = a.paths[i].split('/');

                        curUrl.shift();
                        data = this.MakeTreeStructure(data, a, curUrl, a.paths[i]);
                    };
                });
                this.BuildPathSetWidget(count);
                this.RenderTree(data);
            },
            (error) => {
                console.log(error);
                $('#tree-message').toggleClass('alert-danger');
                $('#tree-message').html('Something went wrong gettin data from the server, check the console for details.');
            });
    }

    MakeTreeStructure(data, stream, curUrl, pathId) {
        if (curUrl.length <= 1) {
            if (!(curUrl[0] in data)) {
                data[curUrl[0]] = [];
            }
            stream.pathId = pathId;
            data[curUrl[0]].push(stream);
            return data;
        }
        if (!(curUrl[0] in data)) {
            data[curUrl[0]] = {};
        }
        const temp = curUrl.shift();
        data[temp] = this.MakeTreeStructure(data[temp], stream, curUrl, pathId);
        return data;
    }

    RenderTree(data) {
        this.$scope.nodeCount = 0;
        $(() => {
            $('#my-tree').treeview({
                data: this.GetTree(data),
                showBorder: false,
                color: '#333',
                expandIcon: 'glyphicon glyphicon-folder-close glyphs',
                emptyIcon: 'glyphicon glyphicon-minus',
                collapseIcon: 'glyphicon glyphicon-folder-open glyphs',
            });

            $('#my-tree').treeview('collapseAll', {
                silent: true,
            });

            $('#my-tree').on('nodeSelected', (event, data) => {
                if (data.info === undefined) {
                    $('#my-tree').treeview('expandNode', [data.nodeId, {
                        levels: 2,
                        silent: true,
                    }]);
                } else {
                    this.SelectTreeNode(data.info);
                }
            });

            $('#my-tree').on('nodeUnselected', (event, data) => {
                if (data.info === undefined) {
                    $('#my-tree').treeview('collapseNode', [data.nodeId, {
                        levels: 2,
                        ignoreChildren: false,
                    }]);
                }
            });
        });

        const curStream = this.$location.search().ds;

        let currentPathSet = parseInt(this.$location.search().pathSet);
        if (isNaN(currentPathSet)) {
            currentPathSet = 1;
        }

        if (curStream !== undefined) {
            for (let c = 0; c < this.$scope.nodeCount; c++) {
                const curNode = $('#my-tree').treeview('getNode', c);
                if ('info' in curNode && curNode.info.uuid === curStream) {
                    $('#my-tree').treeview('revealNode', curNode);
                    $('#my-tree').treeview('selectNode', curNode);
                }
            }
        }
        if (data.length === 0) {
            $('#graph-message').toggleClass('alert-danger');
            $('#graph-message').html('There are currently no streams available.');
        }
    }

    SelectTreeNode(info) {
        if (this.$location.search().ds === info.uuid) {
            return;
        }
        this.$scope.$apply(() => {
            this.$location.search('ds', info.uuid);
        });
    }

    GetTree(data) {
        const arr = [];
        Object.keys(data).forEach((i) => {
            this.$scope.nodeCount++;
            const newObj = {
                color: '#333',
            };
            if (data.constructor === Array) {
                newObj.info = data[i];
                newObj.text = data[i].uuid;
                newObj.selectable = true;
            } else {
                newObj.text = i;
                newObj.nodes = this.GetTree(data[i]);
                newObj.selectable = false;
            }
            arr.push(newObj);
        });
        return arr;
    }

    BuildPathSetWidget(count) {


        const wrapper = $('<nav>', {
            'aria-label': 'Page navigation',
        });
        const menu = $('<ul>', {
            class: 'pagination clearfix',
        });

        let currentSet = parseInt(this.$location.search().pathSet);
        if (isNaN(currentSet)) {
            currentSet = 1;
        }
        for (let i = 1; i <= count; i++) {
            if (i > 7) {
                // make arrows and break;
                break;
            }

            const newButton = $('<a>', {
                'class': 'btn btn-default',
                'ng-click': 'ChangePath(' + (i + 1) + ')',
            });
            newButton.html(i);
            if (currentSet === i) {
                newButton.toggleClass('active');
            }
            const li = $('<li>');
            li.append(newButton);
            menu.append(li);
        }
        wrapper.append(menu);
        $('#path-set-paginator').html(this.$compile(wrapper)(this.$scope));
    }
}
