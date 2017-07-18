export default class treeController {
    constructor($scope, $location, $http, $compile, $timeout) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
        this.$http = $http;
        this.$compile = $compile;
        this.$timeout = $timeout;

        this.LoadData();

        this.$scope.pathSetSelection = this.$location.search().pathSet;
        if (this.$scope.pathSetSelection === undefined) {
            this.$scope.pathSetSelection = 0;
        }

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

        this.$scope.ChangePath = (e) => {
            if (e === 'next') {
                e = this.$scope.pathSetSelection + 1;
            }
            if (e === 'previous') {
                e = this.$scope.pathSetSelection - 1;
            }
            this.$scope.pathSetSelection = e;
            this.$location.search('pathSet', e);

            this.RequestTree();
        };


        this.$scope.$on('$routeUpdate', () => {
            const nodeFound = false;
            let i = 0;
            const ds = this.$location.search().ds;
            if (ds === undefined) {
                this.$location.search('ds', 1);
                return;
            }
            const source = this.$location.search().source;
            if (ds === undefined && source === undefined) {
                return;
            }
            while (!nodeFound && i < 500) {
                i++;
                const node = $('#my-tree').treeview('getNode', i);
                if (node.info === undefined) {
                    continue;
                }
                if (source !== node.info.source) {
                    continue;
                }
                if (parseInt(ds) !== parseInt(node.info.id)) {
                    continue;
                }
                $('#my-tree').treeview('selectNode', [i, {
                    silent: true,
                }]);
                $('#my-tree').treeview('revealNode', [i, {
                    silent: true,
                }]);
                break;
            }
        });
    }

    LoadData() {
        let pathSetId = this.$location.search().pathSet - 1;
        if (isNaN(pathSetId)) {
            pathSetId = 0;
        }
        this.$http.get('getTree').then((response) => {
            const streams = response.data.datastreams;
            this.MakeTreeStructure(streams);

            let data = {};
            streams.forEach((a) => {
                a.paths.forEach((b) => {
                    if (parseInt(b) !== pathSetId) {
                        return;
                    }
                    const curUrl = streams[a].paths[b].split('/');
                    curUrl.shift();
                    data = this.MakeTreeStructure(data, streams[a], curUrl, b);
                    this.RenderTree(data);
                });
            });
        },
        (error) => {
            console.log(error);
            $('#tree-message').toggleClass('alert-danger');
            $('#tree-message').html('Something went wrong gettin data from the server, check the console for details.');
        });
    }

    RenderTree(data) {

        this.$scope.nodeCount = 0;

        $('#my-tree').treeview({
            data: GetTree(data),
            showBorder: false,
            color: '#333',
            expandIcon: 'glyphicon glyphicon-folder-close glyphs',
            emptyIcon: 'glyphicon glyphicon-minus',
            collapseIcon: 'glyphicon glyphicon-folder-open glyphs',

        });
        $('#my-tree').treeview('collapseAll', {
            silent: true,
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

        if (streams.length === 0) {
            $('#graph-message').toggleClass('alert-danger');
            $('#graph-message').html('There are currently no streams available.');
        }

        this.BuildPathSetWidget(response.data.datastreams);


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
        data.forEach((i) => {
            this.$scope.nodeCount++;
            const newObj = {
                color: '#333',
            };
            if (data.constructor === Array) {
                newObj.info = i;
                newObj.text = i.name;
                newObj.selectable = true;
            } else {
                newObj.text = i;
                newObj.nodes = GetTree(i);
                newObj.selectable = false;
            }
            arr.push(newObj);
        });
        return arr;
    }

    BuildPathSetWidget(data) {
        let val = 0;
        data.forEach((a) => {
            if (a.paths.length > val) {
                val = a.paths.length;
            }
        });
        if (val <= 1) {
            return;
        }
        let wrapper = '<nav aria-label="Page navigation"><ul class="pagination">';
        let currentSet = this.$location.search().pathSet;
        if (currentSet === undefined) {
            currentSet = 1;
        }
        for (let i = 0; i < val; i++) {
            if (i > 7) {
                // make arrows and break;
                break;
            }
            let newButton = '<li><button class="btn btn-default';
            if (currentSet - 1 === i) {
                newButton += ' active';
            }
            newButton += '" ng-click=ChangePath(' + (i + 1) + ')>' + (i + 1) + '</button></li>';
            wrapper += newButton;
        }
        angular.element('#path-set-paginator').html('');

        angular.element('#pathSetPaginator').append(this.$compile(wrapper)($scope));
    }
}
