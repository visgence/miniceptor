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

        $scope.pathSetSelection = $location.search().pathSet;
        if ($scope.pathSetSelection === undefined) {
            $scope.pathSetSelection = 0;
        }

        $scope.ChangePath = (e) => {
            if (e === 'next') {
                e = $scope.pathSetSelection + 1;
            }
            if (e === 'previous') {
                e = $scope.pathSetSelection - 1;
            }
            $scope.pathSetSelection = e;
            $location.search('pathSet', e);

            this.RequestTree();
        };

        $(() => {
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
    }

    LoadData() {
        let pathSetId = this.$location.search().pathSet - 1;
        if (isNaN(pathSetId)) {
            pathSetId = 0;
        }
        this.$http.get('/api/datastream').then(
            (success) => {
                const streams = success.data;
                let data = {};
                streams.forEach((a) => {
                    for (let i = 0; i < a.paths.length; i++) {
                        if (i !== pathSetId) {
                            return;
                        }
                        const curUrl = a.paths[i].split('/');

                        curUrl.shift();
                        data = this.MakeTreeStructure(data, a, curUrl, a.paths[i]);
                    };
                });
                console.log(data)
                this.BuildPathSetWidget(data);
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
        });

        const curStream = this.$location.search().ds;

        let currentPathSet = this.$location.search().pathSet;
        if (currentPathSet === undefined) {
            currentPathSet = 1;
        }

        if (curStream !== undefined) {
            for (let c = 0; c < this.$scope.nodeCount; c++) {
                const curNode = $('#my-tree').treeview('getNode', c);
                if ('info' in curNode && curNode.info.id === parseInt(curStream)) {
                    $('#my-tree').treeview('revealNode', curNode);
                    $('#my-tree').treeview('selectNode', curNode);
                    this.SelectTreeNode(curNode.info);
                }
            }
        }
        if (data.length === 0) {
            $('#graph-message').toggleClass('alert-danger');
            $('#graph-message').html('There are currently no streams available.');
        }
    }

    SelectTreeNode(info) {
        if (info === undefined) {
            return;
        }
        this.$timeout(() => {
            this.$scope.$apply(() => {
                this.$location.search('ds', info.id);
            });
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

    BuildPathSetWidget(data) {
        const val = Object.keys(data).length;

        if (val <= 1) {
            return;
        }

        const wrapper = $('<nav>', {
            'aria-label': 'Page navigation',
        });
        const menu = $('<ul>', {
            class: 'pagination clearfix',
        });

        let currentSet = this.$location.search().pathSet;
        if (currentSet === undefined) {
            currentSet = 1;
        }
        for (let i = 0; i < val; i++) {
            if (i > 7) {
                // make arrows and break;
                break;
            }

            const newButton = $('<a>', {
                'class': 'btn btn-default',
                'ng-click': 'ChangePath(' + (i + 1) + ')',
            });
            newButton.html(i)
            if (currentSet - 1 === i) {
                newButton.toggleClass('active');
            }
            const li = $('<li>');
            li.append(newButton);
            menu.append(li);
        }
        wrapper.append(menu);
        // $('#path-set-paginator').html('hello');
        console.log(wrapper);
        $('#path-set-paginator').html(wrapper);
    }
}
