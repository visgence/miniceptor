require('./../../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min.js');

export default class treeController {
    constructor($scope, $location, $http, $timeout) {
        'ngInject';

        this.$scope = $scope;
        this.$location = $location;
        this.$http = $http;
        this.$timeout = $timeout;

        $scope.treeLoaded = false;

        this.LoadData();
    }

    LoadData() {
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
        this.$scope.nodeCount = 0;
        pathsArr.forEach((path) => {
            tree = this.InsertNode(path[0].split('/'), path[1], tree);
        });
        // this.$scope.nodeCount = pathsArr.length;
        return tree;
    }

    InsertNode(node, id, obj) {
        this.$scope.nodeCount += 1;
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
                id: id,
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
                    obj.nodes[i] = this.InsertNode(node, id, obj.nodes[i]);
                }
            }
        }
        if (nodeFound === false) {
            name = node.shift();
            if (tookParent === true) {
                obj.nodes = [this.InsertNode(node, id, {})];
            } else if (name === obj.text) {
                this.$scope.nodeCount --;
                obj.nodes.push(this.InsertNode(node, id, {}));
            } else {
                obj.nodes.push({
                    text: name,
                    nodes: [this.InsertNode(node, id, {})],
                    selectable: false,
                    color: '#333',
                });
            }
        }
        return obj;
    }

    RenderTree(data) {
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
            if (this.$scope.treeLoaded === false) {
                return;
            }
            this.$scope.$apply(() => {
                this.$location.search('ds', data.id);
            });

        });

        $('#my-tree').on('nodeUnselected', (event, data) => {
            console.log('unselected');

        });

        const curStream = parseInt(this.$location.search().ds);
        if (! isNaN(curStream)) {
            for (let i = 0; i < this.$scope.nodeCount; i++) {
                const curNode = $('#my-tree').treeview('getNode', i);
                if ('info' in curNode && curNode.id === curStream) {
                    $('#my-tree').treeview('revealNode', curNode);
                    $('#my-tree').treeview('selectNode', curNode);
                }
            }
        }
        if (data.length === 0) {
            $('#graph-message').toggleClass('alert-danger');
            $('#graph-message').html('There are currently no streams available.');
        }
        this.$scope.treeLoaded = true;
    }
}
