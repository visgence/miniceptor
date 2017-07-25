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

        this.Safegaurd = 0;
    }

    LoadData() {
        let pathSetId = parseInt(this.$location.search().pathSet) - 1;
        if (isNaN(pathSetId)) {
            pathSetId = 0;
        }
        this.$http.get('/api/datastream').then(
            (success) => {
                const paths = success.data;
                const treeStructure = this.MakeTreeStructure(paths);
                this.RenderTree(treeStructure);
            },
            (error) => {
                console.log(error);
                $('#tree-message').toggleClass('alert-danger');
                $('#tree-message').html('Something went wrong gettin data from the server, check the console for details.');
            });
    }


    MakeTreeStructure(pathsArr) {
        let tree = [];
        pathsArr.forEach((path) => {
            tree = this.InsertNode(path.split('/'), tree);
        });
        return tree;
    }

    InsertNode(node, obj) {
        let tookParent = false;
        if (obj.text === undefined) {
            obj.text = node[0];
            tookParent = true;
        }
        if (node.length === 1) {
            return {
                text: node[0],
                info: 'something',
                selectable: true,
                color: '#333',
            };
        }
        if (obj.nodes === undefined) {
            obj.nodes = [];
            obj.selectable = false;
            obj.color = '#333';
        }

        let nodeFound = false;

        if (node[0] === obj.text) {
            for (let i = 0; i < obj.nodes.length; i ++) {
                if (node[1] === obj.nodes[i].text) {
                    nodeFound = true;
                    obj.nodes[i] = this.InsertNode(node, obj.nodes[i]);
                }
            }
        }
        if (nodeFound === false) {
            name = node.shift();
            if (tookParent === true) {
                obj.nodes = [this.InsertNode(node, {})];
            } else if (name === obj.text) {
                obj.nodes.push(this.InsertNode(node, {}));
            } else {
                obj.nodes.push({
                    text: name,
                    nodes: [this.InsertNode(node, {})],
                    selectable: false,
                    color: '#333',
                });
            }
        }
        return obj;
    }

    RenderTree(data) {
        this.$scope.nodeCount = 0;
        $(() => {
            $('#my-tree').treeview({
                data: [data],
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
                console.log(event, data);
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
                console.log('unselected');
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
                if ('info' in curNode && curNode.info.id === curStream) {
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
        if (this.$location.search().ds === info.id) {
            return;
        }
        this.$scope.$apply(() => {
            this.$location.search('ds', info.id);
        });
    }


}
